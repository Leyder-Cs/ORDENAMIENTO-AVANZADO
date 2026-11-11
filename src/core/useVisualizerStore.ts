import { create } from 'zustand'
import type { AlgorithmDefinition, OptionValue, Step } from './types'

interface VisualizerState {
  algorithm: AlgorithmDefinition | null
  values: number[]
  options: Record<string, unknown>
  steps: Step[]
  currentIndex: number
  isPlaying: boolean
  speed: number
  initialize: (algorithm: AlgorithmDefinition) => void
  setArray: (values: number[]) => void
  setOption: (id: string, value: OptionValue) => void
  play: () => void
  pause: () => void
  toggle: () => void
  advance: () => void
  next: () => void
  previous: () => void
  reset: () => void
  setSpeed: (speed: number) => void
}

const defaultOptions = (algorithm: AlgorithmDefinition): Record<string, unknown> => {
  const options: Record<string, unknown> = {}
  algorithm.options?.forEach((option) => {
    options[option.id] = option.defaultValue
  })
  return options
}

export const useVisualizerStore = create<VisualizerState>((set, get) => ({
  algorithm: null,
  values: [],
  options: {},
  steps: [],
  currentIndex: 0,
  isPlaying: false,
  speed: 5,

  initialize: (algorithm) => {
    const options = defaultOptions(algorithm)
    const values = [...algorithm.defaultArray]
    set({
      algorithm,
      options,
      values,
      steps: algorithm.generateSteps(values, options),
      currentIndex: 0,
      isPlaying: false,
    })
  },

  setArray: (values) => {
    const { algorithm, options } = get()
    if (!algorithm || values.length === 0) {
      return
    }
    set({
      values: [...values],
      steps: algorithm.generateSteps(values, options),
      currentIndex: 0,
      isPlaying: false,
    })
  },

  setOption: (id, value) => {
    const { algorithm, values, options } = get()
    if (!algorithm) {
      return
    }
    const nextOptions = { ...options, [id]: value }
    set({
      options: nextOptions,
      steps: algorithm.generateSteps(values, nextOptions),
      currentIndex: 0,
      isPlaying: false,
    })
  },

  play: () => {
    const { currentIndex, steps } = get()
    if (steps.length === 0) {
      return
    }
    if (currentIndex >= steps.length - 1) {
      set({ currentIndex: 0, isPlaying: true })
      return
    }
    set({ isPlaying: true })
  },

  pause: () => set({ isPlaying: false }),

  toggle: () => {
    if (get().isPlaying) {
      get().pause()
    } else {
      get().play()
    }
  },

  advance: () => {
    const { currentIndex, steps, isPlaying } = get()
    if (steps.length === 0 || currentIndex >= steps.length - 1) {
      set({ isPlaying: false })
      return
    }
    const nextIndex = currentIndex + 1
    set({
      currentIndex: nextIndex,
      isPlaying: nextIndex >= steps.length - 1 ? false : isPlaying,
    })
  },

  next: () => {
    set({ isPlaying: false })
    get().advance()
  },

  previous: () => {
    set({ isPlaying: false, currentIndex: Math.max(0, get().currentIndex - 1) })
  },

  reset: () => set({ currentIndex: 0, isPlaying: false }),

  setSpeed: (speed) => set({ speed: Math.min(10, Math.max(1, Math.round(speed))) }),
}))
