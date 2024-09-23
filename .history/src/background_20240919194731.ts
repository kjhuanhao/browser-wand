chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getBookmarks") {
    console.log(123)
    chrome.bookmarks.getTree((bookmarkTreeNodes) => {
      sendResponse(bookmarkTreeNodes)
    })
  }
})
