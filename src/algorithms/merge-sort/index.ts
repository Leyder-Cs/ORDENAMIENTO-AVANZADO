import { createElement } from 'react'
import type { AlgorithmDefinition, Step } from '../../core/types'
import { MERGE_SORT_CODE } from './code'
import { MergeExtraPanel } from './extra'
import type { MergeExtraData } from './steps'
import { generateSteps } from './steps'

const renderMergeExtra = (step: Step) => {
  const data = step.extra as MergeExtraData | undefined
  const phase: MergeExtraData['phase'] = step.type === 'done' ? 'done' : 'idle'
  const fallback: MergeExtraData = {
    phase,
    left: step.array,
    right: [],
    buffer: phase === 'done' ? step.array : [],
    leftPointer: 0,
    rightPointer: 0,
    activeSide: null,
  }

  return createElement(MergeExtraPanel, { data: data ?? fallback })
}

export const mergeSortAlgorithm: AlgorithmDefinition = {
  id: 'merge-sort',
  name: 'MERGE SORT',
  status: 'ready',
  accent: '#00f0ff',
  description:
    'Divide el arreglo a la mitad, ordena cada mitad y fusiona los resultados.',
  complexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
    space: 'O(n)',
  },
  code: MERGE_SORT_CODE,
  defaultArray: [8, 3, 5, 1, 9, 2, 7, 4],
  generateSteps,
  swapsLabel: 'Movimientos',
  renderExtra: renderMergeExtra,
  stepTypeLabels: {
    init: 'INICIO',
    recurse: 'RECURSIÓN',
    split: 'DIVIDIR',
    base: 'CASO BASE',
    'merge-start': 'FUSIÓN',
    'merge-compare': 'COMPARAR',
    'merge-drain': 'COPIAR RESTO',
    'merge-write': 'REUBICAR',
    'merge-complete': 'FUSIÓN LISTA',
    done: 'FIN',
  },
  examples: [{ label: 'Ejemplo base', values: [8, 3, 5, 1, 9, 2, 7, 4] }],
}
