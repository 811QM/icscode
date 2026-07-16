declare global {
  const ICSCODE_VERSION: string
  const ICSCODE_CHANNEL: string
}

export const InstallationVersion = typeof ICSCODE_VERSION === "string" ? ICSCODE_VERSION : "local"
export const InstallationChannel = typeof ICSCODE_CHANNEL === "string" ? ICSCODE_CHANNEL : "local"
export const InstallationLocal = InstallationChannel === "local"
