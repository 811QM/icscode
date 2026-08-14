import { DialogSelect } from "../ui/dialog-select"
import { useDialog } from "../ui/dialog"
import { usePromptRef } from "../context/prompt"
import { usePromptWorkspace } from "./prompt/workspace"
import { createSignal, onMount, Show } from "solid-js"
import path from "path"
import os from "os"

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

type ConfigState =
  | { status: "loading" }
  | { status: "ready"; knowledgeBaseUrl: string }
  | { status: "error"; message: string }

async function loadKnowledgeBaseUrl(): Promise<ConfigState> {
  const configPath = path.join(os.homedir(), ".config", "icscode", "icscode.json")
  try {
    const file = Bun.file(configPath)
    const exists = await file.exists()
    if (!exists) {
      return {
        status: "error",
        message: `Configuration file not found: ${configPath}\n\nPlease create it with the following content:\n\n{\n  "ohos_pc": {\n    "knowledge_base_url": "git@gitcode.com:YOUR_ORG/YOUR_REPO.git"\n  }\n}\n\nReplace YOUR_ORG/YOUR_REPO with your actual GitCode repository.`,
      }
    }
    const config = await file.json()
    const url = config?.ohos_pc?.knowledge_base_url
    if (!url) {
      return {
        status: "error",
        message: `Missing ohos_pc.knowledge_base_url in ${configPath}\n\nPlease add the following to your configuration:\n\n"ohos_pc": {\n  "knowledge_base_url": "git@gitcode.com:YOUR_ORG/YOUR_REPO.git"\n}`,
      }
    }
    return { status: "ready", knowledgeBaseUrl: url }
  } catch (error) {
    return {
      status: "error",
      message: `Failed to read configuration from ${configPath}\n\nError: ${error instanceof Error ? error.message : String(error)}\n\nPlease ensure the file contains valid JSON with the ohos_pc.knowledge_base_url field.`,
    }
  }
}

export function DialogOhosPc() {
  const dialog = useDialog()
  const promptRef = usePromptRef()
  const workspace = usePromptWorkspace()
  const [state, setState] = createSignal<ConfigState>({ status: "loading" })

  onMount(() => {
    void loadKnowledgeBaseUrl().then(setState)
  })

  return (
    <Show
      when={state().status === "ready"}
      fallback={
        <box flexDirection="column" gap={1} padding={2}>
          <text fg="red">Configuration Error</text>
          <text>{state().status === "loading" ? "Loading configuration..." : state().message}</text>
          <text fg="gray">Press Esc to close</text>
        </box>
      }
    >
      {(ready) => (
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
                `First, fetch the HarmonyOS PC adaptation knowledge base from ${ready().knowledgeBaseUrl} and read the SOW (Statement of Work) documents.`,
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
      )}
    </Show>
  )
}
