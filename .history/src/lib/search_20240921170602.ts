import FlexSearch from "flexsearch"

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
const index = new FlexSearch.Index({
  tokenize: "full"
})

// 添加条目到索引
searchItems.forEach((item) => {
  index.add(item.id, item.title)
})

// 搜索函数
async function search(query) {
  const results = await index.search(query)
  return results.map((id) => searchItems.find((item) => item.id === id))
}

// 示例搜索
search("First").then((results) => {
  console.log(results)
})
