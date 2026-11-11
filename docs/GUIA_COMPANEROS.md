# Guía para compañeros

Esta plataforma muestra algoritmos de ordenamiento paso a paso. La regla de oro:

> **Cada algoritmo vive en su propia carpeta y no toca el core ni los componentes compartidos.**

```
src/
  core/
    types.ts               Contrato Step / AlgorithmDefinition
    stepFactory.ts         createCards, createStep, cloneArray
    pending.ts             Esqueleto init + done para pendientes
    registry.ts            Lista oficial de algoritmos
    useVisualizerStore.ts  Estado global (Zustand)
    usePlayer.ts           Reproducción automática
    metrics.ts             Métricas derivadas
  algorithms/
    quick-sort/            Implementación completa de referencia
    merge-sort/            Implementación completa + vista de fusión
    heap-sort/             Implementación completa + árbol del montículo
    _template/             Plantilla para copiar
  components/              UI genérica, sin lógica de algoritmos
  pages/                   Home, Visualizer, NotFound
```

## 1. Copia la plantilla

Copia `src/algorithms/_template/` a `src/algorithms/mi-algoritmo/`. El nombre de la carpeta debe coincidir con el `id` en kebab-case.

## 2. Define el algoritmo

Edita `index.ts`:

```ts
import type { AlgorithmDefinition } from '../../core/types'
import { MY_CODE } from './code'
import { generateSteps } from './steps'

export const myAlgorithm: AlgorithmDefinition = {
  id: 'mi-algoritmo',
  name: 'MI ALGORITMO',
  status: 'ready',
  accent: '#ff8a00',
  description: 'Una frase clara de qué hace.',
  complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(n)' },
  code: MY_CODE,
  defaultArray: [5, 2, 8, 1, 9, 3],
  generateSteps,
  swapsLabel: 'Movimientos',
  stepTypeLabels: { init: 'INICIO', compare: 'COMPARAR', done: 'FIN' },
  examples: [{ label: 'Ejemplo base', values: [5, 2, 8, 1, 9, 3] }],
}
```

`stepTypeLabels`, `swapsLabel` y `examples` son opcionales; si no existen, la UI usa el `type` en mayúsculas, el label `Intercambios` y el `defaultArray` como ejemplo.

## 3. Implementa `steps.ts`

Debes devolver un `Step[]` **pre-calculado**. Usa los helpers del core:

```ts
import { createCards, createStep } from '../../core/stepFactory'
import type { Step } from '../../core/types'

export function generateSteps(input: number[], options?: Record<string, unknown>): Step[] {
  const cards = createCards(input)
  const steps: Step[] = []
  let comparisons = 0
  let swaps = 0

  steps.push(
    createStep({
      type: 'init',
      array: cards,
      range: [0, Math.max(input.length - 1, 0)],
      codeLine: 0,
      message: 'Arreglo inicial cargado.',
      comparisons,
      swaps,
    }),
  )

  comparisons += 1
  swaps += 1

  steps.push(
    createStep({
      type: 'done',
      array: cards,
      range: [0, Math.max(input.length - 1, 0)],
      sortedIndices: cards.map((_, index) => index),
      codeLine: 1,
      message: 'SISTEMA ORDENADO.',
      comparisons,
      swaps,
    }),
  )

  return steps
}
```

`createStep` clona el arreglo, los marcadores y las estructuras mutables. **Nunca reutilices el mismo arreglo entre pasos.**

## 4. Contrato de `Step`

| Campo | Tipo | Uso |
| --- | --- | --- |
| `type` | `string` | Tipo libre (`compare`, `swap`, `merge`, `heapify`, `done`...). |
| `array` | `CardData[]` | Estado visual del arreglo en ese paso. |
| `markers` | `Marker[]` | Indicadores sobre cartas concretas. |
| `range` | `[lo, hi] \| null` | Subarreglo activo; `null` = todo el arreglo. |
| `sortedIndices` | `number[]` | Cartas con candado verde. |
| `callStack` | `[lo, hi][]` | Pila de llamadas (vacía si no aplica). |
| `codeLine` | `number` | Índice base 0 de la línea Java resaltada. |
| `message` | `string` | Explicación en español para el log. |
| `swappedIndices` | `[number, number]?` | Dispara el arco/glitch de esas dos cartas. |
| `comparisons` | `number` | **Acumulado** hasta este paso. |
| `swaps` | `number` | **Acumulado** hasta este paso. |
| `extra` | `unknown` | Datos propios del algoritmo para `renderExtra`. |

