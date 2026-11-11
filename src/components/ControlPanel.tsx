import {
  AlertTriangle,
  ArrowLeftRight,
  ArrowRight,
  Film,
  Gauge,
  Layers,
  Pause,
  Play,
  RotateCcw,
  Shuffle,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
} from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { getStepMetrics } from '../core/metrics'
import type { OptionDef, OptionValue } from '../core/types'
import { useVisualizerStore } from '../core/useVisualizerStore'
import { cn } from '../lib/cn'
import { Panel } from './Panel'

const MAX_CARDS = 20

function OptionControl({
  option,
  value,
  onChange,
}: {
  option: OptionDef
  value: OptionValue
  onChange: (value: OptionValue) => void
}) {
  if (option.type === 'segmented') {
    return (
      <div className="flex flex-wrap">
        {option.choices?.map((choice) => (
          <button
            key={choice.value}
            type="button"
            className="pivot-option"
            aria-pressed={String(value) === choice.value}
            onClick={() => onChange(choice.value)}
          >
            {choice.label}
          </button>
        ))}
      </div>
    )
  }

  if (option.type === 'select') {
    return (
      <select
        value={String(value)}
        onChange={(event) => onChange(event.target.value)}
        className="cyber-input"
        aria-label={option.label}
      >
        {option.choices?.map((choice) => (
          <option key={choice.value} value={choice.value}>
            {choice.label}
          </option>
        ))}
      </select>
    )
  }

  return (
    <button
      type="button"
      className="pivot-option self-start"
      aria-pressed={Boolean(value)}
      onClick={() => onChange(!value)}
    >
      {value ? 'Activado' : 'Desactivado'}
    </button>
  )
}

