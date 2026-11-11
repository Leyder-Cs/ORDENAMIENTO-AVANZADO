import { Code2 } from 'lucide-react'
import { useLayoutEffect, useRef } from 'react'
import { useVisualizerStore } from '../core/useVisualizerStore'
import { cn } from '../lib/cn'
import { Panel } from './Panel'

export function CodePanel() {
  const algorithm = useVisualizerStore((state) => state.algorithm)
  const step = useVisualizerStore((state) => state.steps[state.currentIndex])
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const activeRef = useRef<HTMLDivElement | null>(null)
  const lines = algorithm?.code.lines ?? []
  const activeLine = lines.length > 0
    ? Math.min(Math.max(step?.codeLine ?? 0, 0), lines.length - 1)
    : 0

  useLayoutEffect(() => {
    const scroll = scrollRef.current
    const active = activeRef.current
    if (!scroll || !active) {
      return
    }

    const top = active.offsetTop
    const bottom = top + active.offsetHeight
    const viewTop = scroll.scrollTop
    const viewBottom = viewTop + scroll.clientHeight

    if (top < viewTop) {
      scroll.scrollTop = top - 8
    } else if (bottom > viewBottom) {
      scroll.scrollTop = bottom - scroll.clientHeight + 8
    }
  }, [activeLine])

  if (!algorithm) {
    return null
  }

  return (
    <Panel
      title="Código fuente"
      icon={Code2}
      accent="yellow"
      meta={
        <span className="border border-amber-400/40 px-2 py-0.5 font-display text-[8px] font-bold tracking-[0.18em] text-amber-300">
          {algorithm.code.language.toUpperCase()}
        </span>
      }
      bodyClassName="p-0"
      className="xl:sticky xl:top-4"
    >
      <div
        ref={scrollRef}
        className="stable-scroll relative max-h-[26rem] overflow-auto overscroll-contain py-2 xl:max-h-[calc(100vh-2rem)]"
      >
        {lines.map((line, index) => {
          const isActive = index === activeLine
          return (
            <div
              key={index}
              ref={isActive ? activeRef : undefined}
              className={cn(
                'flex gap-3 border-l-2 px-3 py-[3px] font-mono text-[10.5px] leading-relaxed sm:text-[11.5px]',
                isActive
                  ? 'border-neonPink bg-neonPink/10 text-white'
                  : 'border-transparent text-slate-500',
              )}
            >
              <span
                className={cn(
                  'w-4 shrink-0 text-right text-[9px]',
                  isActive ? 'text-neonPink' : 'text-slate-700',
                )}
              >
                {index + 1}
              </span>
              <code className="whitespace-pre">{line}</code>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}
