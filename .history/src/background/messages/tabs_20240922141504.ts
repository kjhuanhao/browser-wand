import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.Handler = async (req: any, res: any) => {
  const type = req.body.type
  try {
    switch (type) {
      case "get":
    }
  } catch (e) {
    console.error(e)
  }
}

export default handler