export function ControlPanel() {
  const algorithm = useVisualizerStore((state) => state.algorithm)
  const values = useVisualizerStore((state) => state.values)
  const options = useVisualizerStore((state) => state.options)
  const isPlaying = useVisualizerStore((state) => state.isPlaying)
  const currentIndex = useVisualizerStore((state) => state.currentIndex)
  const stepsLength = useVisualizerStore((state) => state.steps.length)
  const speed = useVisualizerStore((state) => state.speed)
  const step = useVisualizerStore((state) => state.steps[state.currentIndex])

  const setArray = useVisualizerStore((state) => state.setArray)
  const setOption = useVisualizerStore((state) => state.setOption)
  const toggle = useVisualizerStore((state) => state.toggle)
  const next = useVisualizerStore((state) => state.next)
  const previous = useVisualizerStore((state) => state.previous)
  const reset = useVisualizerStore((state) => state.reset)
  const setSpeed = useVisualizerStore((state) => state.setSpeed)

  const [rawInput, setRawInput] = useState(values.join(', '))
  const [error, setError] = useState<string | null>(null)

  if (!algorithm) {
    return null
  }

  const metrics = getStepMetrics(step)
  const isFinished = currentIndex >= stepsLength - 1
  const progress = stepsLength > 1 ? (currentIndex / (stepsLength - 1)) * 100 : 0
  const examples =
    algorithm.examples && algorithm.examples.length > 0
      ? algorithm.examples
      : [{ label: 'Ejemplo base', values: algorithm.defaultArray }]

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const tokens = rawInput
      .split(',')
      .map((token) => token.trim())
      .filter((token) => token.length > 0)

    if (tokens.length === 0) {
      setError('Ingresa al menos un número separado por comas.')
      return
    }
    if (tokens.length > MAX_CARDS) {
      setError(`Máximo ${MAX_CARDS} números. Recibí ${tokens.length}.`)
      return
    }
    if (tokens.some((token) => !/^-?\d+$/.test(token))) {
      setError('Usa solo números enteros separados por comas.')
      return
    }

    const parsed = tokens.map(Number)
    if (parsed.some((value) => value < -999 || value > 999)) {
      setError('Los valores deben estar entre -999 y 999.')
      return
    }

    setError(null)
    setArray(parsed)
  }

  const handleRandom = (): void => {
    const length = Math.max(6, Math.min(12, values.length || algorithm.defaultArray.length))
    const randomValues = Array.from(
      { length },
      () => Math.floor(Math.random() * 90) + 10,
    )
    setError(null)
    setRawInput(randomValues.join(', '))
    setArray(randomValues)
  }

  const stats = [
    { label: 'Comparaciones', value: metrics.comparisons, color: '#00f0ff', icon: ArrowLeftRight },
    { label: algorithm.swapsLabel ?? 'Intercambios', value: metrics.swaps, color: '#ff2bd6', icon: Shuffle },
    { label: 'Profundidad', value: metrics.depth, color: '#f9f002', icon: Layers },
  ]

  return (
    <Panel
      title="Panel de control"
      icon={SlidersHorizontal}
      accent="pink"
      meta={
        <span className="hidden font-mono text-[9px] tracking-[0.16em] text-slate-500 sm:inline">
          ESPACIO: PLAY/PAUSA · ← →: PASOS
        </span>
      }
      bodyClassName="p-3 sm:p-4"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className="ctrl-btn ctrl-btn-primary"
            aria-label={isPlaying ? 'Pausar visualización' : isFinished ? 'Repetir visualización' : 'Reproducir visualización'}
          >
            {isPlaying ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
            {isPlaying ? 'Pausar' : isFinished ? 'Repetir' : 'Reproducir'}
          </button>
          <button
            type="button"
            onClick={previous}
            disabled={currentIndex === 0}
            className="ctrl-btn"
            aria-label="Paso anterior"
          >
            <SkipBack size={13} aria-hidden="true" />
            Anterior
          </button>
          <button
            type="button"
            onClick={next}
            disabled={isFinished}
            className="ctrl-btn"
            aria-label="Paso siguiente"
          >
            Siguiente
            <SkipForward size={13} aria-hidden="true" />
          </button>
          <button type="button" onClick={reset} className="ctrl-btn" aria-label="Reiniciar visualización">
            <RotateCcw size={13} aria-hidden="true" />
            Reiniciar
          </button>

          <div className="flex min-w-[9rem] flex-1 items-center gap-2 sm:ml-auto sm:max-w-xs">
            <div className="h-1 flex-1 overflow-hidden bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-neonPink to-neonCyan transition-[width] duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="whitespace-nowrap font-mono text-[9px] tracking-[0.12em] text-slate-500">
              {currentIndex + 1}/{stepsLength}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {stats.map(({ label, value, color, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-2 border border-white/10 bg-black/35 px-2 py-1.5 sm:px-3"
              style={{ boxShadow: `inset 0 -2px 0 ${color}33` }}
            >
              <Icon size={13} style={{ color }} aria-hidden="true" className="hidden sm:block" />
              <div className="min-w-0">
                <p className="truncate font-mono text-[8px] uppercase tracking-[0.14em] text-slate-500">
                  {label}
                </p>
                <p className="font-mono text-sm leading-tight" style={{ color }}>
                  {String(value).padStart(2, '0')}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="speed-range"
                  className="flex items-center gap-1.5 font-display text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400"
                >
                  <Gauge size={12} className="text-neonCyan" aria-hidden="true" />
                  Velocidad
                </label>
                <span className="font-mono text-[10px] text-neonCyan">{speed}×</span>
              </div>
              <input
                id="speed-range"
                type="range"
                min={1}
                max={10}
                step={1}
                value={speed}
                onChange={(event) => setSpeed(Number(event.target.value))}
                className="speed-range"
                aria-label="Velocidad de reproducción"
              />
            </div>

            {algorithm.options && algorithm.options.length > 0 ? (
              <>
                {algorithm.options.map((option) => (
                  <div key={option.id} className="flex flex-col gap-1.5">
                    <span className="font-display text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                      {option.label}
                    </span>
                    <OptionControl
                      option={option}
                      value={options[option.id] as OptionValue}
                      onChange={(value) => setOption(option.id, value)}
                    />
                  </div>
                ))}
                <p className="font-mono text-[9px] leading-snug text-slate-600">
                  Cambiar una opción reinicia la simulación.
                </p>
              </>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2" noValidate>
            <label
              htmlFor="array-input"
              className="flex items-center justify-between gap-2 font-display text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400"
            >
              Arreglo personalizado
              <span className="font-mono text-[8px] font-normal tracking-[0.1em] text-slate-600">
                máx. {MAX_CARDS}
              </span>
            </label>
            <div className="flex gap-2">
              <input
                id="array-input"
                type="text"
                value={rawInput}
                onChange={(event) => setRawInput(event.target.value)}
                className="cyber-input"
                placeholder={algorithm.defaultArray.join(', ')}
                autoComplete="off"
                spellCheck={false}
                aria-describedby={error ? 'array-error' : undefined}
              />
              <button type="submit" className="ctrl-btn shrink-0" aria-label="Cargar arreglo personalizado">
                <ArrowRight size={13} aria-hidden="true" />
                Cargar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleRandom}
                className="ctrl-btn"
                aria-label="Generar arreglo aleatorio"
              >
                <Shuffle size={12} aria-hidden="true" />
                Aleatorio
              </button>
              {examples.map((example) => (
                <button
                  key={example.label}
                  type="button"
                  onClick={() => {
                    setError(null)
                    setRawInput(example.values.join(', '))
                    setArray(example.values)
                  }}
                  className="ctrl-btn"
                  aria-label={`Cargar ${example.label}`}
                >
                  <Film size={12} aria-hidden="true" />
                  {example.label}
                </button>
              ))}
            </div>
            {error ? (
              <p
                id="array-error"
                role="alert"
                className={cn('flex items-start gap-1.5 font-mono text-[10px] leading-snug text-pink-400')}
              >
                <AlertTriangle size={12} className="mt-0.5 shrink-0" aria-hidden="true" />
                {error}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </Panel>
  )
}
