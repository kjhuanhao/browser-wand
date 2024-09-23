// background.js

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === "keepAlive") {
    port.onMessage.addListener(function (message) {
      if (message.type === "GET_BOOKMARKS") {
        chrome.bookmarks.getTree((bookmarkTreeNodes) => {
          // 发送书签数据给内容脚本
          port.postMessage({ bookmarks: bookmarkTreeNodes })
        })
      }
    })
  }
})
