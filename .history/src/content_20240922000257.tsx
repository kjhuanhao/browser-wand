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
  const [searchResult, setSearchResult] = useState<
    SimpleDocumentSearchResultSetUnit[] | null
  >()

  useEffect(() => {
    // fetchBookmarks()

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
  const debouncedSearch = _.debounce(async (searchValue: string) => {
    const result = await doSearch(searchValue)
    if ((result.length = 0)) {
      return
    }
  }, 500) // 设置 500 毫秒的防抖延迟时间

  const handleSearch = (e: any) => {
    debouncedSearch(e.target.value)
  }
  return (
    <div className="plasmo-z-50 plasmo-flex plasmo-fixed plasmo-inset-0 plasmo-bg-black plasmo-bg-opacity-50 ">
      <div className="plasmo-m-auto plasmo-bg-white plasmo-p-6 plasmo-rounded-lg plasmo-shadow-xl plasmo-h-[540px] plasmo-w-[700px]">
        <Input placeholder="搜索..." onChange={handleSearch} />
        <div className="plasmo-flex flex-col plasmo-justify-center ">
          {searchResult &&
            searchResult[0].result.map((result) => {
              return <div className="plasmo-inline-flex plasmo-flex-row"></div>
            })}
        </div>
      </div>
    </div>
  )
}

export default PlasmoOverlay
