import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import React, { useCallback, useEffect, useMemo, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { injectMainStyles } from "~lib/utils"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

const storage = new Storage()

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error in PlasmoOverlay:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please reload the page.</div>
    }

    return this.props.children
  }
}

const PlasmoOverlay = () => {
  injectMainStyles(cssText)
  const [isVisible, setIsVisible] = useState(false)
  const [bookmarks, setBookmarks] = useStorage("bookmarks", [])

  const fetchBookmarks = useCallback(async () => {
    try {
      const response = await sendToBackground({
        name: "bookmarks",
        body: {
          type: "getTree"
        }
      })
      if (response.bookmarksTree) {
        setBookmarks(response.bookmarksTree)
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error)
    }
  }, [setBookmarks])

  useEffect(() => {
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
  }, [fetchBookmarks])

  const memoizedBookmarks = useMemo(() => bookmarks, [bookmarks])

  if (!isVisible) return null

  return (
    <ErrorBoundary>
      <div className="z-50 flex fixed inset-0 bg-black bg-opacity-50">
        <div className="m-auto bg-white p-6 rounded-lg shadow-xl">
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="输入命令或搜索..."
            autoFocus
          />
          {/* 这里可以添加显示书签的逻辑 */}
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default PlasmoOverlay
