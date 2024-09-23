import FlexSearch, { type SimpleDocumentSearchResultSetUnit } from "flexsearch"

export function createIndex(searchItems: SearchItem[]) {
  // 创建索引
  const index = new FlexSearch.Document({
    tokenize: "full",
    cache: 100,
    document: {
      id: "id",
      index: "title",
      store: ["url", "type", "iconUrl"]
    },
    context: {
      resolution: 9, // 设置上下文分辨率为 9
      depth: 2, // 设置上下文深度为 2
      bidirectional: true // 启用双向上下文分析
    }
  })

  searchItems.forEach((item) => {
    index.add(item)
  })
}

/**
 * 执行搜索
 * @param {string} value - 搜索关键词
 * @returns {Promise<Array>} 搜索结果的 Promise 对象
 */
export const doSearch = async (
  value: string
): Promise<SimpleDocumentSearchResultSetUnit[]> => {
  return index.search(value)
}
