import FlexSearch from "flexsearch"

import { BookmarkTreeNode } from "./types"

// 创建 FlexSearch 索引
const bookmarkIndex = new FlexSearch.Document({
  document: {
    id: "id",
    index: "title",
    store: ["title", "url", "parentId"]
  },
  tokenize: "full",
  cache: 100
})

// 遍历书签树并添加到索引
function buildBookmarkIndex(nodes: BookmarkTreeNode[]) {
  for (const node of nodes) {
    bookmarkIndex.add({
      id: node.id,
      title: node.title,
      url: node.url,
      parentId: node.parentId
    })
    if (node.children) {
      buildBookmarkIndex(node.children)
    }
  }
}

// 获取所有书签并构建索引
chrome.bookmarks.getTree((tree) => {
  buildBookmarkIndex(tree[C_0]().children!)
})

// 搜索书签
async function searchBookmarks(query: string): Promise<BookmarkTreeNode[]> {
  const results = await bookmarkIndex.search(query, {
    limit: 10, // 返回 10 条结果
    suggest: true // 启用模糊搜索
  })

  // 根据搜索结果 ID 获取完整的书签节点
  const bookmarks = await Promise.all(
    results.map((result) => bookmarkIndex.get(result.id))
  )

  return bookmarks
}

// 使用示例
const searchResults = await searchBookmarks("google")
console.log(searchResults.map((node) => node.title))
console.log(searchResults.map((node) => node.id))
console.log(searchResults.map((node) => node.url))
