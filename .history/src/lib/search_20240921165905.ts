import FlexSearch from "flexsearch"

const index = new FlexSearch.Index({
  tokenize: "forward",
  async: true
})

// 添加所有条目到索引
searchItems.forEach((item) => {
  index.add(item.id, item.title)
})
