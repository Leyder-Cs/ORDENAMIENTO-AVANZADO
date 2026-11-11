import type { ReactNode } from 'react'

export type MarkerRole =
  | 'pivot'
  | 'left'
  | 'right'
  | 'compare'
  | 'min'
  | 'merge-left'
  | 'merge-right'
  | 'heap-root'
  | 'heap-child'
  | 'custom'

export interface Marker {
  index: number
  role: MarkerRole
  label?: string
}

export interface CardData {
  id: string
  value: number
  /** Color asignado una sola vez al iniciar; nunca cambia durante el proceso. */
  color: string
}

export interface Step {
  /** Cada algoritmo define sus propios tipos, por ejemplo 'swap', 'merge' o 'heapify'. */
  type: string
  array: CardData[]
  markers: Marker[]
  range: [number, number] | null
  sortedIndices: number[]
  callStack: [number, number][]
  codeLine: number
  message: string
  swappedIndices?: [number, number]
  /** Acumulado hasta este paso. */
  comparisons: number
  /** Acumulado hasta este paso (intercambios o escrituras). */
  swaps: number
  /** Datos propios del algoritmo (arreglos auxiliares, árbol del heap, etc.). */
  extra?: unknown
}

export interface AlgorithmComplexity {
  best: string
  average: string
  worst: string
  space: string
}

export type OptionValue = string | number | boolean

export interface OptionChoice {
  value: string
  label: string
}

export interface OptionDef {
  id: string
  label: string
  type: 'segmented' | 'select' | 'toggle'
  defaultValue: OptionValue
  choices?: OptionChoice[]
}

export interface AlgorithmExample {
  label: string
  values: number[]
}

export type StepsGenerator = (
  input: number[],
  options?: Record<string, unknown>,
) => Step[]

export interface AlgorithmDefinition {
  id: string
  name: string
  status: 'ready' | 'pending'
  author?: string
  accent: string
  description: string
  complexity: AlgorithmComplexity
  code: { language: 'java'; lines: string[] }
  defaultArray: number[]
  generateSteps: StepsGenerator
  options?: OptionDef[]
  renderExtra?: (step: Step) => ReactNode
  /** Etiquetas en español para el registro de pasos (opcional). */
  stepTypeLabels?: Record<string, string>
  /** Nombre visible de la métrica `swaps` (por ejemplo Movimientos en Merge Sort). */
  swapsLabel?: string
  /** Cargas rápidas de ejemplo que aparecen como botones en el control. */
  examples?: AlgorithmExample[]
}
