import { History } from 'lucide-react'
import { useLayoutEffect, useRef } from 'react'
import { useVisualizerStore } from '../core/useVisualizerStore'
import { cn } from '../lib/cn'
import { Panel } from './Panel'

const toneForType = (type: string): string => {
  if (
    type === 'done' ||
    type === 'sorted' ||
    type.includes('place') ||
    type.includes('base') ||
    type.includes('built')
  ) {
    return 'border-neonGreen/50 text-neonGreen'
  }
  if (type.includes('swap') || type.includes('merge') || type.includes('write')) {
    return 'border-orange-400/50 text-orange-300'
  }
  if (
    type.includes('pivot') ||
    type.includes('select') ||
    type.includes('heap') ||
    type.includes('build') ||
    type.includes('sift') ||
    type.includes('extract')
  ) {
    return 'border-neonYellow/50 text-neonYellow'
  }
  if (type.includes('left') || type.includes('compare') || type.includes('min')) {
    return 'border-neonCyan/50 text-neonCyan'
  }
  if (type.includes('right')) {
    return 'border-neonPink/50 text-neonPink'
  }
  if (type.includes('recurse') || type.includes('split')) {
    return 'border-violet-400/50 text-violet-300'
  }
  return 'border-slate-500/50 text-slate-300'
}

export function StepLog() {
  const algorithm = useVisualizerStore((state) => state.algorithm)
  const steps = useVisualizerStore((state) => state.steps)
  const currentIndex = useVisualizerStore((state) => state.currentIndex)
  const logRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    const log = logRef.current
    if (log) {
      log.scrollTop = log.scrollHeight
    }
  }, [currentIndex])

  const end = currentIndex + 1
  const start = Math.max(0, end - 60)
  const visibleSteps = steps.slice(start, end)

  return (
    <Panel
      title="Registro de pasos"
      icon={History}
      accent="pink"
      meta={
        <span className="font-mono text-[9px] tracking-[0.16em] text-slate-500">
          {currentIndex + 1}/{steps.length}
        </span>
      }
      bodyClassName="p-0"
    >
      <div
        ref={logRef}
        className="stable-scroll h-56 overflow-y-auto overflow-x-hidden overscroll-contain px-2 py-2 sm:h-64"
      >
        {visibleSteps.map((step, offset) => {
          const index = start + offset
          const isCurrent = index === currentIndex
          const label = algorithm?.stepTypeLabels?.[step.type] ?? step.type.toUpperCase()

          return (
            <div
              key={index}
              className={cn(
                'log-row flex gap-2 px-2 py-1.5',
                isCurrent && 'log-row-active',
              )}
            >
              <span className="mt-0.5 w-7 shrink-0 text-right font-mono text-[9px] text-slate-600">
                {String(index + 1).padStart(3, '0')}
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex flex-wrap items-center gap-1.5">
                  <span
                    className={cn(
                      'border px-1 py-[1px] font-display text-[7px] font-bold tracking-[0.16em]',
                      toneForType(step.type),
                    )}
                  >
                    {label}
                  </span>
                  {isCurrent ? (
                    <span className="font-mono text-[8px] tracking-[0.16em] text-neonPink">
                      ● ACTUAL
                    </span>
                  ) : null}
                </div>
                <p
                  className={cn(
                    'font-mono text-[10px] leading-snug',
                    isCurrent ? 'text-slate-100' : 'text-slate-500',
                  )}
                >
                  {step.message}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}
