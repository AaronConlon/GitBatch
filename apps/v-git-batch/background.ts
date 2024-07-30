import { APP_NAME } from "~const"

export {}

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

function deleteRepos(account: string, repos: string[], access_token: string) {
  return repos.map((repo) => {
    // 调用 api 删除仓库
    return fetch(`https://api.github.com/repos/${account}/${repo}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    }).then((response) => {
      if (response.status === 204) {
        return repo
      } else {
        console.error(`Failed to delete repository ${repo}`)
        throw Error(`Failed to delete repository ${repo}`)
      }
    })
  })
}

chrome.runtime.onMessage.addListener(async function (
  request: {
    name: string
    action: "check_logged_in" | "delete" | "authenticate"
    payload?: {
      account: string
      repos: string[]
    }
  },
  sender,
  sendResponse
) {
  const { name, payload, action } = request
  if (name === APP_NAME) {
    const { access_token } = await chrome.storage.sync.get("access_token")
    try {
      if (action === "check_logged_in") {
        const { origin } = sender
        const cookies = await chrome.cookies.getAll({
          url: origin,
          domain: "github.com"
        })

        const logged_in_item = cookies.find((i) => i.name === "logged_in")
        // get access token
        sendResponse({
          logged_in: logged_in_item?.value === "yes",
          access_token
        })
      } else if (action === "delete" && payload?.repos.length) {
        const batchTask = await Promise.allSettled(
          deleteRepos(payload.account, payload.repos, access_token)
        )

        const deletedRepos = batchTask
          .filter((i) => i.status === "fulfilled")
          .map((i) => i.value)
        sendResponse({
          name: APP_NAME,
          message: "deleted",
          deletedRepos
        })
      } else if (action === "authenticate") {
        authenticate(sender.tab.id)
        sendResponse()
      }
    } catch (error) {
      console.log("background init error:", error)
      return {
        error: error.message
      }
    }
  }
})
