import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const PlasmoOverlay = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [bookmarks, setBookmarks] = useState([])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault()
        setIsVisible(true)
      } else if (event.key === "Escape") {
        setIsVisible(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    // 获取书签
    chrome.runtime.sendMessage({ type: "GET_BOOKMARKS" }, (response) => {
      console.log(response, "test")
      setBookmarks(response)
    })

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const renderBookmarks = (bookmarkNodes) => {
    return bookmarkNodes.map((node) => {
      if (node.children) {
        return (
          <div key={node.id}>
            <h3>{node.title}</h3>
            {renderBookmarks(node.children)}
          </div>
        )
      }
      return (
        <div key={node.id}>
          <a href={node.url}>{node.title}</a>
        </div>
      )
    })
  }

  if (!isVisible) return null

  return (
    <div className="plasmo-z-50 plasmo-flex plasmo-fixed plasmo-inset-0 plasmo-bg-black plasmo-bg-opacity-50">
      <div className="plasmo-m-auto plasmo-bg-white plasmo-p-6 plasmo-rounded-lg plasmo-shadow-xl plasmo-w-3/4 plasmo-max-h-3/4 plasmo-overflow-auto">
        <input
          type="text"
          className="plasmo-w-full plasmo-p-2 plasmo-border plasmo-rounded"
          placeholder="输入命令或搜索..."
          autoFocus
        />
        <div className="plasmo-mt-4">
          <h2 className="plasmo-text-lg plasmo-font-bold">书签</h2>
          {renderBookmarks(bookmarks)}
        </div>
      </div>
    </div>
  )
}

export default PlasmoOverlay
