type SearchType = "bookmark" | "history"

interface SearchItem {
  id: string
  title: string
  url: string
  type: SearchType
}
