import type { AlgorithmDefinition } from './types'
import { heapSortAlgorithm } from '../algorithms/heap-sort'
import { mergeSortAlgorithm } from '../algorithms/merge-sort'
import { quickSortAlgorithm } from '../algorithms/quick-sort'

export const ALGORITHMS: AlgorithmDefinition[] = [
  quickSortAlgorithm,
  mergeSortAlgorithm,
  heapSortAlgorithm,
]

export function getAlgorithmById(id: string | undefined): AlgorithmDefinition | undefined {
  if (!id) {
    return undefined
  }
  return ALGORITHMS.find((algorithm) => algorithm.id === id)
}
