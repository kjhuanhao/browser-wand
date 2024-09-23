type SearchType = "bookmark" | "action" | "search"

interface SearchItem {
  id: string
  title: string
  url: string
  type: SearchType
  iconUrl?: string
  emoji?: string
}

interface SearchResult {
  id: string
  doc: Omit<SearchItem, "id">
}
