import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import React, { useEffect, useReducer, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { Button } from "~lib/components/ui/button"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

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
      if (chrome.runtime?.id) {
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
        <Button variant="outline" className="hover:bg-blue">
          123
        </Button>
      </div>
    </div>
  )
}

export default PlasmoOverlay
