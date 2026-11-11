import { motion, useReducedMotion } from 'framer-motion'
import { CheckCircle2, Crosshair, LayoutGrid, Terminal } from 'lucide-react'
import { useMemo } from 'react'
import { useVisualizerStore } from '../core/useVisualizerStore'
import { cn } from '../lib/cn'
import { Card } from './Card'
import { MarkerBadge } from './MarkerBadge'
import { Panel } from './Panel'

export function Board() {
  const step = useVisualizerStore((state) => state.steps[state.currentIndex])
  const currentIndex = useVisualizerStore((state) => state.currentIndex)
  const stepsLength = useVisualizerStore((state) => state.steps.length)
  const algorithmStatus = useVisualizerStore((state) => state.algorithm?.status)
  const renderExtra = useVisualizerStore((state) => state.algorithm?.renderExtra)
  const previousArray = useVisualizerStore((state) =>
    state.currentIndex > 0 ? state.steps[state.currentIndex - 1]?.array ?? null : null,
  )
  const reducedMotion = useReducedMotion() ?? false

  const movedIds = useMemo(() => {
    const moved = new Set<string>()
    if (!step) {
      return moved
    }
    if (step.swappedIndices) {
      const [first, second] = step.swappedIndices
      const firstCard = step.array[first]
      const secondCard = step.array[second]
      if (firstCard) moved.add(firstCard.id)
      if (secondCard) moved.add(secondCard.id)
      return moved
    }
    if (!previousArray) {
      return moved
    }
    const previousPositions = new Map(
      previousArray.map((card, position) => [card.id, position]),
    )
    step.array.forEach((card, position) => {
      if (previousPositions.get(card.id) !== position) {
        moved.add(card.id)
      }
    })
    return moved
  }, [previousArray, step])

  if (!step) {
    return null
  }

  const range = step.range
  const [lo, hi] = range ?? [0, Math.max(step.array.length - 1, 0)]
  const hasRange = range !== null && lo <= hi
  const isEmptyRange = range !== null && lo > hi
  const isReady = algorithmStatus === 'ready'
  const isDone = isReady && step.type === 'done'

  return (
    <Panel
      title="Tablero de cartas"
      icon={LayoutGrid}
      accent="cyan"
      meta={
        <span className="font-mono text-[10px] tracking-[0.18em] text-slate-500">
          PASO {currentIndex + 1}/{stepsLength}
        </span>
      }
      bodyClassName="p-3 sm:p-4"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
          <Crosshair size={11} className="text-neonCyan" aria-hidden="true" />
          {isEmptyRange ? 'Rango vacío' : hasRange ? 'Rango activo' : 'Arreglo completo'}
          {range !== null ? (
            <span className="text-neonCyan">
              [{lo}, {hi}]
            </span>
          ) : null}
        </span>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600 sm:inline">
          El color de cada carta es fijo
        </span>
      </div>

      <div className="overflow-x-auto overflow-y-hidden pb-1">
        <div
          className="cards-grid mx-auto"
          style={{ gridTemplateColumns: `repeat(${step.array.length}, minmax(2.1rem, 1fr))` }}
        >
          {step.array.map((card, index) => {
            const inRange = range === null ? true : hasRange && index >= lo && index <= hi
            const showBracket = hasRange && inRange && !isDone
            const indexMarkers = step.markers.filter(
              (marker) => marker.index === index && marker.role !== 'pivot',
            )
            const isPivot = step.markers.some(
              (marker) => marker.index === index && marker.role === 'pivot',
            )

            return (
              <div key={card.id} className="flex min-w-0 flex-col items-center">
                <div className="relative h-7 w-full" aria-hidden="true">
                  {showBracket ? (
                    <div
                      className={cn(
                        'absolute -mx-1 top-3 h-4 border-t-2 border-[#00f0ff]/60',
                        index === lo && 'rounded-tl border-l-2',
                        index === hi && 'rounded-tr border-r-2',
                      )}
                      style={{ boxShadow: '0 -2px 14px rgba(0, 240, 255, 0.22)' }}
                    >
                      {index === lo ? (
                        <span className="absolute -top-3.5 left-0 font-display text-[8px] font-bold tracking-[0.16em] text-neonCyan">
                          lo
                        </span>
                      ) : null}
                      {index === hi ? (
                        <span className="absolute -top-3.5 right-0 font-display text-[8px] font-bold tracking-[0.16em] text-neonPink">
                          hi
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                <div className="flex w-full justify-center">
                  <Card
                    card={card}
                    index={index}
                    isPivot={isPivot}
                    isSorted={step.sortedIndices.includes(index)}
                    isActive={inRange}
                    isMoving={movedIds.has(card.id)}
                  />
                </div>

                <div className="mt-1 flex h-[4.5rem] flex-wrap content-start items-start justify-center gap-1 overflow-hidden">
                  {indexMarkers.map((marker) => (
                    <MarkerBadge
                      key={`${marker.role}-${marker.label ?? ''}-${marker.index}`}
                      marker={marker}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-2 flex h-[4.5rem] items-start gap-2 border border-white/10 bg-black/50 px-3 py-2">
        <Terminal size={14} className="mt-0.5 shrink-0 text-neonCyan" aria-hidden="true" />
        <div className="stable-scroll h-full min-w-0 flex-1 overflow-y-auto overscroll-contain">
          <p
            className="caret font-mono text-[11px] leading-relaxed text-cyan-100/90 sm:text-xs"
            aria-live="polite"
          >
            {step.message}
          </p>
        </div>
      </div>

      {renderExtra ? (
        <div className="mt-3" data-testid="board-extra">
          {renderExtra(step)}
        </div>
      ) : null}

      <div
        className={cn(
          'mt-3 flex h-12 items-center justify-center gap-2 overflow-hidden border px-4 transition-colors',
          isDone ? 'border-neonGreen/60 bg-neonGreen/10' : 'border-white/10 bg-black/30',
        )}
        style={isDone ? { boxShadow: '0 0 30px -10px rgba(57, 255, 20, 0.8)' } : undefined}
        role={isDone ? 'status' : undefined}
        data-testid="done-status"
      >
        {isDone ? (
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reducedMotion ? 0 : 0.3, ease: 'easeOut' }}
            className="flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={17} className="text-neonGreen" aria-hidden="true" />
            <span className="font-display text-sm font-bold tracking-[0.28em] text-neonGreen sm:text-base">
              SISTEMA ORDENADO
            </span>
          </motion.div>
        ) : (
          <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-slate-600">
            {currentIndex === 0 ? 'Listo para ejecutar' : 'Secuencia en curso'}
          </span>
        )}
      </div>
    </Panel>
  )
}
