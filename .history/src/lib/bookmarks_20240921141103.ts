function getIconUrlFromHtml(url) {
  return fetch(url)
    .then((response) => response.text())
    .then((html) => {
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, "text/html")

      const iconLink = doc.querySelector('link[rel="icon"]')
      if (iconLink) {
        return iconLink.getAttribute("href")
      }

      const ogImage = doc.querySelector('meta[property="og:image"]')
      if (ogImage) {
        return ogImage.getAttribute("content")
      }

      const twitterImage = doc.querySelector('meta[name="twitter:image"]')
      if (twitterImage) {
        return twitterImage.getAttribute("content")
      }

      return undefined
    })
    .catch((error) => {
      console.error("Error fetching icon URL:", error)
      return undefined
    })
}

export async function flattenBookmarks(
  nodes: chrome.bookmarks.BookmarkTreeNode[]
): Promise<SearchItem[]> {
  const result: SearchItem[] = []

  async function traverse(node: chrome.bookmarks.BookmarkTreeNode) {
    if (node.url) {
      const iconUrl = await getIconUrlFromHtml(node.url)
      const searchItem: SearchItem = {
        id: node.id,
        title: node.title,
        url: node.url,
        iconUrl,
        type: "bookmark"
      }
      result.push(searchItem)
    }

    if (node.children) {
      for (const child of node.children) {
        await traverse(child)
      }
    }
  }

  for (const node of nodes) {
    await traverse(node)
  }

  return result
}
