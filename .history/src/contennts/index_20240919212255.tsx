import type { PlasmoCSConfig } from "plasmo"

import { sendToBackground } from "@plasmohq/messaging"

export const config: PlasmoCSConfig = {
  matches: ["http://localhost:1947/*", "https://bookmarks-ai.vercel.app/*"],
  all_frames: false,
  run_at: "document_end",
  world: "MAIN"
}
