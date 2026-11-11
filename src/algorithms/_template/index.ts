import type { AlgorithmDefinition } from '../../core/types'
import { TEMPLATE_CODE } from './code'
import { generateSteps } from './steps'

/**
 * Plantilla de referencia. No está registrada en la app: copia esta carpeta,
 * renómbrala y regístrala en src/core/registry.ts cuando esté lista.
 */
export const templateAlgorithm: AlgorithmDefinition = {
  id: 'template',
  name: 'NUEVO ALGORITMO',
  status: 'pending',
  accent: '#ff8a00',
  description: 'Plantilla base para agregar un algoritmo sin tocar el core.',
  complexity: {
    best: '—',
    average: '—',
    worst: '—',
    space: '—',
  },
  code: TEMPLATE_CODE,
  defaultArray: [5, 2, 8, 1, 9, 3],
  generateSteps,
  stepTypeLabels: {
    init: 'INICIO',
    done: 'FIN',
  },
  examples: [{ label: 'Ejemplo base', values: [5, 2, 8, 1, 9, 3] }],
}
