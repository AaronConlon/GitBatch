import type { PlasmoMessaging } from "@plasmohq/messaging"

function authenticate(tabId: number) {
  const redirectUri = chrome.identity.getRedirectURL()
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.PLASMO_PUBLIC_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=delete_repo`

  chrome.identity.launchWebAuthFlow(
    { url: authUrl, interactive: true },
    function (redirectUrl) {
      if (chrome.runtime.lastError || !redirectUrl) {
        console.error(chrome.runtime.lastError)
        return
      }
      // 解析重定向 URL 获取授权码
      const urlParams = new URLSearchParams(new URL(redirectUrl).search)
      const code = urlParams.get("code")

      // 使用授权码交换访问令牌
      fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          client_id: process.env.PLASMO_PUBLIC_CLIENT_ID,
          client_secret: process.env.PLASMO_PUBLIC_SECRET_ID,
          code: code
        })
      })
        .then((response) => response.json())
        .then((data) => {
          if (data?.access_token) {
            const access_token = data.access_token
            chrome.storage.sync.set({ access_token })
            // refresh the tab
            chrome.tabs.reload(tabId)
          }
        })
    }
  )
}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  authenticate(req.tabId)
  res.send({ info: "success" })
}

export default handler
