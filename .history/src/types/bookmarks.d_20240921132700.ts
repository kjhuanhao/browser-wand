type SearchType = "bookmark" | "history" | "tab"

interface SearchItem {
  id: string
  title: string
  url: string
  type: SearchType
}
