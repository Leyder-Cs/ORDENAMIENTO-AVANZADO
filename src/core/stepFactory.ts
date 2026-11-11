import type { CardData, Marker, Step } from './types'

// Paleta neón compartida. El color se asigna una sola vez por posición inicial
// y viaja con la carta cuando el algoritmo la mueve.
export const CARD_COLORS = [
  '#00f0ff',
  '#ff2bd6',
  '#39ff14',
  '#f9f002',
  '#ff8a00',
  '#a855f7',
  '#ff3b3b',
  '#2f6bff',
  '#00ff9d',
  '#ff7ce5',
  '#c6ff00',
  '#7b61ff',
]

/** Copia profunda de las cartas para que ningún paso comparta referencias. */
export function cloneArray(array: CardData[]): CardData[] {
  return array.map((card) => ({ ...card }))
}

/** Crea las cartas iniciales con ids estables y color fijo. */
export function createCards(values: number[]): CardData[] {
  return values.map((value, index) => ({
    id: `carta-${index}`,
    value,
    color: CARD_COLORS[index % CARD_COLORS.length] ?? '#00f0ff',
  }))
}

interface CreateStepInput {
  type: string
  array: CardData[]
  markers?: Marker[]
  range?: [number, number] | null
  sortedIndices?: number[]
  callStack?: [number, number][]
  codeLine: number
  message: string
  swappedIndices?: [number, number]
  comparisons: number
  swaps: number
  extra?: unknown
}

/**
 * Helper compartido para armar un Step seguro: clona el arreglo y todas las
 * estructuras mutables, evitando bugs de referencias compartidas.
 */
export function createStep(input: CreateStepInput): Step {
  return {
    type: input.type,
    array: cloneArray(input.array),
    markers: (input.markers ?? []).map((marker) => ({ ...marker })),
    range: input.range ? [input.range[0], input.range[1]] : null,
    sortedIndices: [...(input.sortedIndices ?? [])],
    callStack: (input.callStack ?? []).map(([lo, hi]): [number, number] => [lo, hi]),
    codeLine: input.codeLine,
    message: input.message,
    swappedIndices: input.swappedIndices
      ? [input.swappedIndices[0], input.swappedIndices[1]]
      : undefined,
    comparisons: input.comparisons,
    swaps: input.swaps,
    extra: input.extra,
  }
}
