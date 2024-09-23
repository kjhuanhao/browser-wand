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

interface Bookmark {
  id: string
  title: string
  url: string
}

const PlasmoOverlay = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault()
        setIsVisible((prev) => !prev)
      } else if (event.key === "Escape") {
        setIsVisible(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    // 获取书签
    chrome.runtime.sendMessage({ action: "getBookmarks" }, (response) => {
      setBookmarks(response)
    })

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const filteredBookmarks = bookmarks.filter(
    (bookmark) =>
      bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.url.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isVisible) return null

  return (
    <div className="plasmo-z-50 plasmo-flex plasmo-fixed plasmo-inset-0 plasmo-bg-black plasmo-bg-opacity-50">
      <div className="plasmo-m-auto plasmo-bg-white plasmo-p-6 plasmo-rounded-lg plasmo-shadow-xl plasmo-w-3/4 plasmo-max-h-3/4 plasmo-overflow-auto">
        <input
          type="text"
          className="plasmo-w-full plasmo-p-2 plasmo-border plasmo-rounded plasmo-mb-4"
          placeholder="搜索书签..."
          autoFocus
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul className="plasmo-list-none plasmo-p-0">
          {filteredBookmarks.map((bookmark) => (
            <li key={bookmark.id} className="plasmo-mb-2">
              <a
                href={bookmark.url}
                className="plasmo-text-blue-600 plasmo-hover:text-blue-800 plasmo-visited:text-purple-600"
                target="_blank"
                rel="noopener noreferrer">
                {bookmark.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default PlasmoOverlay
