import FlexSearch, { type SimpleDocumentSearchResultSetUnit } from "flexsearch"

import { Storage } from "@plasmohq/storage"

// 创建 Storage 实例
const storage = new Storage()

// 定义要存储的 SearchItem 结构
interface SearchItem {
  id: string
  title: string
  url: string
  type: string
  iconUrl?: string
}

// 创建 FlexSearch 索引
function createIndex(
  searchItems: SearchItem[]
): FlexSearch.Document<unknown, string[]> {
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
 * @param {SearchItem[]} searchItems - 要建立索引的搜索项数组
 * @param {string} value - 搜索关键词
 * @returns {Promise<SimpleDocumentSearchResultSetUnit[]>} 搜索结果的 Promise 对象
 */
export const doSearch = async (
  searchItems: SearchItem[],
  value: string
): Promise<SimpleDocumentSearchResultSetUnit[]> => {
  let index = await loadFlexSearchIndex()
  if (!index) {
    index = createIndex(searchItems)
    await storeFlexSearchIndex(index)
  }

  return index.search(value)
}
