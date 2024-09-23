import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import React, { useEffect, useReducer, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { fetchBookmarks, flattenBookmarks } from "~lib/bookmarks"
import { Button } from "~lib/components/ui/button"
import { doSearch } from "~lib/search"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText.replaceAll(":root", ":host(plasmo-csui)")
  return style
}

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

const PlasmoOverlay = () => {
  const [isVisible, setIsVisible] = useState(false)

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
  }, [])

  if (!isVisible) return null
  const search = async () => {
    const result = await doSearch(bookmarks, "简历")
    console.log(result)
  }
  return (
    <div className="plasmo-z-50 plasmo-flex plasmo-fixed plasmo-inset-0 plasmo-bg-black plasmo-bg-opacity-50">
      <div className="plasmo-m-auto plasmo-bg-white plasmo-p-6 plasmo-rounded-lg plasmo-shadow-xl">
        <input
          type="text"
          className="plasmo-w-full plasmo-p-2 plasmo-border plasmo-rounded plasmo-bg-blue-300"
          placeholder="输入命令或搜索..."
          autoFocus
        />
        <Button className="" onClick={search}>
          123
        </Button>
      </div>
    </div>
  )
}

export default PlasmoOverlay
