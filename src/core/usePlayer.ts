import { useEffect } from 'react'
import { useVisualizerStore } from './useVisualizerStore'

const intervalForSpeed = (speed: number): number => Math.max(80, Math.round(1250 / speed))

/** Reproduce los pasos pre-calculados del algoritmo activo. */
export function usePlayer(): void {
  const isPlaying = useVisualizerStore((state) => state.isPlaying)
  const speed = useVisualizerStore((state) => state.speed)
  const currentIndex = useVisualizerStore((state) => state.currentIndex)
  const stepsLength = useVisualizerStore((state) => state.steps.length)
  const advance = useVisualizerStore((state) => state.advance)
  const pause = useVisualizerStore((state) => state.pause)

  useEffect(() => {
    if (!isPlaying) {
      return
    }
    if (currentIndex >= stepsLength - 1) {
      pause()
      return
    }

    const timer = window.setInterval(advance, intervalForSpeed(speed))
    return () => window.clearInterval(timer)
  }, [isPlaying, speed, currentIndex, stepsLength, advance, pause])
}
