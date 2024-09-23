import FlexSearch, { type SimpleDocumentSearchResultSetUnit } from "flexsearch"

import { Storage } from "@plasmohq/storage"

// 创建 Storage 实例
const storage = new Storage({ area: "local" })

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
      store: ["title", "url", "type", "iconUrl"]
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

async function storeFlexSearchData(searchItems: SearchItem[]) {
  try {
    await storage.set("flexSearchData", searchItems)
    console.log("FlexSearch data stored successfully!")
  } catch (err) {
    console.error("Error storing FlexSearch data:", err)
  }
}

// 从 storage 中读取 FlexSearch 索引
async function loadFlexSearchIndex(): Promise<FlexSearch.Document<
  unknown,
  string[]
> | null> {
  try {
    const storedIndex =
      await storage.get<FlexSearch.Document<unknown, string[]>>(
        "flexSearchIndex"
      )
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
  // 创建索引
  let index = createIndex(searchItems)

  // 执行搜索
  const searchResults = index.search(value, {
    limit: 10,
    suggest: true,
    enrich: true
  })

  return searchResults
}
