import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"] // 匹配所有URL，你可以根据需要限制
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const PlasmoOverlay = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault()
        setIsVisible((prev) => !prev)
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div className="plasmo-z-50 plasmo-flex plasmo-fixed plasmo-inset-0 plasmo-bg-black plasmo-bg-opacity-50">
      <div className="plasmo-m-auto plasmo-bg-white plasmo-p-6 plasmo-rounded-lg plasmo-shadow-xl">
        <input
          type="text"
          className="plasmo-w-full plasmo-p-2 plasmo-border plasmo-rounded"
          placeholder="输入命令或搜索..."
          autoFocus
        />
        {/* 在这里添加更多的UI元素，如最近访问列表、搜索建议等 */}
      </div>
    </div>
  )
}

export default PlasmoOverlay