### Roles de marcador

`pivot`, `left`, `right`, `compare`, `min`, `merge-left`, `merge-right`, `heap-root`, `heap-child`, `custom`.

La UI colorea cada rol de forma genérica. Quick Sort usa `pivot` (corona `PIVOTE`), `left` (`i`) y `right` (`j`). Para Merge Sort usa `merge-left`, `merge-right` y `compare`. Para Heap Sort usa `heap-root` y `heap-child`.

```ts
markers: [
  { index: 2, role: 'compare' },
  { index: 4, role: 'merge-left', label: 'IZQ' },
]
```

## 5. Código Java

`code.ts` expone las líneas que muestra el panel:

```ts
export const MY_CODE = {
  language: 'java' as const,
  lines: ['static void miAlgoritmo(int[] a) {', '  // ...', '}'],
}
```

Cada `Step.codeLine` debe apuntar a una línea válida (base 0). Actualiza el código real a medida que implementas.

## 6. Opciones

Si tu algoritmo necesita configuración, declara `options`:

```ts
options: [
  {
    id: 'modo',
    label: 'Modo',
    type: 'segmented',
    defaultValue: 'asc',
    choices: [
      { value: 'asc', label: 'Ascendente' },
      { value: 'desc', label: 'Descendente' },
    ],
  },
],
```

Tipos: `segmented`, `select`, `toggle`. Lee el valor en `generateSteps(input, options)` con `options?.modo`. Cambiar una opción reinicia la simulación.

## 7. Datos extra (`renderExtra`)

Si quieres dibujar un árbol, un arreglo auxiliar o una cola de fusión, guarda el dato en `step.extra` y define `renderExtra` en `index.ts`. Debe ser un componente puro que reciba el `step` y no consulte el store. Merge Sort y Heap Sort son los ejemplos de referencia: `merge-sort/extra.tsx` dibuja las mitades y el buffer, y `heap-sort/extra.tsx` dibuja el árbol del montículo.

## 8. Registro

En `src/core/registry.ts`:

```ts
import { myAlgorithm } from '../algorithms/mi-algoritmo'

export const ALGORITHMS = [
  quickSortAlgorithm,
  mergeSortAlgorithm,
  heapSortAlgorithm,
  myAlgorithm,
]
```

## 9. Reglas de oro

- **No modifiques** `src/core`, `src/components` ni `src/pages` para tu algoritmo.
- **No compartas** arreglos ni objetos `CardData` entre pasos.
- `comparisons` y `swaps` son acumulados: nunca pueden disminuir.
- Los `id` y colores de las cartas son fijos durante toda la simulación.
- El primer paso es `init`; el último es `done` con el arreglo ordenado.
- Un algoritmo pendiente emite solo `init` y `done` con `PENDING_MESSAGE` y **sin** marcar índices como ordenados.
- La UI solo muestra `SISTEMA ORDENADO` si `status === 'ready'`.
- Respeta `prefers-reduced-motion`; no agregues animaciones obligatorias.

## 10. Verificación

Antes de abrir tu PR:

```bash
npm run test
npm run typecheck
npm run lint
npm run build
```

El test de contrato valida, para cada algoritmo `ready`:

- `init` y `done` en los extremos.
- Arreglo final ordenado (incluye vacío, un elemento, duplicados, ordenado e invertido).
- `id` y color fijos por carta.
- Sin referencias compartidas entre pasos.
- Contadores acumulados monotónicos.
- Índices de marcadores y rangos válidos.
- `codeLine` dentro del código declarado.

Los algoritmos `pending` se saltan con un mensaje claro. Al cambiar `status` a `'ready'`, el contrato se ejecuta automáticamente.

## 11. Checklist de entrega

- [ ] Carpeta renombrada y `id` único.
- [ ] `steps.ts` genera todos los pasos.
- [ ] `code.ts` coincide con la implementación.
- [ ] `status: 'ready'`.
- [ ] Registrado en `ALGORITHMS`.
- [ ] README propio con el esquema.
- [ ] `test`, `typecheck`, `lint` y `build` en verde.
