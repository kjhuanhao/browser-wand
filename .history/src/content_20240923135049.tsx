import { cva } from "class-variance-authority"
import cssText from "data-text:~style.css"
import * as _ from "lodash-es"
import { Settings } from "lucide-react"
import type { PlasmoCSConfig } from "plasmo"
import React, { useEffect, useRef, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { Button } from "~lib/components/ui/button"
import { Input } from "~lib/components/ui/input"
import { assembleSearchResult, doSearch } from "~lib/search"
import { cn } from "~lib/utils"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText.replaceAll(":root", ":host(plasmo-csui)")
  return style
}

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

const SearchItemVariants = cva(
  "plasmo-flex plasmo-items-center plasmo-p-2 plasmo-hover:bg-gray-100 plasmo-cursor-pointer plasmo-rounded-md",
  {
    variants: {
      active: {
        true: "plasmo-bg-gray-200 plasmo-font-bold"
      }
    }
  }
)
const scrollToSelectedItem = (selectedIndex: number) => {
  const selectedItemElement = document.querySelector(
    `.search-item-${selectedIndex}`
  )
  if (selectedItemElement) {
    selectedItemElement.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    })
  }
}

const PlasmoOverlay = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [searchResult, setSearchResult] = useState<SearchResult[]>([
    {
      id: "searchIntel",
      doc: {
        title: "互联网搜索",
        url: `https://www.baidu.com/search?q=`,
        emoji: "🔍",
        type: "search"
      }
    }
  ])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const [mode, setMode] = useState<SearchMode>("all") // 设置检索模式
  const searchItemRefsRef = useRef<React.RefObject<HTMLDivElement>[]>([])

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isVisible])

  useEffect(() => {
    const selectedItemElement = document.querySelector(
      `.search-item-${selectedIndex}`
    )

    if (selectedItemElement) {
      selectedItemElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      })
    }
  }, [selectedIndex])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (true) {
        case event.ctrlKey && event.key === "k":
          event.preventDefault()
          setIsVisible((prev) => !prev)
          inputRef.current?.focus()
          break

        case event.key === "Escape":
          setIsVisible(false)
          break

        case event.key === "ArrowUp":
          setSelectedIndex((prevIndex) =>
            prevIndex === 0 ? (searchResult?.length || 0) - 1 : prevIndex - 1
          )
          break

        case event.key === "ArrowDown":
          setSelectedIndex((prevIndex) =>
            prevIndex === (searchResult?.length || 0) - 1 ? 0 : prevIndex + 1
          )
          break

        case event.key === "Enter":
          setSelectedIndex((prevIndex) =>
            prevIndex >= 0 && prevIndex < (searchResult?.length || 0)
              ? prevIndex
              : 0
          )
          const selectedItem = searchResult[selectedIndex]

          if (selectedItem.doc.type === "search") {
            window.open(
              `https://www.baidu.com/s?wd=${inputRef.current.value}&PC=U316&FORM=CHROMN`,
              "_blank"
            )
          } else {
            window.open(selectedItem.doc.url, "_blank")
          }
          break

        default:
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    const fetchData = async () => {
      if (searchResult.length === 1) {
        const allResult = await assembleSearchResult(searchResult, "all")
        setSearchResult(allResult)
      }
    }

    fetchData()

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [searchResult, selectedIndex])

  if (!isVisible) return null
  const debouncedSearch = _.debounce(async (searchValue: string) => {
    const result = await doSearch(searchValue)
    const searchIntel: SearchResult = {
      id: "searchIntel",
      doc: {
        title: "互联网搜索",
        url: `https://www.baidu.com/search?q=`,
        emoji: "🔍",
        type: "search"
      }
    }
    if (result.length === 0) {
      setSearchResult([searchIntel])
      return
    }
    setSearchResult([searchIntel, ...(result[0].result as any)])
    setSelectedIndex(0)
  }, 100) // 设置 500 毫秒的防抖延迟时间

  const handleSearch = (e: any) => {
    debouncedSearch(e.target.value)
  }
  return (
    <div className="plasmo-z-50 plasmo-flex plasmo-fixed plasmo-inset-0 plasmo-bg-black plasmo-bg-opacity-50">
      <div className="plasmo-m-auto plasmo-bg-white plasmo-p-6 plasmo-rounded-lg plasmo-shadow-xl plasmo-max-h-[540px] plasmo-w-[700px]">
        <Input
          ref={inputRef}
          className="plasmo-w-full plasmo-p-2 plasmo-rounded plasmo-h-11 plasmo-text-xl"
          placeholder="输入命令或搜索"
          onChange={handleSearch}
        />
        <div className="plasmo-flex plasmo-flex-col plasmo-mt-4 plasmo-border-b plasmo-max-h-[200px] plasmo-overflow-y-auto ">
          {/* 策略模式 */}
          {searchResult?.map((result, index) => (
            <div
              key={index}
              ref={(ref) => {
                searchItemRefsRef.current[index] =
                  ref as React.RefObject<HTMLDivElement>
              }}
              className={cn(
                SearchItemVariants({ active: index === selectedIndex }),
                `search-item-${index}`
              )}>
              {result.doc.iconUrl ? (
                <img
                  src={result.doc.iconUrl}
                  alt="icon"
                  className="plasmo-w-6 plasmo-h-6 plasmo-mr-3"
                />
              ) : (
                <p className="plasmo-w-6 plasmo-h-6 plasmo-mr-3">
                  {result.doc?.emoji}
                </p>
              )}
              <p className="plasmo-text-lg ">{result.doc.title}</p>
            </div>
          ))}
        </div>

        <div className="plasmo-mt-2  plasmo-w-full plasmo-text-sm plasmo-text-slate-500 plasmo-inline-flex plasmo-flex-row plasmo-justify-between">
          <p> {(searchResult && searchResult.length - 1) || "0"}个结果</p>
          <p>
            <Settings className="hover:plasmo-text-slate-900 plasmo-cursor-pointer" />
          </p>
        </div>
      </div>
    </div>
  )
}

export default PlasmoOverlay
