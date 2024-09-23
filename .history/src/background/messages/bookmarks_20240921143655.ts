import * as _ from "lodash-es"
import Browser, { type Bookmarks } from "webextension-polyfill"

import type { PlasmoMessaging } from "@plasmohq/messaging"

const getBookmarkIcon = async (url: string): Promise<string | undefined> => {
  try {
    // 1. Fetch the webpage
    const response = await fetch(url)

    // 2. Check if response is ok
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // 3. Get the HTML text
    const htmlText = await response.text()

    // 4. Parse HTML and create a DOM Document
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlText, "text/html")

    // 5. Find the icon link elements
    const iconLink =
      doc.querySelector("link[rel*='icon']") ||
      doc.querySelector("link[rel*='shortcut icon']")

    // 6. Get the href attribute of the icon link
    if (iconLink) {
      let iconUrl = iconLink.href
      // Make the icon URL absolute if it's relative
      if (iconUrl.startsWith("/")) {
        const baseUrl = new URL(url).origin
        iconUrl = baseUrl + iconUrl
      }
      return iconUrl
    } else {
      throw new Error("Icon not found.")
    }
  } catch (error) {
    console.error(error)
    return null // Handle errors as needed
  }
}
const createBookmarkTree = async (
  bookmarks: Bookmarks.BookmarkTreeNode[],
  parentId?: string
): Promise<void> => {
  for (const bookmark of bookmarks) {
    if (bookmark.children) {
      // This is a folder
      const newFolder = await Browser.bookmarks.create({
        parentId: parentId,
        title: bookmark.title
      })
      // Recursively create children
      await createBookmarkTree(bookmark.children, newFolder.id)
    } else {
      // This is a bookmark
      await Browser.bookmarks.create({
        parentId: parentId,
        title: bookmark.title,
        url: bookmark.url
      })
    }
  }
}

const handler: PlasmoMessaging.MessageHandler = async (req: any, res: any) => {
  console.log("Bookmark operation triggered:", req, req.body.type)
  const type = req.body.type
  try {
    switch (type) {
      case "create":
        // 创建书签
        const newBookmark = await Browser.bookmarks.create(req.bookmark)
        res.send({ bookmark: newBookmark })
        break
      case "delete":
        // 删除书签
        await Browser.bookmarks.remove(req.id)
        res.send({ success: true })
        break
      case "update":
        // 更新书签
        const updatedBookmark = await Browser.bookmarks.update(
          req.id,
          req.changes
        )
        res.send({ bookmark: updatedBookmark })
        break
      case "query":
        // 查询书签
        const results = await Browser.bookmarks.search(req.query)
        res.send({ bookmarks: results })
        break
      case "getTree":
        // 获取全部书签
        const bookmarksTree = await Browser.bookmarks.getTree()
        res.send({
          bookmarksTree
          // bookmarkCount,
          // folderCount
        })
        break
      case "set":
        // 设置书签
        const tree = await Browser.bookmarks.getTree()
        const rootBookmarkId = tree[0].children[0].id // 获取书签根文件夹ID
        // 删除所有现有书签
        const children = await Browser.bookmarks.getChildren(rootBookmarkId)
        // for (const child of children) {
        //     await Browser.bookmarks.removeTree(child.id);
        // }

        await createBookmarkTree(req.body.bookmarks)

        res.send({ success: true })
        break
      case "getBookmarkIcon":
        const iconUrl = await getBookmarkIcon(req.body.url)
        res.send({ iconUrl })
      default:
        res.send({ error: "Unsupported operation" })
    }
  } catch (error) {
    res.send({ error: error.message })
  }
}

export default handler
