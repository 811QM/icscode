import { DialogSelect } from "../ui/dialog-select"
import { useDialog } from "../ui/dialog"
import { useSDK } from "../context/sdk"
import { useRoute } from "../context/route"
import { useLocal } from "../context/local"
import { useProject } from "../context/project"
import { useToast } from "../ui/toast"
import path from "path"
import os from "os"
import { readText, writeText } from "../util/persistence"

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

const DOCS_DIR = path.join(os.homedir(), ".cache", "icscode", "ohos-pc-docs")

const DEFAULT_PROMPT_TEMPLATE = `Use the superpowers framework to guide me through HarmonyOS PC adaptation for {{library}}.

First, fetch the HarmonyOS PC adaptation knowledge base from {{knowledgeBaseUrl}} and read the SOW (Statement of Work) documents.
Then, use superpowers brainstorming to analyze the adaptation scope and requirements for {{library}}.
After that, use superpowers writing-plans to create a detailed adaptation plan.
Finally, use superpowers executing-plans to implement the adaptation step by step.

Ask me for confirmation at each major step before proceeding.`

async function ensureDocs(): Promise<void> {
  const templatePath = path.join(DOCS_DIR, "prompt-template.md")
  try {
    await readText(templatePath)
  } catch {
    await writeText(templatePath, DEFAULT_PROMPT_TEMPLATE).catch(() => {})
  }
}

async function readDoc(name: string): Promise<string | undefined> {
  try {
    return await readText(path.join(DOCS_DIR, `${name}.md`))
  } catch {
    if (name === "prompt-template") return DEFAULT_PROMPT_TEMPLATE
    return undefined
  }
}

function interpolate(template: string, values: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] ?? `{{${key}}}`)
}

function StatusDialog(props: { title: string; message: string }) {
  return (
    <box flexDirection="column" gap={1} padding={2}>
      <text fg="red">{props.title}</text>
      <text>{props.message}</text>
      <text fg="gray">Press Esc to close</text>
    </box>
  )
}

export function DialogOhosPc(props: { knowledgeBaseUrl?: string }) {
  const dialog = useDialog()
  const sdk = useSDK()
  const route = useRoute()
  const local = useLocal()
  const project = useProject()
  const toast = useToast()
  const url = props.knowledgeBaseUrl

  if (!url) {
    return (
      <box flexDirection="column" gap={1} padding={2}>
        <text fg="red">Configuration Error</text>
        <text>
          Missing ohos_pc.knowledge_base_url in ~/.config/icscode/icscode.json{"\n\n"}
          Please add:{"\n"}
          {"  \"ohos_pc\": {"}{"\n"}
          {"    \"knowledge_base_url\": \"git@gitcode.com:YOUR_ORG/YOUR_REPO.git\""}{"\n"}
          {"  }"}
        </text>
        <text fg="gray">Press Esc to close</text>
      </box>
    )
  }

  async function startAdaptation(library: string, knowledgeBaseUrl: string) {
    toast.show({ message: `[ohos-pc] starting ${library}`, variant: "info" })
    dialog.replace(() => <StatusDialog title="Loading..." message={`Adapting ${library}...`} />)
    try {
      await ensureDocs()
      const template = await readDoc("prompt-template")
      const sow = await readDoc("sow")
      if (!template) {
        dialog.replace(() => (
          <StatusDialog
            title="Error"
            message={`Missing ${DOCS_DIR}/prompt-template.md and no default template available.`}
          />
        ))
        return
      }

      const system = [
        interpolate(template, { library, knowledgeBaseUrl }),
        sow ? `\n\n## SOW\n\n${sow}` : "",
      ].join("")

      dialog.replace(() => <StatusDialog title="Loading..." message="Starting adaptation session..." />)

      let sessionID: string
      if (route.data.type === "session") {
        sessionID = route.data.sessionID
      } else {
        const model = local.model.current()
        const agent = local.agent.current()
        if (!model || !agent) {
          dialog.replace(() => (
            <StatusDialog title="Error" message="No model or agent selected. Please start a session first." />
          ))
          return
        }
        dialog.replace(() => <StatusDialog title="Loading..." message="Creating session..." />)
        const directory = project.instance.path().directory
        const workspace = project.workspace.current()
        const createResult = await sdk.client.session.create({
          directory,
          workspace,
          agent: agent.name,
          model: {
            providerID: model.providerID,
            id: model.modelID,
          },
          title: `HarmonyOS PC adaptation: ${library}`,
        })
        if (createResult.error || !createResult.data) {
          dialog.replace(() => (
            <StatusDialog
              title="Error"
              message={`Failed to create session: ${createResult.error ? String(createResult.error) : "no response"}`}
            />
          ))
          return
        }
        sessionID = createResult.data.id
      }

      dialog.replace(() => <StatusDialog title="Loading..." message="Sending prompt..." />)
      const promptResult = await sdk.client.session.prompt({
        sessionID,
        system,
        parts: [{ type: "text", text: `Please start the HarmonyOS PC adaptation for ${library}.` }],
      })

      if (promptResult.error) {
        dialog.replace(() => (
          <StatusDialog title="Error" message={`Failed to send prompt: ${String(promptResult.error)}`} />
        ))
        return
      }

      dialog.replace(() => <StatusDialog title="Loading..." message="Opening session..." />)
      dialog.clear()
      route.navigate({ type: "session", sessionID })
    } catch (error) {
      console.error("[/ohos-pc] startAdaptation failed:", error)
      dialog.replace(() => (
        <StatusDialog
          title="Error"
          message={`Unexpected error: ${error instanceof Error ? error.message : String(error)}`}
        />
      ))
    }
  }

  return (
    <DialogSelect
      title="Select HarmonyOS PC library to adapt"
      placeholder="Type to filter libraries..."
      options={LIBRARIES}
      onSelect={(option) => {
        void startAdaptation(option.value, url)
      }}
    />
  )
}
