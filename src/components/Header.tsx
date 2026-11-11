import { Cpu } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useVisualizerStore } from '../core/useVisualizerStore'

export function Header() {
  const algorithm = useVisualizerStore((state) => state.algorithm)
  const isPlaying = useVisualizerStore((state) => state.isPlaying)
  const currentIndex = useVisualizerStore((state) => state.currentIndex)
  const stepsLength = useVisualizerStore((state) => state.steps.length)
  const isFinished = currentIndex >= stepsLength - 1
  const isPending = algorithm?.status === 'pending'

  const status = isPending
    ? { label: 'EN CONSTRUCCIÓN', color: '#f9f002' }
    : isFinished
      ? { label: 'SISTEMA ORDENADO', color: '#39ff14' }
      : isPlaying
        ? { label: 'EJECUTANDO', color: '#ff2bd6' }
        : { label: 'EN PAUSA', color: '#f9f002' }

  const name = algorithm?.name ?? 'ALGORITMO'
  const accent = algorithm?.accent ?? '#ff2bd6'

  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-center gap-3">
        <div
          className="relative flex h-11 w-11 shrink-0 items-center justify-center border bg-black/45"
          style={{
            borderColor: `${accent}99`,
            boxShadow: `0 0 24px -8px ${accent}, inset 0 0 16px ${accent}1f`,
          }}
          aria-hidden="true"
        >
          <Cpu size={22} style={{ color: accent }} />
          <span className="absolute -right-1 -top-1 h-2 w-2 bg-neonCyan shadow-[0_0_10px_#00f0ff]" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/"
              className="font-mono text-[9px] uppercase tracking-[0.2em] text-neonCyan/80 transition-colors hover:text-neonCyan"
            >
              ← Algoritmos
            </Link>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-600">
              // visualizador
            </span>
          </div>
          <h1
            className="glitch font-display text-2xl font-black uppercase leading-none tracking-[0.1em] text-white sm:text-4xl"
            data-text={name}
          >
            {name}
          </h1>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500 sm:text-[10px]">
            {algorithm?.description ?? 'Selecciona un algoritmo para comenzar'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        <span
          className="flex items-center gap-2 border bg-black/50 px-3 py-1.5"
          style={{ borderColor: `${status.color}66`, color: status.color }}
          aria-live="polite"
        >
          <span
            className={isPlaying ? 'h-1.5 w-1.5 animate-pulse rounded-full' : 'h-1.5 w-1.5 rounded-full'}
            style={{ backgroundColor: status.color, boxShadow: `0 0 10px ${status.color}` }}
            aria-hidden="true"
          />
          <span className="font-display text-[9px] font-bold tracking-[0.22em] sm:text-[10px]">
            {status.label}
          </span>
        </span>
        <span className="hidden border border-white/10 bg-black/40 px-2.5 py-1.5 font-mono text-[10px] tracking-[0.14em] text-slate-500 sm:inline">
          {String(currentIndex + 1).padStart(3, '0')} / {String(stepsLength).padStart(3, '0')}
        </span>
      </div>
    </header>
  )
}
