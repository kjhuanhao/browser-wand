interface SearchItem {
  id: string
  title: string
  url: string
  type: "bookmark" | "history"
}

function flattenBookmarks(nodes: BookmarkTreeNode[]): SearchItem[] {
  const result: SearchItem[] = []

  function traverse(node: BookmarkTreeNode) {
    const searchItem: SearchItem = {
      id: node.id,
      title: node.title,
      url: node.url || "",
      type: "bookmark"
    }
    result.push(searchItem)

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
