import { Layers } from 'lucide-react'
import { useVisualizerStore } from '../core/useVisualizerStore'
import { Panel } from './Panel'

const toCamelCase = (id: string): string =>
  id
    .split('-')
    .map((part, index) =>
      index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join('')

export function CallStackPanel() {
  const algorithm = useVisualizerStore((state) => state.algorithm)
  const step = useVisualizerStore((state) => state.steps[state.currentIndex])
  const frames = [...(step?.callStack ?? [])].reverse()
  const depth = frames.length
  const functionName = toCamelCase(algorithm?.id ?? 'algoritmo')

  return (
    <Panel
      title="Pila de llamadas"
      icon={Layers}
      accent="yellow"
      meta={
        <span className="border border-neonYellow/40 px-2 py-0.5 font-mono text-[9px] tracking-[0.16em] text-neonYellow">
          PROF. {depth}
        </span>
      }
      bodyClassName="stable-scroll h-56 overflow-y-auto overscroll-contain sm:h-64"
    >
      {frames.length === 0 ? (
        <p className="flex h-full items-center justify-center font-mono text-[11px] uppercase tracking-[0.2em] text-slate-600">
          Pila vacía
        </p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {frames.map(([lo, hi], frameIndex) => (
            <li
              key={`${lo}-${hi}-${frameIndex}`}
              className="flex items-center justify-between gap-2 border border-white/10 bg-black/35 px-2.5 py-1.5"
              style={
                frameIndex === 0
                  ? { borderColor: 'rgba(249, 240, 2, 0.45)', boxShadow: 'inset 3px 0 0 #f9f002' }
                  : { opacity: 0.68 }
              }
            >
              <span className="font-mono text-[11px] text-slate-200">
                {functionName}({lo}, {hi})
              </span>
              {frameIndex === 0 ? (
                <span className="font-display text-[7px] font-bold tracking-[0.2em] text-neonYellow">
                  CIMA
                </span>
              ) : (
                <span className="font-mono text-[8px] tracking-[0.14em] text-slate-600">
                  NIVEL {frames.length - frameIndex}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}
