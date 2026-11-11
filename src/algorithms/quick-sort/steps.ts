import { createCards, createStep } from '../../core/stepFactory'
import type { Marker, Step } from '../../core/types'

type Range = [number, number]

interface EmitOptions {
  type: string
  markers?: Marker[]
  range: Range
  codeLine: number
  message: string
  swappedIndices?: [number, number]
}

const pointerMarkers = (
  pivot: number,
  left: number | null,
  right: number | null,
): Marker[] => {
  const markers: Marker[] = [{ index: pivot, role: 'pivot', label: 'PIVOTE' }]
  if (left !== null) {
    markers.push({ index: left, role: 'left', label: 'i' })
  }
  if (right !== null) {
    markers.push({ index: right, role: 'right', label: 'j' })
  }
  return markers
}

/**
 * Quick Sort completo, con la misma partición y los mismos mensajes que la
 * versión anterior. Todos los pasos se pre-calculan.
 */
export function generateSteps(
  input: number[],
  options?: Record<string, unknown>,
): Step[] {
  const mode = options?.pivotMode === 'random' ? 'random' : 'first'
  const cards = createCards(input)
  const steps: Step[] = []
  const sorted = new Set<number>()
  const stack: Range[] = []
  let comparisons = 0
  let swaps = 0

  const emit = (optionsToEmit: EmitOptions): void => {
    steps.push(
      createStep({
        type: optionsToEmit.type,
        array: cards,
        markers: optionsToEmit.markers ?? [],
        range: optionsToEmit.range,
        sortedIndices: [...sorted].sort((a, b) => a - b),
        callStack: stack,
        codeLine: optionsToEmit.codeLine,
        message: optionsToEmit.message,
        swappedIndices: optionsToEmit.swappedIndices,
        comparisons,
        swaps,
      }),
    )
  }

  const swapCards = (a: number, b: number): void => {
    const temp = cards[a]
    cards[a] = cards[b]
    cards[b] = temp
  }

  const lastIndex = Math.max(input.length - 1, 0)

  emit({
    type: 'init',
    range: [0, lastIndex],
    codeLine: 0,
    message:
      mode === 'first'
        ? 'Arreglo inicial cargado. El pivote será el primer elemento de cada subarreglo.'
        : 'Arreglo inicial cargado. El pivote será un elemento aleatorio de cada subarreglo.',
  })

  const quickSort = (lo: number, hi: number, entryLine: number): void => {
    stack.push([lo, hi])

    const sliceText =
      lo <= hi ? cards.slice(lo, hi + 1).map((card) => card.value).join(', ') : 'vacío'

    emit({
      type: 'recurse',
      range: [lo, hi],
      codeLine: entryLine,
      message: `Llamada quickSort(${lo}, ${hi}) → subarreglo [${sliceText}].`,
    })

    if (lo >= hi) {
      if (lo === hi) {
        sorted.add(lo)
        emit({
          type: 'sorted',
          range: [lo, hi],
          codeLine: 1,
          message: `Un solo elemento (${cards[lo]?.value ?? ''}): ya está en su posición final.`,
        })
      } else {
        emit({
          type: 'sorted',
          range: [lo, hi],
          codeLine: 1,
          message: `El rango [${lo}, ${hi}] está vacío: no hay nada que ordenar.`,
        })
      }
      stack.pop()
      return
    }

    if (mode === 'random') {
      const candidate = lo + Math.floor(Math.random() * (hi - lo + 1))
      if (candidate !== lo) {
        const candidateValue = cards[candidate].value
        const firstValue = cards[lo].value
        swapCards(lo, candidate)
        swaps += 1
        emit({
          type: 'swap',
          range: [lo, hi],
          codeLine: 2,
          message: `Pivote aleatorio: ${firstValue} y ${candidateValue} se intercambian para llevar el pivote ${cards[lo].value} al inicio.`,
          swappedIndices: [lo, candidate],
        })
      }
    }

    const pivot = cards[lo]

    emit({
      type: 'choose-pivot',
      markers: pointerMarkers(lo, lo + 1, hi),
      range: [lo, hi],
      codeLine: 2,
      message: `Pivote elegido: ${pivot.value} en la posición ${lo}. i = ${lo + 1}, j = ${hi}.`,
    })

    let i = lo + 1
    let j = hi

    for (;;) {
      while (i <= j) {
        comparisons += 1
        const current = cards[i]
        if (current.value <= pivot.value) {
          i += 1
          emit({
            type: 'move-left',
            markers: pointerMarkers(lo, i <= j ? i : null, j),
            range: [lo, hi],
            codeLine: 6,
            message:
              i <= j
                ? `${current.value} ≤ ${pivot.value}: i avanza a la posición ${i}.`
                : `${current.value} ≤ ${pivot.value}: i alcanza el borde derecho del subarreglo.`,
          })
        } else {
          emit({
            type: 'move-left',
            markers: pointerMarkers(lo, i, j),
            range: [lo, hi],
            codeLine: 6,
            message: `${current.value} > ${pivot.value}: i se detiene en la posición ${i}.`,
          })
          break
        }
      }

      while (i <= j) {
        comparisons += 1
        const current = cards[j]
        if (current.value > pivot.value) {
          j -= 1
          emit({
            type: 'move-right',
            markers: pointerMarkers(lo, i <= j ? i : null, j),
            range: [lo, hi],
            codeLine: 7,
            message: `${current.value} > ${pivot.value}: j retrocede a la posición ${j}.`,
          })
        } else {
          emit({
            type: 'move-right',
            markers: pointerMarkers(lo, i, j),
            range: [lo, hi],
            codeLine: 7,
            message: `${current.value} ≤ ${pivot.value}: j se detiene en la posición ${j}.`,
          })
          break
        }
      }

      if (i >= j) {
        break
      }

      const leftValue = cards[i].value
      const rightValue = cards[j].value
      swapCards(i, j)
      swaps += 1
      emit({
        type: 'swap',
        markers: pointerMarkers(lo, i, j),
        range: [lo, hi],
        codeLine: 9,
        message: `Intercambio: ${leftValue} ↔ ${rightValue} (posiciones ${i} y ${j}).`,
        swappedIndices: [i, j],
      })
    }

    const pivotValue = pivot.value
    sorted.add(j)

    if (lo !== j) {
      const displacedValue = cards[j].value
      swapCards(lo, j)
      swaps += 1
      emit({
        type: 'place-pivot',
        markers: [{ index: j, role: 'pivot', label: 'PIVOTE' }],
        range: [lo, hi],
        codeLine: 11,
        message: `El pivote ${pivotValue} se coloca en su posición final ${j} (sale ${displacedValue}).`,
        swappedIndices: [lo, j],
      })
    } else {
      emit({
        type: 'place-pivot',
        markers: [{ index: j, role: 'pivot', label: 'PIVOTE' }],
        range: [lo, hi],
        codeLine: 11,
        message: `El pivote ${pivotValue} ya estaba en su posición final ${j}.`,
      })
    }

    quickSort(lo, j - 1, 12)
    quickSort(j + 1, hi, 13)
    stack.pop()
  }

  if (input.length > 0) {
    quickSort(0, input.length - 1, 0)
  }

  for (let index = 0; index < cards.length; index += 1) {
    sorted.add(index)
  }

  emit({
    type: 'done',
    range: [0, lastIndex],
    codeLine: 14,
    message: `SISTEMA ORDENADO. ${comparisons} comparaciones y ${swaps} intercambios en ${steps.length + 1} pasos.`,
  })

  return steps
}
