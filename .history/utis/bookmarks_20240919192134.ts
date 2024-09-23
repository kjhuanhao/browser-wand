import type { PlasmoMessaging } from "@plasmohq/messaging"

const getBookmarks = async (): Promise<chrome.bookmarks.BookmarkTreeNode[]> => {
  return new Promise((resolve) => {
    chrome.bookmarks.getTree((bookmarkTreeNodes) => {
      resolve(bookmarkTreeNodes)
    })
  })
}

// 在后台脚本（background script）中使用消息传递
export const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  if (req.name === "getBookmarks") {
    const bookmarks = await getBookmarks()
    res.send(bookmarks)
  }
}
