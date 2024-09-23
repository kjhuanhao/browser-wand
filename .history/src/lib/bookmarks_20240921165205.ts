export function flattenBookmarks(
  nodes: chrome.bookmarks.BookmarkTreeNode[]
): SearchItem[] {
  const result: SearchItem[] = []
  console.log(new DOMParser(), 123)
  function traverse(node: chrome.bookmarks.BookmarkTreeNode) {
    if (node.url) {
      // 从 url 中获取根 URL
      const rootUrl = new URL(node.url).origin
      const searchItem: SearchItem = {
        id: node.id,
        title: node.title,
        url: node.url,
        type: "bookmark",
        iconUrl:
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
