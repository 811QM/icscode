import { DialogSelect } from "../ui/dialog-select"
import { useDialog } from "../ui/dialog"
import { useSDK } from "../context/sdk"
import { useRoute } from "../context/route"
import { useLocal } from "../context/local"
import { useProject } from "../context/project"
import { useToast } from "../ui/toast"

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

function StatusDialog(props: { title: string; message: string }) {
  return (
    <box flexDirection="column" gap={1} padding={2}>
      <text fg="red">{props.title}</text>
      <text>{props.message}</text>
      <text fg="gray">Press Esc to close</text>
    </box>
  )
}

export function DialogOhosPc() {
  const dialog = useDialog()
  const sdk = useSDK()
  const route = useRoute()
  const local = useLocal()
  const project = useProject()
  const toast = useToast()

  async function startAdaptation(library: string) {
    toast.show({ message: `[ohos-pc] 鸿蒙化 ${library}`, variant: "info" })
    dialog.replace(() => <StatusDialog title="Loading..." message={`准备鸿蒙化 ${library}...`} />)

    try {
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
          title: `鸿蒙化: ${library}`,
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
      const promptResult = await sdk.client.session.promptAsync({
        sessionID,
        parts: [{ type: "text", text: `鸿蒙化 ${library}` }],
      })

      if (promptResult.error) {
        dialog.replace(() => (
          <StatusDialog title="Error" message={`Failed to send prompt: ${String(promptResult.error)}`} />
        ))
        return
      }

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
      title="选择要鸿蒙化的开源库"
      placeholder="输入关键字过滤..."
      options={LIBRARIES}
      onSelect={(option) => {
        void startAdaptation(option.value)
      }}
    />
  )
}
