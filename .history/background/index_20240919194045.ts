chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getBookmarks") {
    chrome.bookmarks.getTree((bookmarkTreeNodes) => {
      const flattenBookmarks = (
        nodes: chrome.bookmarks.BookmarkTreeNode[]
      ): any[] => {
        return nodes.reduce((acc, node) => {
          if (node.url) {
            acc.push({ id: node.id, title: node.title, url: node.url })
          }
          if (node.children) {
            acc.push(...flattenBookmarks(node.children))
          }
          return acc
        }, [] as any[])
      }

      sendResponse(flattenBookmarks(bookmarkTreeNodes))
    })
    return true // 保持消息通道打开以进行异步响应
  }
})
