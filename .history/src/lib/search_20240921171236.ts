import FlexSearch, {
  type DocumentSearchResult,
  type SimpleDocumentSearchResultSetUnit
} from "flexsearch"

// 定义 SearchItem 数组
const searchItems = [
  {
    id: "1",
    title: "First Item",
    url: "http://example.com/1",
    type: "type1",
    iconUrl: "http://example.com/icon1.png"
  },
  {
    id: "2",
    title: "Second Item",
    url: "http://example.com/2",
    type: "type2",
    iconUrl: "http://example.com/icon2.png"
  },
  { id: "3", title: "Third Item", url: "http://example.com/3", type: "type1" }
  // 其他条目...
]

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

export function createIndex() {
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
