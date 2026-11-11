import { createCards, createStep } from './stepFactory'
import type { Step } from './types'

export const PENDING_MESSAGE = 'Placeholder: implementa el algoritmo en steps.ts'

/**
 * Pasos mínimos para un algoritmo pendiente: solo init y done, con el arreglo
 * original sin ordenar. No se marca ningún índice como resuelto.
 */
export function createPlaceholderSteps(input: number[]): Step[] {
  const cards = createCards(input)
  const range: [number, number] | null =
    input.length > 0 ? [0, input.length - 1] : null

  return [
    createStep({
      type: 'init',
      array: cards,
      range,
      sortedIndices: [],
      callStack: [],
      codeLine: 0,
      message: PENDING_MESSAGE,
      comparisons: 0,
      swaps: 0,
    }),
    createStep({
      type: 'done',
      array: cards,
      range,
      sortedIndices: [],
      callStack: [],
      codeLine: 0,
      message: PENDING_MESSAGE,
      comparisons: 0,
      swaps: 0,
    }),
  ]
}
