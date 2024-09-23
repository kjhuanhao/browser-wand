/**
 * 从网站的 head 中获取图标 URL
 * @param doc - 网站的 DOM 文档对象
 * @returns 图标 URL 列表
 */
async function getWebsiteIconUrlsFromDOM(doc: Document): Promise<string[]> {
  const iconUrls: string[] = []

  try {
    // 从 head 中获取所有的 link 标签
    const linkElements = doc.querySelectorAll('head link[rel*="icon"]')

    // 遍历 link 标签并提取图标 URL
    linkElements.forEach((linkElement) => {
      const href = linkElement.getAttribute("href")

      if (href) {
        let iconUrl: string

        // 判断图标链接是否为相对路径
        if (href.startsWith("/")) {
          // 如果是相对路径,则获取文档 URL 并拼接完整 URL
          const parsedUrl = new URL(doc.URL)
          iconUrl = `${parsedUrl.origin}${href}`
        } else {
          // 如果是绝对路径,则直接使用
          iconUrl = href
        }

        iconUrls.push(iconUrl)
      }
    })
  } catch (error) {
    console.error("Error getting website icons:", error)
  }

  return iconUrls
}
