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
