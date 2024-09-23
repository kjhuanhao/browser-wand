type SearchType = "bookmark" | "history"

interface SearchItem {
  id: string
  title: string
  url: string
  type: SearchType
  iconUrl?: string
}

interface SearchResult {
  id: string
  doc: Omit<SearchItem, "id">
}
