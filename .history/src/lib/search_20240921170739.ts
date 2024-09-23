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
const index = new FlexSearch.Document({
  tokenize: "full",
  cache: 100,
  document: {
    id: "id",
    index: "title",
    store: ["url", "type", "iconUrl"]
  }
})

//   id: string
// title: string
// url: string
// type: SearchType
// iconUrl?: string
