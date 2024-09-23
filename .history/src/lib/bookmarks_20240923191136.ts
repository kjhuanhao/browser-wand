import { sendToBackground } from "@plasmohq/messaging"

export async function fetchBookmarks() {
  if (chrome.runtime?.id) {
    try {
      const response = await sendToBackground({
        name: "bookmarks",
        body: {
          type: "getTree"
        }
      })
      if (response.bookmarksTree) {
        const flattenedBookmarks = flattenBookmarks(response.bookmarksTree)
        return flattenedBookmarks
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error)
    }
  }
}

export function flattenBookmarks(
  nodes: chrome.bookmarks.BookmarkTreeNode[]
): SearchItem[] {
  const result: SearchItem[] = []

  function traverse(node: chrome.bookmarks.BookmarkTreeNode) {
    if (node.url) {
      // 从 url 中获取根 URL
      const rootUrl = new URL(node.url).origin
      let iconUrl: string | null = null
      const urlProtocol = new URL(rootUrl).protocol

      if (urlProtocol === "http:") {
        // 如果 favIconUrl 使用的是 HTTP 协议,则设置为 null
        iconUrl = null
      } else {
        iconUrl = rootUrl + "/favicon.ico"
      }

      const searchItem: SearchItem = {
        id: node.id,
        title: node.title,
        url: node.url,
        type: "bookmark",
        iconUrl: iconUrl,
        emoji: "🔖"
      }
      result.push(searchItem)
    }

    if (node.children) {
      for (const child of node.children) {
        traverse(child)
      }
    }
  }

  for (const node of nodes) {
    traverse(node)
  }

  return result
}
