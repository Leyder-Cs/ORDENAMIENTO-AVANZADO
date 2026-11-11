import { Network } from 'lucide-react'
import type { CardData } from '../../core/types'
import type { HeapExtraData, HeapPhase } from './steps'

const PHASE_LABEL: Record<HeapPhase, string> = {
  build: 'CONSTRUIR',
  heapify: 'HEAPIFY',
  extract: 'EXTRAER',
  done: 'ORDENADO',
}

const PHASE_COLOR: Record<HeapPhase, string> = {
  build: '#f9f002',
  heapify: '#00f0ff',
  extract: '#ff8a00',
  done: '#39ff14',
}

const NODE_WIDTH = 32
const NODE_HEIGHT = 30
const X_GAP = 12
const LEVEL_GAP = 24

interface HeapNodeLayout {
  index: number
  card: CardData
  x: number
  y: number
  level: number
}

interface HeapLayout {
  nodes: HeapNodeLayout[]
  width: number
  height: number
}

const buildLayout = (array: CardData[], heapSize: number): HeapLayout => {
  const totalSize = array.length
  if (totalSize === 0) {
    return { nodes: [], width: 260, height: NODE_HEIGHT }
  }

  const size = Math.min(Math.max(heapSize, 0), totalSize)
  const levels = Math.floor(Math.log2(totalSize)) + 1
  const lastLevelSlots = 2 ** (levels - 1)
  const width = Math.max(lastLevelSlots * (NODE_WIDTH + X_GAP), 260)
  const height = levels * NODE_HEIGHT + (levels - 1) * LEVEL_GAP
  const nodes: HeapNodeLayout[] = []

  for (let index = 0; index < size; index += 1) {
    const card = array[index]
    if (!card) {
      continue
    }
    const level = Math.floor(Math.log2(index + 1))
    const firstIndexOfLevel = 2 ** level - 1
    const slotsInLevel = 2 ** level
    const slot = index - firstIndexOfLevel
    const x = ((slot + 0.5) / slotsInLevel) * width
    const y = level * (NODE_HEIGHT + LEVEL_GAP)

    nodes.push({ index, card, x, y, level })
  }

  return { nodes, width, height }
}

const highlightFor = (index: number, data: HeapExtraData): string | null => {
  if (data.target === index) {
    return '#ff2bd6'
  }
  if (data.largest === index && data.activeRoot !== index) {
    return '#39ff14'
  }
  if (data.activeRoot === index) {
    return '#f9f002'
  }
  if (data.comparing.includes(index)) {
    return '#00f0ff'
  }
  return null
}

interface HeapExtraPanelProps {
  data: HeapExtraData
  array: CardData[]
  sortedIndices: number[]
}

export function HeapExtraPanel({ data, array, sortedIndices }: HeapExtraPanelProps) {
  const phaseColor = PHASE_COLOR[data.phase]
  const layout = buildLayout(array, data.heapSize)
  const sortedCards = [...sortedIndices]
    .sort((a, b) => a - b)
    .map((index) => array[index])
    .filter((card): card is CardData => Boolean(card))

  return (
    <div
      className="border border-white/10 bg-black/30 p-2.5"
      style={{ boxShadow: `inset 3px 0 0 ${phaseColor}` }}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1.5 font-display text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
          <Network size={11} style={{ color: phaseColor }} aria-hidden="true" />
          <span className="truncate">Vista de montículo</span>
        </span>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="whitespace-nowrap border border-white/10 px-1.5 py-0.5 font-mono text-[8px] tracking-[0.14em] text-slate-400">
            HEAP {data.heapSize}
          </span>
          <span
            className="whitespace-nowrap border px-1.5 py-0.5 font-display text-[7px] font-bold tracking-[0.16em]"
            style={{ borderColor: `${phaseColor}66`, color: phaseColor }}
          >
            {PHASE_LABEL[data.phase]}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto pb-1">
        <div
          className="relative mx-auto"
          style={{ width: layout.width, height: layout.height }}
        >
          <svg
            className="pointer-events-none absolute inset-0"
            width={layout.width}
            height={layout.height}
            aria-hidden="true"
          >
            {layout.nodes.map((node) => {
              if (node.index === 0) {
                return null
              }
              const parent = layout.nodes[Math.floor((node.index - 1) / 2)]
              if (!parent) {
                return null
              }
              const childHighlight = highlightFor(node.index, data)
              const parentHighlight = highlightFor(parent.index, data)
              const edgeColor =
                childHighlight ?? parentHighlight ?? 'rgba(148, 163, 184, 0.24)'

              return (
                <line
                  key={`edge-${node.index}`}
                  x1={parent.x}
                  y1={parent.y + NODE_HEIGHT}
                  x2={node.x}
                  y2={node.y}
                  stroke={edgeColor}
                  strokeWidth={childHighlight || parentHighlight ? 1.5 : 1}
                  opacity={childHighlight || parentHighlight ? 0.9 : 0.65}
                />
              )
            })}
          </svg>

          {layout.nodes.map((node) => {
            const highlight = highlightFor(node.index, data)
            const borderColor = highlight ?? `${node.card.color}99`
            const textColor = highlight ?? node.card.color

            return (
              <div
                key={node.card.id}
                className="absolute flex items-center justify-center border font-mono text-[11px] leading-none"
                style={{
                  left: node.x - NODE_WIDTH / 2,
                  top: node.y,
                  width: NODE_WIDTH,
                  height: NODE_HEIGHT,
                  borderColor,
                  color: textColor,
                  backgroundColor: highlight
                    ? `${highlight}1a`
                    : 'rgba(5, 6, 10, 0.82)',
                  boxShadow: highlight
                    ? `0 0 14px ${highlight}66, inset 0 0 8px ${highlight}22`
                    : `inset 0 0 8px ${node.card.color}18`,
                }}
                title={`Índice ${node.index}: ${node.card.value}`}
                aria-label={`Nodo ${node.index}: ${node.card.value}`}
              >
                {node.card.value}
              </div>
            )
          })}
        </div>
      </div>

      <div className="stable-scroll mt-2 flex h-12 items-center gap-1.5 overflow-x-auto overscroll-contain border border-white/10 bg-black/35 p-2">
        <span className="shrink-0 font-display text-[8px] font-bold tracking-[0.16em] text-slate-400">
          ZONA ORDENADA
        </span>
        {sortedCards.length === 0 ? (
          <span className="shrink-0 font-mono text-[10px] text-slate-600">—</span>
        ) : (
          sortedCards.map((card) => (
            <span
              key={card.id}
              className="flex h-6 min-w-6 shrink-0 items-center justify-center border px-1 font-mono text-[10px] leading-none"
              style={{
                borderColor: `${card.color}55`,
                color: card.color,
                backgroundColor: 'rgba(57, 255, 20, 0.05)',
              }}
              aria-label={`Posición fija: ${card.value}`}
            >
              {card.value}
            </span>
          ))
        )}
        <span className="ml-auto shrink-0 font-mono text-[8px] text-slate-600">
          {sortedCards.length} fijos
        </span>
      </div>
    </div>
  )
}
