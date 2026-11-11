import confetti from 'canvas-confetti'
import { useReducedMotion } from 'framer-motion'
import { AlertTriangle, BookOpen, FileCode2 } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Board } from '../components/Board'
import { CallStackPanel } from '../components/CallStackPanel'
import { CodePanel } from '../components/CodePanel'
import { ControlPanel } from '../components/ControlPanel'
import { CyberBackdrop } from '../components/CyberBackdrop'
import { Header } from '../components/Header'
import { StepLog } from '../components/StepLog'
import { getAlgorithmById } from '../core/registry'
import { usePlayer } from '../core/usePlayer'
import { useVisualizerStore } from '../core/useVisualizerStore'
import { NotFound } from './NotFound'

const CONFETTI_COLORS = ['#00f0ff', '#ff2bd6', '#f9f002', '#39ff14', '#ffffff']

function PendingBanner() {
  return (
    <div
      className="pending-banner flex flex-col gap-2 border border-neonYellow/50 bg-neonYellow/[0.06] p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4"
      role="status"
      style={{ boxShadow: 'inset 4px 0 0 #f9f002, 0 0 30px -18px rgba(249, 240, 2, 0.9)' }}
    >
      <div className="flex items-start gap-2.5">
        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-neonYellow" aria-hidden="true" />
        <div>
          <p className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-neonYellow sm:text-xs">
            ESTE ALGORITMO ESTÁ EN CONSTRUCCIÓN: aquí va tu implementación
          </p>
          <p className="mt-1 font-mono text-[10px] leading-relaxed text-slate-400">
            Completa la lógica en{' '}
            <code className="border border-white/10 bg-black/50 px-1 py-0.5 text-neonCyan">
              src/algorithms/&lt;id&gt;/steps.ts
            </code>{' '}
            y sigue la{' '}
            <code className="border border-white/10 bg-black/50 px-1 py-0.5 text-neonCyan">
              docs/GUIA_COMPANEROS.md
            </code>
            .
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        <span className="flex items-center gap-1.5 border border-white/10 bg-black/40 px-2 py-1 font-mono text-[9px] tracking-[0.12em] text-slate-400">
          <FileCode2 size={11} aria-hidden="true" />
          steps.ts
        </span>
        <span className="flex items-center gap-1.5 border border-white/10 bg-black/40 px-2 py-1 font-mono text-[9px] tracking-[0.12em] text-slate-400">
          <BookOpen size={11} aria-hidden="true" />
          GUIA_COMPANEROS.md
        </span>
      </div>
    </div>
  )
}

export function Visualizer() {
  const { id } = useParams<{ id: string }>()
  const algorithm = getAlgorithmById(id)
  const initialize = useVisualizerStore((state) => state.initialize)
  const storedId = useVisualizerStore((state) => state.algorithm?.id)
  const isPending = algorithm?.status === 'pending'
  const reducedMotion = useReducedMotion() ?? false
  const isFinished = useVisualizerStore(
    (state) => state.currentIndex === state.steps.length - 1,
  )
  const firedRef = useRef(false)

  useLayoutEffect(() => {
    if (algorithm && storedId !== algorithm.id) {
      initialize(algorithm)
    }
  }, [algorithm, storedId, initialize])

  usePlayer()

  useEffect(() => {
    if (!algorithm) {
      return
    }
    const handleKeyDown = (event: KeyboardEvent): void => {
      const target = event.target
      if (target instanceof HTMLElement) {
        const tag = target.tagName
        if (
          tag === 'INPUT' ||
          tag === 'TEXTAREA' ||
          tag === 'SELECT' ||
          tag === 'BUTTON' ||
          tag === 'A' ||
          target.isContentEditable
        ) {
          return
        }
      }

      const store = useVisualizerStore.getState()
      if (event.code === 'Space') {
        event.preventDefault()
        store.toggle()
        return
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        store.next()
        return
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        store.previous()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [algorithm])

  useEffect(() => {
    if (!isFinished || isPending) {
      firedRef.current = false
      return
    }
    if (firedRef.current || reducedMotion) {
      return
    }
    firedRef.current = true

    void confetti({
      particleCount: 150,
      spread: 88,
      origin: { y: 0.62 },
      colors: CONFETTI_COLORS,
      scalar: 1.05,
      ticks: 240,
    })

    const timer = window.setTimeout(() => {
      void confetti({
        particleCount: 80,
        angle: 60,
        spread: 62,
        origin: { x: 0, y: 0.72 },
        colors: CONFETTI_COLORS,
      })
      void confetti({
        particleCount: 80,
        angle: 120,
        spread: 62,
        origin: { x: 1, y: 0.72 },
        colors: CONFETTI_COLORS,
      })
    }, 260)

    return () => window.clearTimeout(timer)
  }, [isFinished, isPending, reducedMotion])

  if (!algorithm || storedId !== algorithm.id) {
    return <NotFound />
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <CyberBackdrop />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1480px] flex-col gap-4 px-3 py-4 sm:px-6 sm:py-6">
        <Header />

        {isPending ? <PendingBanner /> : null}

        <main className="grid min-w-0 grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex min-w-0 flex-col gap-4">
            <Board />
            <div className="grid gap-4 md:grid-cols-2">
              <CallStackPanel />
              <StepLog />
            </div>
          </div>
          <div className="min-w-0">
            <CodePanel />
          </div>
        </main>

        <ControlPanel key={algorithm.id} />

        <footer className="pb-1 text-center font-mono text-[9px] uppercase tracking-[0.26em] text-slate-700">
          // {algorithm.id} · pasos pre-calculados · contrato compartido
        </footer>
      </div>
    </div>
  )
}
