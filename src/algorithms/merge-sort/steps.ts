import { createCards, createStep } from '../../core/stepFactory'
import type { CardData, Marker, Step } from '../../core/types'

type Range = [number, number]

export interface MergeExtraData {
  phase: 'idle' | 'split' | 'merge' | 'write' | 'done'
  left: CardData[]
  right: CardData[]
  buffer: CardData[]
  leftPointer: number
  rightPointer: number
  activeSide: 'left' | 'right' | null
}

interface EmitOptions {
  type: string
  markers?: Marker[]
  range: Range
  codeLine: number
  message: string
  swappedIndices?: [number, number]
  sortedIndices?: number[]
  extra?: MergeExtraData
}

const joinValues = (cards: CardData[]): string => cards.map((card) => card.value).join(', ')

export function generateSteps(input: number[]): Step[] {
  const cards = createCards(input)
  const steps: Step[] = []
  const stack: Range[] = []
  let comparisons = 0
  let swaps = 0

  const emit = (options: EmitOptions): void => {
    steps.push(
      createStep({
        type: options.type,
        array: cards,
        markers: options.markers ?? [],
        range: options.range,
        sortedIndices: options.sortedIndices ?? [],
        callStack: stack,
        codeLine: options.codeLine,
        message: options.message,
        swappedIndices: options.swappedIndices,
        comparisons,
        swaps,
        extra: options.extra,
      }),
    )
  }

  const makeExtra = (
    phase: MergeExtraData['phase'],
    left: CardData[],
    right: CardData[],
    buffer: CardData[],
    leftPointer: number,
    rightPointer: number,
    activeSide: MergeExtraData['activeSide'],
  ): MergeExtraData => ({
    phase,
    left: [...left],
    right: [...right],
    buffer: [...buffer],
    leftPointer,
    rightPointer,
    activeSide,
  })

  const lastIndex = Math.max(input.length - 1, 0)

  emit({
    type: 'init',
    range: [0, lastIndex],
    codeLine: 0,
    message:
      'Arreglo inicial cargado. Merge Sort divide en mitades hasta bloques de un elemento y luego los fusiona en orden ascendente.',
  })

  const mergeSort = (lo: number, hi: number, entryLine: number): void => {
    stack.push([lo, hi])

    emit({
      type: 'recurse',
      range: [lo, hi],
      codeLine: entryLine,
      message: `Llamada mergeSort(${lo}, ${hi}) → subarreglo [${joinValues(cards.slice(lo, hi + 1))}].`,
    })

    if (lo >= hi) {
      if (lo === hi) {
        emit({
          type: 'base',
          range: [lo, hi],
          codeLine: 1,
          message: `Caso base: [${cards[lo].value}] ya es un bloque ordenado de tamaño 1.`,
        })
      }
      stack.pop()
      return
    }

    const mid = Math.floor((lo + hi) / 2)
    const splitLeft = cards.slice(lo, mid + 1)
    const splitRight = cards.slice(mid + 1, hi + 1)

    emit({
      type: 'split',
      range: [lo, hi],
      codeLine: 2,
      message: `Divido [${lo}, ${hi}] en izquierda [${joinValues(splitLeft)}] y derecha [${joinValues(splitRight)}].`,
      extra: makeExtra('split', splitLeft, splitRight, [], 0, 0, null),
    })

    mergeSort(lo, mid, 3)
    mergeSort(mid + 1, hi, 4)

    const left = cards.slice(lo, mid + 1)
    const right = cards.slice(mid + 1, hi + 1)
    const buffer: CardData[] = []

    const makeMarkers = (
      leftPointer: number,
      rightPointer: number,
      chosenIndex: number | null,
    ): Marker[] => {
      const markers: Marker[] = []
      if (leftPointer < left.length) {
        markers.push({ index: lo + leftPointer, role: 'merge-left', label: 'L' })
      }
      if (rightPointer < right.length) {
        markers.push({
          index: mid + 1 + rightPointer,
          role: 'merge-right',
          label: 'R',
        })
      }
      if (chosenIndex !== null) {
        markers.push({ index: chosenIndex, role: 'compare', label: 'TOMA' })
      }
      return markers
    }

    emit({
      type: 'merge-start',
      markers: makeMarkers(0, 0, null),
      range: [lo, hi],
      codeLine: 5,
      message: `Fusiono las mitades ordenadas [${joinValues(left)}] y [${joinValues(right)}].`,
      extra: makeExtra('merge', left, right, buffer, 0, 0, null),
    })

    let i = 0
    let j = 0

    while (i < left.length && j < right.length) {
      comparisons += 1
      const leftCard = left[i]
      const rightCard = right[j]
      const takeLeft = leftCard.value <= rightCard.value
      const chosen = takeLeft ? leftCard : rightCard
      const chosenIndex = takeLeft ? lo + i : mid + 1 + j

      buffer.push(chosen)
      if (takeLeft) {
        i += 1
      } else {
        j += 1
      }

      emit({
        type: 'merge-compare',
        markers: makeMarkers(i, j, chosenIndex),
        range: [lo, hi],
        codeLine: takeLeft ? 12 : 13,
        message: takeLeft
          ? `${leftCard.value} <= ${rightCard.value}: ${chosen.value} entra primero a la salida.`
          : `${leftCard.value} > ${rightCard.value}: ${chosen.value} entra primero a la salida.`,
        extra: makeExtra('merge', left, right, buffer, i, j, takeLeft ? 'left' : 'right'),
      })
    }

    if (i < left.length) {
      const remaining = left.slice(i)
      buffer.push(...remaining)
      emit({
        type: 'merge-drain',
        markers: makeMarkers(i, j, null),
        range: [lo, hi],
        codeLine: 15,
        message: `La mitad derecha se agotó; copio el resto de la izquierda: [${joinValues(remaining)}].`,
        extra: makeExtra('merge', left, right, buffer, i, j, 'left'),
      })
    }

    if (j < right.length) {
      const remaining = right.slice(j)
      buffer.push(...remaining)
      emit({
        type: 'merge-drain',
        markers: makeMarkers(i, j, null),
        range: [lo, hi],
        codeLine: 16,
        message: `La mitad izquierda se agotó; copio el resto de la derecha: [${joinValues(remaining)}].`,
        extra: makeExtra('merge', left, right, buffer, i, j, 'right'),
      })
    }

    for (let k = 0; k < buffer.length; k += 1) {
      const desired = buffer[k]
      const targetIndex = lo + k
      if (cards[targetIndex].id === desired.id) {
        continue
      }

      const sourceIndex = cards.findIndex(
        (card, index) => index >= lo && index <= hi && card.id === desired.id,
      )
      const displaced = cards[targetIndex]
      const temp = cards[targetIndex]
      cards[targetIndex] = cards[sourceIndex]
      cards[sourceIndex] = temp
      swaps += 1

      emit({
        type: 'merge-write',
        range: [lo, hi],
        codeLine: 17,
        message: `Reubico ${desired.value} en la posición ${targetIndex}; ${displaced.value} pasa a la posición ${sourceIndex}.`,
        swappedIndices: [targetIndex, sourceIndex],
        extra: makeExtra('write', left, right, buffer, i, j, null),
      })
    }

    emit({
      type: 'merge-complete',
      range: [lo, hi],
      codeLine: 17,
      message: `Subarreglo [${lo}, ${hi}] fusionado y ordenado: [${joinValues(buffer)}].`,
      extra: makeExtra('write', left, right, buffer, i, j, null),
    })

    stack.pop()
  }

  if (input.length > 0) {
    mergeSort(0, input.length - 1, 0)
  }

  emit({
    type: 'done',
    range: [0, lastIndex],
    sortedIndices: input.map((_, index) => index),
    codeLine: 6,
    message: `SISTEMA ORDENADO. ${comparisons} comparaciones y ${swaps} movimientos en ${steps.length + 1} pasos.`,
  })

  return steps
}
