import type { PlasmoMessaging } from "@plasmohq/messaging"

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

const handler: PlasmoMessaging.MessageHandler<{
  account: string
  repos: string[]
}> = async (req, res) => {
  const {
    body: { account, repos }
  } = req
  const { access_token } = await chrome.storage.sync.get("access_token")
  const batchTask = await Promise.allSettled(
    deleteRepos(account, repos, access_token)
  )

  const deletedRepos = batchTask
    .filter((i) => i.status === "fulfilled")
    .map((i) => i.value)

  res.send({ info: "success", deletedRepos })
}

export default handler
