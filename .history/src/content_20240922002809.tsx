import cssText from "data-text:~style.css"
import type { SimpleDocumentSearchResultSetUnit } from "flexsearch"
import * as _ from "lodash-es"
import type { PlasmoCSConfig } from "plasmo"
import React, { useEffect, useReducer, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { fetchBookmarks, flattenBookmarks } from "~lib/bookmarks"
import { Button } from "~lib/components/ui/button"
import { Input } from "~lib/components/ui/input"
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
  const [searchResult, setSearchResult] = useState<SearchResult[] | null>()
  const [selectedIndex, setSelectedIndex] = useState(0)
  useEffect(() => {
    // fetchBookmarks()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault()
        setIsVisible((prev) => !prev)
      } else if (event.key === "Escape") {
        setIsVisible(false)
      } else if (event.key === "ArrowUp") {
        setSelectedIndex((prevIndex) =>
          prevIndex === 0 ? (searchResult?.length || 0) - 1 : prevIndex - 1
        )
      } else if (event.key === "ArrowDown") {
        setSelectedIndex((prevIndex) =>
          prevIndex === (searchResult?.length || 0) - 1 ? 0 : prevIndex + 1
        )
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [searchResult])

  if (!isVisible) return null
  const debouncedSearch = _.debounce(async (searchValue: string) => {
    const result = await doSearch(searchValue)
    if (result.length == 0) {
      setSearchResult(null)
      return
    }
    setSearchResult(result[0].result as any)
    setSelectedIndex(0)
    console.log(result)
  }, 500) // 设置 500 毫秒的防抖延迟时间

  const handleSearch = (e: any) => {
    debouncedSearch(e.target.value)
  }
  return (
    <div className="plasmo-z-50 plasmo-flex plasmo-fixed plasmo-inset-0 plasmo-bg-black plasmo-bg-opacity-50">
      <div className="plasmo-m-auto plasmo-bg-white plasmo-p-6 plasmo-rounded-lg plasmo-shadow-xl plasmo-max-h-[540px] plasmo-w-[700px]">
        <input
          className="plasmo-w-full plasmo-p-2 plasmo-border plasmo-rounded"
          placeholder="输入命令或搜索"
          onChange={handleSearch}
        />
        <div className="plasmo-flex plasmo-flex-col plasmo-mt-4 plasmo-border-b">
          <div>
            {searchResult?.map((result, index) => (
              <div
                key={index}
                className={`plasmo-flex plasmo-items-center plasmo-p-2 plasmo-hover:bg-gray-100 plasmo-cursor-pointer ${
                  index === selectedIndex
                    ? "plasmo-bg-gray-200 plasmo-font-bold"
                    : ""
                }`}>
                <img
                  src={result.doc.iconUrl}
                  alt="icon"
                  className="plasmo-w-6 plasmo-h-6 plasmo-mr-3"
                />
                <p className="plasmo-text-lg">{result.doc.title}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="plasmo-mt-2  plasmo-w-full">
          {(searchResult && searchResult.length) || "0"}个结果
        </div>
      </div>
    </div>
  )
}

export default PlasmoOverlay
