import { sendToBackground } from "@plasmohq/messaging"
import type { PlasmoCSConfig } from "plasmo"

import { ACTION_BTN_ID } from "~const"

export {}
export const config: PlasmoCSConfig = {
  matches: ["https://github.com/*"],
  all_frames: false
}

const createCheckbox = (parentNode: HTMLElement) => {
  const input = document.createElement("input")
  input.type = "checkbox"
  input.style.marginRight = "6px"
  parentNode.prepend(input)
  input.setAttribute("v-git-batch-checkbox", "true")
}

;(async function () {
  try {
    const resp: {
      logged_in: boolean
      isAuth: boolean
    } = await sendToBackground({
      name: "check-login"
    })

    console.log("init check resp:", resp)

    const { logged_in, isAuth } = resp

    if (logged_in) {
      // query items
      const { href } = location
      if (
        href.includes("?tab=repositories") &&
        href.startsWith("https://github.com/")
      ) {
        // create delete button after
        const filterContainer = document.querySelector(
          '#user-profile-frame form[role="search"]'
        )?.parentElement

        if (filterContainer) {
          const button = document.createElement("button")
          button.id = ACTION_BTN_ID
          button.textContent = isAuth ? "Delete" : "Authorization"
          button.className = `text-center btn ml-2 ${isAuth ? "btn-danger" : "btn-primary"}`
          button.onclick = function () {
            // 如果没有认证，就认证
            if (!isAuth) {
              sendToBackground({
                name: "auth"
              })
              return
            }

            const list = document.querySelectorAll(
              'input[type="checkbox"][v-git-batch-checkbox]:checked'
            )
            if (list.length) {
              if (
                window?.confirm("Are you sure to delete these repositories?")
              ) {
                const repos = Array.from(list).map((item) => {
                  const li = item.parentElement
                  return li.querySelector("a").textContent.trim()
                })

                sendToBackground({
                  name: "delete-repos",
                  body: {
                    account: "AaronConlon",
                    repos
                  }
                }).then((res) => {
                  const { deletedRepos } = res
                  const container = document.querySelector(
                    "#user-repositories-list"
                  )
                  deletedRepos.forEach((repo) => {
                    container
                      .querySelector(`li[data-v-git-batch-item-name='${repo}']`)
                      ?.remove()
                  })
                  alert(`Deleted ${deletedRepos.length} repositories`)
                })
              }
            } else {
              alert("Please select at least one repository")
            }
          }

          filterContainer.appendChild(button)
        }

        const container = document.querySelector("#user-repositories-list")

        const list = container.querySelectorAll("li")
        if (list.length) {
          // add checkbox
          list.forEach((item) => {
            const repoName = item.querySelector("h3 a")?.textContent.trim()
            item.setAttribute("data-v-git-batch-item-name", repoName)
            const h3 = item.querySelector("h3")
            if (h3.querySelector("input")) return
            createCheckbox(h3)
          })
        }

        // 监听 DOM 变化
        const observer = new MutationObserver(function (mutations) {
          mutations.forEach(function () {
            container.querySelectorAll("li").forEach((item) => {
              const repoName = item.querySelector("h3 a")?.textContent.trim()
              item.setAttribute("data-v-git-batch-item-name", repoName)
              const h3 = item.querySelector("h3")
              if (h3.querySelector("input")) return
              createCheckbox(h3)
            })
          })
        })

        observer.observe(container, {
          childList: true
        })
      }
    }
  } catch (error) {
    console.log("get response error:", error)
  }
})()
