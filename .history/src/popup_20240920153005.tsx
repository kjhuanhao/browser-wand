import cssText from "data-text:~style.css"

import { CountButton } from "~features/count-button"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}
function IndexPopup() {
  return (
    <div className="flex items-center justify-center h-16 w-40">
      <CountButton />
    </div>
  )
}

export default IndexPopup
