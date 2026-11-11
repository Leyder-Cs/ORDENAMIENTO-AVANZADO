import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import type { Marker, MarkerRole } from '../core/types'

const ROLE_STYLE: Record<MarkerRole, { color: string; fallback: string }> = {
  pivot: { color: '#ffffff', fallback: 'PIVOTE' },
  left: { color: '#00f0ff', fallback: 'i' },
  right: { color: '#ff2bd6', fallback: 'j' },
  compare: { color: '#f9f002', fallback: 'CMP' },
  min: { color: '#39ff14', fallback: 'MIN' },
  'merge-left': { color: '#00f0ff', fallback: 'IZQ' },
  'merge-right': { color: '#ff2bd6', fallback: 'DER' },
  'heap-root': { color: '#f9f002', fallback: 'RAÍZ' },
  'heap-child': { color: '#a855f7', fallback: 'HIJO' },
  custom: { color: '#94a3b8', fallback: '•' },
}

interface MarkerBadgeProps {
  marker: Marker
}

/** Indicador genérico: la tabla de colores depende solo de MarkerRole. */
export function MarkerBadge({ marker }: MarkerBadgeProps) {
  const reducedMotion = useReducedMotion() ?? false
  const style = ROLE_STYLE[marker.role]
  const label = marker.label ?? style.fallback

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.18 }}
      className="flex flex-col items-center gap-0.5"
      aria-label={`Marcador ${label}`}
    >
      <ArrowUp size={12} style={{ color: style.color }} aria-hidden="true" />
      <span
        className="flex h-5 min-w-5 items-center justify-center whitespace-nowrap border px-1 font-display text-[9px] font-bold leading-none"
        style={{
          color: style.color,
          borderColor: `${style.color}aa`,
          backgroundColor: 'rgba(5,6,10,0.88)',
          boxShadow: `0 0 12px ${style.color}55, inset 0 0 8px ${style.color}22`,
        }}
      >
        {label}
      </span>
    </motion.div>
  )
}
