// 监听来自前台的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_BOOKMARKS") {
    // 获取书签树
    chrome.bookmarks.getTree((bookmarkTreeNodes) => {
      // 发送书签数据作为响应
      sendResponse({ bookmarks: bookmarkTreeNodes })
    })
    // 返回 true 表示将异步调用 sendResponse
    return true
  }
})
