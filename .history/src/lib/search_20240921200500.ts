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
/**
 * 异步存储FlexSearch数据到本地存储中
 *
 * 此函数的目的是将一组搜索项（SearchItem数组）保存到本地存储中，以便之后检索或使用
 * 它使用了异步操作来确保UI响应性，并在操作成功时在控制台输出成功消息，在操作失败时输出错误信息
 *
 * @param searchItems 要存储的搜索项数组，包含了需要保存的所有搜索数据
 */
async function storeFlexSearchData(searchItems: SearchItem[]) {
  try {
    await storage.set("flexSearchData", searchItems)
    console.log("FlexSearch data stored successfully!")
  } catch (err) {
    console.error("Error storing FlexSearch data:", err)
  }
}

async function loadFlexSearchData(): Promise<SearchItem[] | null> {
  try {
    const storedData = await storage.get<SearchItem[]>("flexSearchData")
    if (storedData) {
      console.log("FlexSearch data loaded successfully!")
      return storedData
    } else {
      console.log("No FlexSearch data found in storage.")
      return null
    }
  } catch (err) {
    console.error("Error loading FlexSearch data:", err)
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