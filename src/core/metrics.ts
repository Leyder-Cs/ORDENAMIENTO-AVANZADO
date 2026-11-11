import type { Step } from './types'

export interface StepMetrics {
  comparisons: number
  swaps: number
  depth: number
}

/** Métricas derivadas del Step actual, comunes a todos los algoritmos. */
export function getStepMetrics(step: Step | undefined): StepMetrics {
  return {
    comparisons: step?.comparisons ?? 0,
    swaps: step?.swaps ?? 0,
    depth: step?.callStack.length ?? 0,
  }
}
