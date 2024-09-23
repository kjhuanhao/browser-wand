/**
 * 从网站的 head 中获取最合适的图标 URL
 * @param url - 网站的 URL
 * @param doc - 网站的 DOM 文档对象
 * @returns 最合适的图标 URL
 */
async function getBestWebsiteIconUrl(
  url: string,
  doc: Document
): Promise<string | null> {
  try {
    // 从 head 中获取所有的 link 标签
    const linkElements = doc.querySelectorAll(
      'head link[rel="icon"], head link[rel="shortcut icon"]'
    )

    // 遍历 link 标签并选择最合适的图标 URL
    for (const linkElement of linkElements) {
      const href = linkElement.getAttribute("href")
      if (href) {
        // 判断图标链接是否为相对路径
        if (href.startsWith("/")) {
          // 如果是相对路径,则拼接完整 URL
          const parsedUrl = new URL(url)
          return `${parsedUrl.origin}${href}`
        } else {
          // 如果是绝对路径,则直接使用
          return href
        }
      }
    }

    // 没有找到合适的图标 URL
    return null
  } catch (error) {
    console.error("Error getting website icon:", error)
    return null
  }
}
