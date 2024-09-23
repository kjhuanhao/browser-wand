import FlexSearch, { type SimpleDocumentSearchResultSetUnit } from "flexsearch"

import { Storage } from "@plasmohq/storage"

// 创建存储实例
const storage = new Storage()

// 创建 FlexSearch 索引
export function createIndex(searchItems: SearchItem[]) {
  const index = new FlexSearch.Document({
    tokenize: "full",
    cache: 100,
    document: {
      id: "id",
      index: "title",
      store: ["url", "type", "iconUrl"]
    },
    context: {
      resolution: 9,
      depth: 2,
      bidirectional: true
    }
  })

  searchItems.forEach((item) => {
    index.add(item)
  })

  return index
}

// 将 FlexSearch 索引存储到 storage 中
async function storeFlexSearchIndex(index: FlexSearch.Document) {
  try {
    await storage.set("flexSearchIndex", index)
    console.log("FlexSearch index stored successfully!")
  } catch (err) {
    console.error("Error storing FlexSearch index:", err)
  }
}

// 从 storage 中读取 FlexSearch 索引
async function loadFlexSearchIndex(): Promise<FlexSearch.Document | null> {
  try {
    const storedIndex =
      await storage.get<FlexSearch.Document>("flexSearchIndex")
    if (storedIndex) {
      console.log("FlexSearch index loaded successfully!")
      return storedIndex
    } else {
      console.log("No FlexSearch index found in storage.")
      return null
    }
  } catch (err) {
    console.error("Error loading FlexSearch index:", err)
    return null
  }
}

/**
 * 执行搜索
 * @param {string} value - 搜索关键词
 * @returns {Promise<SimpleDocumentSearchResultSetUnit[]>} 搜索结果的 Promise 对象
 */
export const doSearch = async (
  value: string
): Promise<SimpleDocumentSearchResultSetUnit[]> => {
  const index = await loadFlexSearchIndex()
  if (index) {
    return index.search(value)
  } else {
    return []
  }
}
