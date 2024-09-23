import FlexSearch, { type SimpleDocumentSearchResultSetUnit } from "flexsearch"

import { Storage } from "@plasmohq/storage"

import { fetchBookmarks } from "./bookmarks"

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
/**
 * 异步加载 FlexSearch 数据
 *
 * 本函数尝试从存储中获取名为 "flexSearchData" 的数据如果数据存在，则返回该数据；
 * 否则，返回 null 函数通过异步方式操作存储，并处理错误情况
 *
 * @returns {Promise<SearchItem[] | null>} - 返回一个 Promise， resolves 为搜索项数组或 null
 */
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
  query: string
): Promise<SimpleDocumentSearchResultSetUnit[]> => {
  let searchItems: SearchItem[] = []
  // 从本地获取书签，如果没有则重新获取
  const storedData = await loadFlexSearchData()
  if (storedData) {
    searchItems = storedData
  } else {
    // TODO 策略模式
    const bookmarks = await fetchBookmarks()
    searchItems = bookmarks
    // 将搜索项保存到本地存储
    await storeFlexSearchData(searchItems)
  }
  console.log(searchItems)

  // 创建索引
  let index = createIndex(searchItems)

  // 执行搜索
  const searchResults = index.search(query, {
    limit: 10,
    suggest: true,
    enrich: true
  })

  return searchResults
}
