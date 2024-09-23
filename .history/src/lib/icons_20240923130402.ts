/**
 * 从网站的 head 中获取图标 URL
 * @param url - 网站的 URL
 * @returns 图标 URL 列表
 */
async function getWebsiteIconUrls(url: string): Promise<string[]> {
  const iconUrls: string[] = []

  try {
    // 获取网页 HTML 内容
    const response = await fetch(url)
    const html = await response.text()

    // 创建一个 HTML 解析器
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")

    // 从 head 中获取所有的 link 标签
    const linkElements = doc.querySelectorAll('head link[rel*="icon"]')

    // 遍历 link 标签并提取图标 URL
    linkElements.forEach((linkElement) => {
      const href = linkElement.getAttribute("href")

      if (href) {
        let iconUrl: string

        // 判断图标链接是否为相对路径
        if (href.startsWith("/")) {
          // 如果是相对路径,则拼接完整 URL
          const parsedUrl = new URL(url)
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