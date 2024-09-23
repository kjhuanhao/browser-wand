async function fetchIconUrl(url: string): Promise<string | undefined> {
  try {
    // 模拟从服务器获取图标 URL
    const response = await fetch(`/api/icon?url=${url}`)
    if (response.ok) {
      const { iconUrl } = await response.json()
      return iconUrl
    }
  } catch (error) {
    console.error("Error fetching icon URL:", error)
  }
  return undefined
}
export function flattenBookmarks(
  nodes: chrome.bookmarks.BookmarkTreeNode[]
): SearchItem[] {
  const result: SearchItem[] = []

  function traverse(node: chrome.bookmarks.BookmarkTreeNode) {
    if (node.url) {
      const searchItem: SearchItem = {
        id: node.id,
        title: node.title,
        url: node.url,
        type: "bookmark"
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
