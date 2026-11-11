import { describe, expect, it } from 'vitest'
import { ALGORITHMS } from '../registry'
import { PENDING_MESSAGE } from '../pending'
import type { AlgorithmDefinition, Step } from '../types'

const CASES: Array<{ name: string; input: number[] }> = [
  { name: 'arreglo vacío', input: [] },
  { name: 'un solo elemento', input: [7] },
  { name: 'duplicados', input: [3, 1, 3, 2, 1, 3] },
  { name: 'ya ordenado', input: [1, 2, 3, 4, 5] },
  { name: 'invertido', input: [5, 4, 3, 2, 1] },
  { name: 'ejemplo base', input: [4, 2, 7, 6, 3, 8, 1, 5] },
]

const values = (step: Step): number[] => step.array.map((card) => card.value)

const assertValidContract = (algorithm: AlgorithmDefinition, input: number[]): void => {
  const steps = algorithm.generateSteps(input)
  expect(steps.length).toBeGreaterThanOrEqual(2)
  expect(steps[0].type).toBe('init')
  expect(steps[steps.length - 1].type).toBe('done')

  const sortedInput = [...input].sort((a, b) => a - b)
  expect(values(steps[steps.length - 1])).toEqual(sortedInput)

  const initialCards = steps[0].array
  const colorById = new Map(initialCards.map((card) => [card.id, card.color]))
  const initialIds = initialCards.map((card) => card.id).sort()

  let previousComparisons = 0
  let previousSwaps = 0
  const seenCards = new Set<unknown>()
  const seenArrays = new Set<unknown>()

  steps.forEach((step) => {
    const ids = step.array.map((card) => card.id).sort()
    expect(ids).toEqual(initialIds)
    step.array.forEach((card) => {
      expect(card.color).toBe(colorById.get(card.id))
      expect(seenCards.has(card)).toBe(false)
      seenCards.add(card)
    })
    expect(seenArrays.has(step.array)).toBe(false)
    seenArrays.add(step.array)

    expect(step.comparisons).toBeGreaterThanOrEqual(previousComparisons)
    expect(step.swaps).toBeGreaterThanOrEqual(previousSwaps)
    previousComparisons = step.comparisons
    previousSwaps = step.swaps

    if (step.array.length > 0 && step.range) {
      const [lo, hi] = step.range
      expect(lo).toBeGreaterThanOrEqual(0)
      expect(lo).toBeLessThanOrEqual(step.array.length)
      expect(hi).toBeGreaterThanOrEqual(-1)
      expect(hi).toBeLessThan(step.array.length)
      if (lo <= hi) {
        expect(hi).toBeLessThan(step.array.length)
      }
    }

    step.markers.forEach((marker) => {
      expect(marker.index).toBeGreaterThanOrEqual(0)
      expect(marker.index).toBeLessThan(step.array.length)
    })

    expect(step.codeLine).toBeGreaterThanOrEqual(0)
    expect(step.codeLine).toBeLessThan(algorithm.code.lines.length)
  })
}

describe('contrato de algoritmos', () => {
  ALGORITHMS.forEach((algorithm) => {
    if (algorithm.status === 'pending') {
      it.skip(`${algorithm.name} está pendiente: implementa steps.ts para correr el contrato`, () => {
        // Se habilita automáticamente al cambiar status a 'ready'.
      })
      return
    }

    describe(algorithm.name, () => {
      CASES.forEach(({ name, input }) => {
        it(`cumple el contrato con ${name}`, () => {
          assertValidContract(algorithm, input)
        })
      })

      if (algorithm.id === 'quick-sort') {
        it('conserva los 56 pasos y contadores del ejemplo original', () => {
          const steps = algorithm.generateSteps([4, 2, 7, 6, 3, 8, 1, 5])
          const last = steps[steps.length - 1]
          expect(steps).toHaveLength(56)
          expect(last.comparisons).toBe(24)
          expect(last.swaps).toBe(6)
          expect(values(last)).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
          expect(new Set(steps[0].array.map((card) => card.color)).size).toBe(8)
        })
      }
    })
  })
})

describe('esqueletos pendientes', () => {
  const pending = ALGORITHMS.filter((algorithm) => algorithm.status === 'pending')

  it('solo emiten init y done con el mensaje exacto', () => {
    pending.forEach((algorithm) => {
      const steps = algorithm.generateSteps(algorithm.defaultArray)
      expect(steps).toHaveLength(2)
      expect(steps.map((step) => step.type)).toEqual(['init', 'done'])
      steps.forEach((step) => {
        expect(step.message).toBe(PENDING_MESSAGE)
        expect(step.sortedIndices).toEqual([])
        expect(step.comparisons).toBe(0)
        expect(step.swaps).toBe(0)
      })
      expect(values(steps[steps.length - 1])).toEqual(algorithm.defaultArray)
    })
  })
})
