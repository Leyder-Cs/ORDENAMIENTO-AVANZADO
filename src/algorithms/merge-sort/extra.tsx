import { GitMerge } from 'lucide-react'
import type { CardData } from '../../core/types'
import type { MergeExtraData } from './steps'

const PHASE_LABEL: Record<MergeExtraData['phase'], string> = {
  idle: 'LISTO',
  split: 'DIVISIÓN',
  merge: 'FUSIÓN',
  write: 'REUBICANDO',
  done: 'COMPLETO',
}

const PHASE_COLOR: Record<MergeExtraData['phase'], string> = {
  idle: '#94a3b8',
  split: '#00f0ff',
  merge: '#ff2bd6',
  write: '#39ff14',
  done: '#39ff14',
}

interface HalfProps {
  label: string
  cards: CardData[]
  pointer: number
  color: string
  active: boolean
  showPointer: boolean
}

function Half({ label, cards, pointer, color, active, showPointer }: HalfProps) {
  return (
    <div
      className="flex h-24 min-w-0 flex-col border p-2"
      style={{
        borderColor: active ? `${color}99` : 'rgba(255,255,255,0.1)',
        backgroundColor: active ? `${color}0d` : 'rgba(0,0,0,0.22)',
      }}
    >
      <div className="mb-1.5 flex shrink-0 items-center justify-between gap-2">
        <span
          className="font-display text-[8px] font-bold tracking-[0.16em]"
          style={{ color }}
        >
          {label}
        </span>
        <span className="font-mono text-[8px] text-slate-600">{cards.length} elem.</span>
      </div>
      <div className="stable-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="flex flex-wrap gap-1">
          {cards.length === 0 ? (
            <span className="font-mono text-[10px] text-slate-600">—</span>
          ) : (
            cards.map((card, index) => {
              const consumed = showPointer && index < pointer
              const isNext = showPointer && index === pointer
              return (
                <span
                  key={card.id}
                  className="flex h-6 min-w-6 shrink-0 items-center justify-center border px-1 font-mono text-[10px] leading-none"
                  style={{
                    borderColor: isNext ? '#ffffff' : card.color,
                    color: consumed ? '#64748b' : card.color,
                    backgroundColor: isNext ? 'rgba(255,255,255,0.12)' : 'rgba(5,6,10,0.8)',
                    boxShadow: isNext
                      ? `0 0 12px ${color}88, inset 0 0 8px ${color}33`
                      : 'none',
                    opacity: consumed ? 0.38 : 1,
                  }}
                  aria-label={`${label}: ${card.value}${isNext ? ', siguiente' : ''}`}
                >
                  {card.value}
                </span>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export function MergeExtraPanel({ data }: { data: MergeExtraData }) {
  const phaseColor = PHASE_COLOR[data.phase]
  const showPointers = data.phase === 'merge'

  return (
    <div
      className="border border-white/10 bg-black/30 p-2.5"
      style={{ boxShadow: `inset 3px 0 0 ${phaseColor}` }}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1.5 font-display text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
          <GitMerge size={11} style={{ color: phaseColor }} aria-hidden="true" />
          <span className="truncate">Vista de fusión</span>
        </span>
        <span
          className="shrink-0 whitespace-nowrap border px-1.5 py-0.5 font-display text-[7px] font-bold tracking-[0.16em]"
          style={{ borderColor: `${phaseColor}66`, color: phaseColor }}
        >
          {PHASE_LABEL[data.phase]}
        </span>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Half
          label="MITAD IZQUIERDA"
          cards={data.left}
          pointer={data.leftPointer}
          color="#00f0ff"
          active={data.activeSide === 'left'}
          showPointer={showPointers}
        />
        <Half
          label="MITAD DERECHA"
          cards={data.right}
          pointer={data.rightPointer}
          color="#ff2bd6"
          active={data.activeSide === 'right'}
          showPointer={showPointers}
        />
      </div>

      <div className="mt-2 flex h-20 flex-col border border-white/10 bg-black/35 p-2">
        <div className="mb-1.5 flex shrink-0 items-center justify-between gap-2">
          <span className="font-display text-[8px] font-bold tracking-[0.16em] text-slate-400">
            SALIDA / BUFFER
          </span>
          <span className="font-mono text-[8px] text-slate-600">
            {data.buffer.length} / {data.left.length + data.right.length}
          </span>
        </div>
        <div className="stable-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="flex flex-wrap gap-1">
            {data.buffer.length === 0 ? (
              <span className="font-mono text-[10px] text-slate-600">
                Esperando la primera comparación…
              </span>
            ) : (
              data.buffer.map((card, index) => (
                <span
                  key={`${card.id}-${index}`}
                  className="flex h-6 min-w-6 shrink-0 items-center justify-center border border-neonGreen/40 px-1 font-mono text-[10px] leading-none text-neonGreen"
                  style={{ backgroundColor: 'rgba(57,255,20,0.06)' }}
                  aria-label={`Salida: ${card.value}`}
                >
                  {card.value}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
