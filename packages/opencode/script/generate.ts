import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dir = path.resolve(__dirname, "..")

process.chdir(dir)

const modelsUrl = process.env.ICSCODE_MODELS_URL || "https://models.dev"

let modelsData: string
if (process.env.MODELS_DEV_API_JSON) {
  modelsData = await Bun.file(process.env.MODELS_DEV_API_JSON).text()
  console.log("Loaded models.dev snapshot from local file")
} else {
  try {
    modelsData = await fetch(`${modelsUrl}/api.json`).then((x) => x.text())
    console.log("Loaded models.dev snapshot from network")
  } catch (error) {
    console.warn("Failed to fetch models.dev api.json, using empty snapshot:", error)
    modelsData = "{}"
  }
}

export { modelsData }
