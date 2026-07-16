import { getComponentCatalogue } from "@opentui/solid/components"
import { registerSpinner } from "opentui-spinner/solid"

export function registericscodeSpinner() {
  if (!getComponentCatalogue().spinner) registerSpinner()
}
