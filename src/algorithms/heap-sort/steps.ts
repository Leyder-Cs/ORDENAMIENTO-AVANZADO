import { createCards, createStep } from '../../core/stepFactory'
import type { Marker, Step } from '../../core/types'

type Range = [number, number]

export type HeapPhase = 'build' | 'heapify' | 'extract' | 'done'

export interface HeapExtraData {
  phase: HeapPhase
  heapSize: number
  activeRoot: number | null
  comparing: number[]
  largest: number | null
  target: number | null
}

interface EmitOptions {
  type: string
  markers?: Marker[]
  range: Range
  codeLine: number
  message: string
  swappedIndices?: [number, number]
  extra?: HeapExtraData
}

export function generateSteps(input: number[]): Step[] {
  const cards = createCards(input)
  const steps: Step[] = []
  const sorted = new Set<number>()
  let comparisons = 0
  let swaps = 0

  const emit = (options: EmitOptions): void => {
    steps.push(
      createStep({
        type: options.type,
        array: cards,
        markers: options.markers ?? [],
        range: options.range,
        sortedIndices: [...sorted].sort((a, b) => a - b),
        callStack: [],
        codeLine: options.codeLine,
        message: options.message,
        swappedIndices: options.swappedIndices,
        comparisons,
        swaps,
        extra: options.extra,
      }),
    )
  }

  const swapCards = (a: number, b: number): void => {
    const temp = cards[a]
    cards[a] = cards[b]
    cards[b] = temp
  }

  const makeExtra = (
    phase: HeapPhase,
    heapSize: number,
    activeRoot: number | null,
    comparing: number[],
    largest: number | null,
    target: number | null,
  ): HeapExtraData => ({
    phase,
    heapSize,
    activeRoot,
    comparing: [...comparing],
    largest,
    target,
  })

  const childIndices = (root: number, size: number): number[] => {
    const children: number[] = []
    const left = root * 2 + 1
    const right = root * 2 + 2
    if (left < size) children.push(left)
    if (right < size) children.push(right)
    return children
  }

  const siftMarkers = (root: number, size: number, largest: number): Marker[] => {
    const markers: Marker[] = [{ index: root, role: 'heap-root', label: 'RAÍZ' }]
    const left = root * 2 + 1
    const right = root * 2 + 2

    childIndices(root, size).forEach((index) => {
      if (index === largest) {
        return
      }
      markers.push({
        index,
        role: 'heap-child',
        label: index === left ? 'L' : index === right ? 'R' : 'HIJO',
      })
    })

    if (largest !== root) {
      markers.push({ index: largest, role: 'compare', label: 'MAYOR' })
    }

    return markers
  }

  const heapRange = (size: number): Range => [0, Math.max(size - 1, 0)]

  const siftDown = (start: number, size: number, phase: HeapPhase): void => {
    let current = start
    const range = heapRange(size)

    while (current < size) {
      const left = current * 2 + 1
      const right = current * 2 + 2

      if (left >= size) {
        emit({
          type: 'heap-stop',
          markers: siftMarkers(current, size, current),
          range,
          codeLine: 23,
          message: `${cards[current].value} no tiene hijos; queda como hoja del heap.`,
          extra: makeExtra(
            phase,
            size,
            current,
            childIndices(current, size),
            current,
            null,
          ),
        })
        return
      }

      const rootValue = cards[current].value
      let largest = current

      comparisons += 1
      const leftValue = cards[left].value
      const leftWins = leftValue > cards[largest].value
      if (leftWins) {
        largest = left
      }

      emit({
        type: 'heap-compare',
        markers: siftMarkers(current, size, largest),
        range,
        codeLine: 16,
        message: leftWins
          ? `Hijo izquierdo ${leftValue} > raíz ${rootValue}: el mayor candidato pasa a la posición ${left}.`
          : `Raíz ${rootValue} >= hijo izquierdo ${leftValue}: la raíz sigue siendo el mayor candidato.`,
        extra: makeExtra(
          phase,
          size,
          current,
          childIndices(current, size),
          largest,
          null,
        ),
      })

      if (right < size) {
        comparisons += 1
        const leadingValue = cards[largest].value
        const rightValue = cards[right].value
        const rightWins = rightValue > leadingValue
        if (rightWins) {
          largest = right
        }

        emit({
          type: 'heap-compare',
          markers: siftMarkers(current, size, largest),
          range,
          codeLine: 19,
          message: rightWins
            ? `Hijo derecho ${rightValue} > ${leadingValue}: el mayor candidato pasa a la posición ${right}.`
            : `${leadingValue} >= hijo derecho ${rightValue}: se mantiene el mayor candidato.`,
          extra: makeExtra(
            phase,
            size,
            current,
            childIndices(current, size),
            largest,
            null,
          ),
        })
      }

      if (largest === current) {
        emit({
          type: 'heap-stop',
          markers: siftMarkers(current, size, current),
          range,
          codeLine: 23,
          message: `${cards[current].value} ya es mayor que sus hijos; el subárbol con raíz en ${current} es max-heap.`,
          extra: makeExtra(
            phase,
            size,
            current,
            childIndices(current, size),
            current,
            null,
          ),
        })
        return
      }

      const displaced = cards[current].value
      const largestValue = cards[largest].value
      swapCards(current, largest)
      swaps += 1

      emit({
        type: 'heap-swap',
        markers: [
          { index: largest, role: 'heap-root', label: 'NUEVO NODO' },
          { index: current, role: 'heap-child', label: 'PADRE' },
        ],
        range,
        codeLine: 25,
        message: `Intercambio ${displaced} y ${largestValue}; ${displaced} baja a la posición ${largest}.`,
        swappedIndices: [current, largest],
        extra: makeExtra(phase, size, largest, [current], null, null),
      })

      current = largest
    }
  }

  const lastIndex = Math.max(input.length - 1, 0)

  emit({
    type: 'init',
    range: [0, lastIndex],
    codeLine: 0,
    message:
      input.length === 0
        ? 'Arreglo vacío: no hay elementos para ordenar.'
        : 'Arreglo inicial cargado. Heap Sort construye un max-heap y extrae el máximo repetidamente.',
  })

  if (input.length === 0) {
    emit({
      type: 'done',
      range: [0, lastIndex],
      codeLine: 9,
      message: 'SISTEMA ORDENADO. No había elementos para ordenar.',
    })
    return steps
  }

  const size = input.length

  if (size === 1) {
    emit({
      type: 'heap-built',
      markers: [{ index: 0, role: 'heap-root', label: 'RAÍZ' }],
      range: [0, 0],
      codeLine: 4,
      message: `Un solo elemento (${cards[0].value}): ya es un max-heap.`,
      extra: makeExtra('build', 1, 0, [], 0, null),
    })

    sorted.add(0)
    emit({
      type: 'done',
      range: [0, 0],
      codeLine: 9,
      message: 'SISTEMA ORDENADO. 0 comparaciones y 0 intercambios en 3 pasos.',
    })
    return steps
  }

  emit({
    type: 'build-start',
    range: [0, lastIndex],
    codeLine: 2,
    message: `Construyo el max-heap desde el último nodo interno (${Math.floor(size / 2) - 1}) hasta la raíz.`,
    extra: makeExtra('build', size, null, [], null, null),
  })

  for (let index = Math.floor(size / 2) - 1; index >= 0; index -= 1) {
    emit({
      type: 'sift-start',
      markers: siftMarkers(index, size, index),
      range: [0, lastIndex],
      codeLine: 3,
      message: `Heapify del subárbol con raíz en ${index} (${cards[index].value}).`,
      extra: makeExtra(
        'build',
        size,
        index,
        childIndices(index, size),
        index,
        null,
      ),
    })
    siftDown(index, size, 'build')
  }

  emit({
    type: 'heap-built',
    markers: [{ index: 0, role: 'heap-root', label: 'RAÍZ' }],
    range: [0, lastIndex],
    codeLine: 4,
    message: `Max-heap construido: la raíz ${cards[0].value} es el máximo del arreglo.`,
    extra: makeExtra('build', size, 0, [], 0, null),
  })

  for (let end = size - 1; end > 0; end -= 1) {
    const heapBefore = end + 1
    const maxValue = cards[0].value
    const targetValue = cards[end].value

    emit({
      type: 'extract-start',
      markers: [
        { index: 0, role: 'heap-root', label: 'MÁX' },
        { index: end, role: 'custom', label: 'DESTINO' },
      ],
      range: [0, end],
      codeLine: 5,
      message: `El máximo ${maxValue} está en la raíz; lo envío a la posición ${end} (${targetValue}).`,
      extra: makeExtra('extract', heapBefore, 0, [], 0, end),
    })

    swapCards(0, end)
    swaps += 1
    sorted.add(end)

    emit({
      type: 'extract-swap',
      markers: [
        { index: 0, role: 'heap-root', label: 'RAÍZ' },
        { index: end, role: 'custom', label: 'FIJO' },
      ],
      range: [0, end],
      codeLine: 6,
      message: `Intercambio ${maxValue} y ${targetValue}; ${maxValue} queda fijo en la posición ${end}.`,
      swappedIndices: [0, end],
      extra: makeExtra('extract', end, 0, [], null, null),
    })

    if (end > 1) {
      emit({
        type: 'sift-start',
        markers: siftMarkers(0, end, 0),
        range: [0, end - 1],
        codeLine: 7,
        message: `Heap reducido a ${end} elementos: heapify desde la raíz ${cards[0].value}.`,
        extra: makeExtra('heapify', end, 0, childIndices(0, end), 0, null),
      })
      siftDown(0, end, 'heapify')
    }

    emit({
      type: 'extract-place',
      markers: [{ index: 0, role: 'heap-root', label: 'RAÍZ' }],
      range: heapRange(end),
      codeLine: 7,
      message:
        end > 1
          ? `Posición ${end} fija con ${cards[end].value}; el heap activo tiene ${end} elementos.`
          : `Posición ${end} fija con ${cards[end].value}; solo queda la raíz en la posición 0.`,
      extra: makeExtra('extract', end, 0, [], null, null),
    })
  }

  sorted.add(0)
  emit({
    type: 'done',
    range: [0, lastIndex],
    codeLine: 9,
    message: `SISTEMA ORDENADO. ${comparisons} comparaciones y ${swaps} intercambios en ${steps.length + 1} pasos.`,
  })

  return steps
}
