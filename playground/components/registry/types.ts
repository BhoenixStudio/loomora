import type { ComponentGroup } from '../catalog'

export type ControlValue = string | boolean | number
export type ControlValues = Record<string, ControlValue>

type ControlBase = {
  /** Key in the values object. */
  key: string
  label: string
  hint?: string
  /** Only show this control when another control currently has one of these values. */
  when?: { key: string; in: ControlValue[] }
}

export type Control =
  | (ControlBase & { kind: 'select'; options: string[]; default: string })
  | (ControlBase & { kind: 'toggle'; default: boolean })
  | (ControlBase & { kind: 'text'; default: string; placeholder?: string })
  | (ControlBase & { kind: 'number'; default: number; min?: number; max?: number; step?: number })

export type SpecificProp = {
  name: string
  type: string
  defaultValue: string
  description: string
}

export type RelatedConfig = {
  /** Config path, e.g. `button` or `form.textField`. Links to its section on `/usage`. */
  path: string
  /** What this config changes for the component. */
  note: string
}

/** Serializable documentation + control schema for one component. Live rendering lives in `demos.tsx`. */
export type ComponentMeta = {
  slug: string
  name: string
  group: ComponentGroup
  summary: string
  description: string
  importName: string
  configs: RelatedConfig[]
  controls: Control[]
  /** Props and behaviours that are specific to Loomora (not native HTML attributes). */
  specificProps: SpecificProp[]
  notes?: string[]
}

/** Entry shown on the component map. `interactive` entries have the full live-controls page. */
export type ComponentListItem = {
  slug: string
  name: string
  group: ComponentGroup
  summary: string
  interactive: boolean
}
