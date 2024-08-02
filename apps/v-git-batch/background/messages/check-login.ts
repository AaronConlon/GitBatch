import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { access_token } = await chrome.storage.sync.get("access_token")

  // Function to check if the access token is valid
  const isTokenValid = async (token: string) => {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `bearer ${token}`
      }
    })
    return response.status === 200
  }

  const cookies = await chrome.cookies.getAll({
    url: req.targetOrigin,
    domain: "github.com"
  })
  console.log("cookie", cookies)
  const logged_in_item = cookies.find((i) => i.name === "logged_in")
  console.log(logged_in_item)
  const logged_in = logged_in_item?.value === "yes"
  const isValid = await isTokenValid(access_token)

  const message = {
    logged_in: logged_in_item?.value === "yes",
    isAuth: isValid && logged_in
  }

  console.log("check login message:", message)

  res.send(message)
}

export default handler
