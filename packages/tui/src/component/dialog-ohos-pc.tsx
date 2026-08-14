import { DialogSelect } from "../ui/dialog-select"
import { useDialog } from "../ui/dialog"
import { usePromptRef } from "../context/prompt"
import { usePromptWorkspace } from "./prompt/workspace"
import { createResource, createSignal, onMount } from "solid-js"
import path from "path"
import os from "os"

const DEFAULT_KNOWLEDGE_BASE_URL = "git@gitcode.com:QM811/ohos-pc-note.git"

const LIBRARIES = [
  { title: "VisualVM", value: "VisualVM", description: "Java JVM monitoring and troubleshooting tool" },
  { title: "soapUI", value: "soapUI", description: "Web service testing tool (SOAP/REST)" },
  { title: "Appium", value: "Appium", description: "Mobile app automation testing framework" },
  { title: "TortoiseGit", value: "TortoiseGit", description: "Git client for Windows" },
  { title: "GitLab Runner", value: "GitLab Runner", description: "CI/CD runner for GitLab" },
  { title: "CPPCHECK", value: "CPPCHECK", description: "Static analysis tool for C/C++" },
  { title: "ESLint", value: "ESLint", description: "JavaScript/TypeScript linting tool" },
  { title: "SonarLint", value: "SonarLint", description: "Code quality and security linter" },
  { title: "Qt for Python", value: "Qt for Python", description: "Python bindings for Qt framework" },
  { title: "Selenium", value: "Selenium", description: "Web browser automation framework" },
  { title: "Chrome-Driver", value: "Chrome-Driver", description: "WebDriver for Chrome browser" },
  { title: "usbPcap/usbmon", value: "usbPcap/usbmon", description: "USB packet capture and monitoring" },
  { title: "Notepad Next", value: "Notepad Next", description: "Text editor" },
  { title: "LibreOffice", value: "LibreOffice", description: "Office suite" },
  { title: "JMeter", value: "JMeter", description: "Performance and load testing tool" },
  { title: "Gatling", value: "Gatling", description: "Load testing framework" },
  { title: "git-lfs", value: "git-lfs", description: "Git Large File Storage" },
  { title: "Jenkins", value: "Jenkins", description: "CI/CD automation server" },
  { title: "jd-gui", value: "jd-gui", description: "Java decompiler GUI" },
  { title: "OpenVPN", value: "OpenVPN", description: "VPN solution" },
  { title: "Nmap", value: "Nmap", description: "Network scanner" },
  { title: "RustDesk", value: "RustDesk", description: "Remote desktop software" },
  { title: "FreeRDP", value: "FreeRDP", description: "Remote Desktop Protocol client" },
  { title: "Xrdp", value: "Xrdp", description: "Remote desktop server" },
  { title: "VLC", value: "VLC", description: "Media player" },
  { title: "Avidemux", value: "Avidemux", description: "Video editor" },
]

async function loadKnowledgeBaseUrl() {
  const candidates = [
    path.join(os.homedir(), ".config", "icscode", "icscode.jsonc"),
    path.join(os.homedir(), ".config", "icscode", "icscode.json"),
  ]
  for (const configPath of candidates) {
    try {
      const file = Bun.file(configPath)
      const exists = await file.exists()
      if (!exists) continue
      const config = await file.json()
      const url = config?.ohos_pc?.knowledge_base_url
      if (url) return url
    } catch {
      continue
    }
  }
  return DEFAULT_KNOWLEDGE_BASE_URL
}

export function DialogOhosPc() {
  const dialog = useDialog()
  const promptRef = usePromptRef()
  const workspace = usePromptWorkspace()
  const [knowledgeBaseUrl, setKnowledgeBaseUrl] = createSignal(DEFAULT_KNOWLEDGE_BASE_URL)

  onMount(() => {
    void loadKnowledgeBaseUrl().then(setKnowledgeBaseUrl)
  })

  return (
    <DialogSelect
      title="Select HarmonyOS PC library to adapt"
      placeholder="Type to filter libraries..."
      options={LIBRARIES}
      onSelect={(option) => {
        dialog.clear()
        const library = option.value
        const current = promptRef.current
        if (!current) return

        current.set({
          input: [
            `Use the superpowers framework to guide me through HarmonyOS PC adaptation for ${library}.`,
            ``,
            `First, fetch the HarmonyOS PC adaptation knowledge base from ${knowledgeBaseUrl()} and read the SOW (Statement of Work) documents.`,
            `Then, use superpowers brainstorming to analyze the adaptation scope and requirements for ${library}.`,
            `After that, use superpowers writing-plans to create a detailed adaptation plan.`,
            `Finally, use superpowers executing-plans to implement the adaptation step by step.`,
            ``,
            `Ask me for confirmation at each major step before proceeding.`,
          ].join("\n"),
          parts: [],
        })
        current.focus()
      }}
    />
  )
}
