import Browser from "webextension-polyfill"

import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.Handler = async (req: any, res: any) => {
  const type = req.body.type
  try {
    switch (type) {
      case "getAllTabs":
        const allTabs = await Browser.tabs.query({})
        console.log(allTabs, "123")

        res.send({ tabs: allTabs })
        break
      case "changeTab":
        const tabs = await Browser.tabs.query({ currentWindow: true })
        // 遍历标签页,找到 指定的 URL
        for (let tab of tabs) {
          if (tab.url === req.body.url) {
            // 切换到该标签页
            await Browser.tabs.update(Number(tab.id), { active: true })
            break
          }
        }
        break
      case "get":
        await Browser.tabs.query({}).then((tabs) => {
          tabs.forEach((tab) => {
            console.log(tab, "tab")
            chrome.scripting.executeScript(
              {
                target: { tabId: tab.id },
                func: () => {
                  return document
                }
              },
              (result) => {
                console.log(result[0].result)
              }
            )
          })
        })

        break

      default:
        res.send({ error: "Unsupported operation" })
    }
  } catch (error) {
    res.send({ error: error.message })
  }
}

export default handler
