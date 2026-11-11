import { createElement } from 'react'
import type { AlgorithmDefinition, Step } from '../../core/types'
import { HEAP_SORT_CODE } from './code'
import { HeapExtraPanel } from './extra'
import type { HeapExtraData } from './steps'
import { generateSteps } from './steps'

const renderHeapExtra = (step: Step) => {
  const data = step.extra as HeapExtraData | undefined
  const isDone = step.type === 'done'
  const fallback: HeapExtraData = {
    phase: isDone ? 'done' : 'build',
    heapSize: isDone ? 0 : step.array.length,
    activeRoot: null,
    comparing: [],
    largest: null,
    target: null,
  }

  return createElement(HeapExtraPanel, {
    data: data ?? fallback,
    array: step.array,
    sortedIndices: step.sortedIndices,
  })
}

export const heapSortAlgorithm: AlgorithmDefinition = {
  id: 'heap-sort',
  name: 'HEAP SORT',
  status: 'ready',
  accent: '#39ff14',
  description:
    'Construye un max-heap y extrae el máximo repetidamente para ordenar el arreglo.',
  complexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(1)',
  },
  code: HEAP_SORT_CODE,
  defaultArray: [4, 10, 3, 5, 1, 8, 2, 7],
  generateSteps,
  renderExtra: renderHeapExtra,
  stepTypeLabels: {
    init: 'INICIO',
    'build-start': 'CONSTRUIR HEAP',
    'sift-start': 'HEAPIFY',
    'heap-compare': 'COMPARAR',
    'heap-swap': 'INTERCAMBIO',
    'heap-stop': 'HEAP LISTO',
    'heap-built': 'MAX-HEAP',
    'extract-start': 'EXTRAER MÁXIMO',
    'extract-swap': 'RAÍZ → FINAL',
    'extract-place': 'POSICIÓN FIJA',
    done: 'FIN',
  },
  examples: [{ label: 'Ejemplo base', values: [4, 10, 3, 5, 1, 8, 2, 7] }],
}
