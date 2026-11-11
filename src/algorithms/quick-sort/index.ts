import type { AlgorithmDefinition } from '../../core/types'
import { QUICK_SORT_CODE } from './code'
import { generateSteps } from './steps'

export const quickSortAlgorithm: AlgorithmDefinition = {
  id: 'quick-sort',
  name: 'QUICK SORT',
  status: 'ready',
  accent: '#ff2bd6',
  description:
    'Particiona el arreglo alrededor de un pivote y ordena cada lado de forma recursiva.',
  complexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n²)',
    space: 'O(log n)',
  },
  code: QUICK_SORT_CODE,
  defaultArray: [4, 2, 7, 6, 3, 8, 1, 5],
  generateSteps,
  options: [
    {
      id: 'pivotMode',
      label: 'Selección de pivote',
      type: 'segmented',
      defaultValue: 'first',
      choices: [
        { value: 'first', label: 'Primer elemento' },
        { value: 'random', label: 'Aleatorio' },
      ],
    },
  ],
  stepTypeLabels: {
    init: 'INICIO',
    'choose-pivot': 'PIVOTE',
    'move-left': 'AVANCE I',
    'move-right': 'AVANCE J',
    swap: 'INTERCAMBIO',
    'place-pivot': 'PIVOTE FIJO',
    recurse: 'RECURSIÓN',
    sorted: 'ORDENADO',
    done: 'FIN',
  },
  examples: [
    { label: 'Ejemplo del video', values: [4, 2, 7, 6, 3, 8, 1, 5] },
  ],
}
