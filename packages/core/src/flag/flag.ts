import { Config } from "effect"

export function truthy(key: string) {
  const value = process.env[key]?.toLowerCase()
  return value === "true" || value === "1"
}

const copy = process.env["ICSCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT"]
const fff = process.env["ICSCODE_DISABLE_FFF"]

function enabledByExperimental(key: string) {
  return process.env[key] === undefined ? truthy("ICSCODE_EXPERIMENTAL") : truthy(key)
}

export const Flag = {
  OTEL_EXPORTER_OTLP_ENDPOINT: process.env["OTEL_EXPORTER_OTLP_ENDPOINT"],
  OTEL_EXPORTER_OTLP_HEADERS: process.env["OTEL_EXPORTER_OTLP_HEADERS"],

  ICSCODE_AUTO_HEAP_SNAPSHOT: truthy("ICSCODE_AUTO_HEAP_SNAPSHOT"),
  ICSCODE_GIT_BASH_PATH: process.env["ICSCODE_GIT_BASH_PATH"],
  ICSCODE_CONFIG: process.env["ICSCODE_CONFIG"],
  ICSCODE_CONFIG_CONTENT: process.env["ICSCODE_CONFIG_CONTENT"],
  ICSCODE_DISABLE_AUTOUPDATE: truthy("ICSCODE_DISABLE_AUTOUPDATE"),
  ICSCODE_ALWAYS_NOTIFY_UPDATE: truthy("ICSCODE_ALWAYS_NOTIFY_UPDATE"),
  ICSCODE_DISABLE_PRUNE: truthy("ICSCODE_DISABLE_PRUNE"),
  ICSCODE_DISABLE_TERMINAL_TITLE: truthy("ICSCODE_DISABLE_TERMINAL_TITLE"),
  ICSCODE_SHOW_TTFD: truthy("ICSCODE_SHOW_TTFD"),
  ICSCODE_DISABLE_AUTOCOMPACT: truthy("ICSCODE_DISABLE_AUTOCOMPACT"),
  ICSCODE_DISABLE_MODELS_FETCH: truthy("ICSCODE_DISABLE_MODELS_FETCH"),
  ICSCODE_DISABLE_MOUSE: truthy("ICSCODE_DISABLE_MOUSE"),
  ICSCODE_FAKE_VCS: process.env["ICSCODE_FAKE_VCS"],
  ICSCODE_SERVER_PASSWORD: process.env["ICSCODE_SERVER_PASSWORD"],
  ICSCODE_SERVER_USERNAME: process.env["ICSCODE_SERVER_USERNAME"],
  ICSCODE_DISABLE_FFF: fff === undefined ? process.platform === "win32" : truthy("ICSCODE_DISABLE_FFF"),

  // Experimental
  ICSCODE_EXPERIMENTAL_FILEWATCHER: Config.boolean("ICSCODE_EXPERIMENTAL_FILEWATCHER").pipe(
    Config.withDefault(false),
  ),
  ICSCODE_EXPERIMENTAL_DISABLE_FILEWATCHER: Config.boolean("ICSCODE_EXPERIMENTAL_DISABLE_FILEWATCHER").pipe(
    Config.withDefault(false),
  ),
  ICSCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT:
    copy === undefined ? process.platform === "win32" : truthy("ICSCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT"),
  ICSCODE_MODELS_URL: process.env["ICSCODE_MODELS_URL"],
  ICSCODE_MODELS_PATH: process.env["ICSCODE_MODELS_PATH"],
  ICSCODE_DB: process.env["ICSCODE_DB"],

  ICSCODE_WORKSPACE_ID: process.env["ICSCODE_WORKSPACE_ID"],
  ICSCODE_EXPERIMENTAL_WORKSPACES: enabledByExperimental("ICSCODE_EXPERIMENTAL_WORKSPACES"),

  // Evaluated at access time (not module load) because tests, the CLI, and
  // external tooling set these env vars at runtime.
  get ICSCODE_DISABLE_PROJECT_CONFIG() {
    return truthy("ICSCODE_DISABLE_PROJECT_CONFIG")
  },
  get ICSCODE_EXPERIMENTAL_REFERENCES() {
    return enabledByExperimental("ICSCODE_EXPERIMENTAL_REFERENCES")
  },
  get ICSCODE_TUI_CONFIG() {
    return process.env["ICSCODE_TUI_CONFIG"]
  },
  get ICSCODE_CONFIG_DIR() {
    return process.env["ICSCODE_CONFIG_DIR"]
  },
  get ICSCODE_PURE() {
    return truthy("ICSCODE_PURE")
  },
  get ICSCODE_PERMISSION() {
    return process.env["ICSCODE_PERMISSION"]
  },
  get ICSCODE_PLUGIN_META_FILE() {
    return process.env["ICSCODE_PLUGIN_META_FILE"]
  },
  get ICSCODE_CLIENT() {
    return process.env["ICSCODE_CLIENT"] ?? "cli"
  },
}
