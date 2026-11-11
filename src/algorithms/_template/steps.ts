import { createPlaceholderSteps } from '../../core/pending'
import type { Step } from '../../core/types'

export function generateSteps(input: number[]): Step[] {
  return createPlaceholderSteps(input)
}
