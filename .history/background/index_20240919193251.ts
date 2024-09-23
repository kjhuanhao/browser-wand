import type { PlasmoMessaging } from "@plasmohq/messaging"

const getBookmarks = async (): Promise<chrome.bookmarks.BookmarkTreeNode[]> => {
  return new Promise((resolve) => {
    chrome.bookmarks.getTree((bookmarkTreeNodes) => {
      resolve(bookmarkTreeNodes)
    })
  })
}

export {}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("123")
  if (message.type === "GET_BOOKMARKS") {
    getBookmarks().then((bookmarks) => {
      sendResponse(bookmarks)
    })
    return true // 表示会异步发送响应
  }
})
