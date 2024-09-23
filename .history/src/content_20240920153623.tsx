import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

const PlasmoOverlay = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [bookmarks, setBookmarks] = useState<
    chrome.bookmarks.BookmarkTreeNode[]
  >([])

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await sendToBackground({
          name: "bookmarks",
          body: {
            type: "getTree"
          }
        })
        if (response.bookmarksTree) {
          console.log(response.bookmarksTree, "123")
          setBookmarks(response.bookmarksTree)
        }
      } catch (error) {
        console.error("Error fetching bookmarks:", error)
      }
    }

    fetchBookmarks()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault()
        setIsVisible((prev) => !prev)
      } else if (event.key === "Escape") {
        setIsVisible(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div className="z-50 flex fixed inset-0 bg-black bg-opacity-50">
      <div className="m-auto bg-white p-6 rounded-lg shadow-xl">
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="输入命令或搜索..."
          autoFocus
        />
      </div>
    </div>
  )
}

export default PlasmoOverlay
