import { motion, useAnimationControls, useReducedMotion } from 'framer-motion'
import { Crown, Lock } from 'lucide-react'
import { useEffect } from 'react'
import type { CSSProperties } from 'react'
import type { CardData } from '../core/types'
import { cn } from '../lib/cn'

interface CardProps {
  card: CardData
  index: number
  isPivot: boolean
  isSorted: boolean
  isActive: boolean
  isMoving: boolean
}

export function Card({ card, index, isPivot, isSorted, isActive, isMoving }: CardProps) {
  const reducedMotion = useReducedMotion() ?? false
  const controls = useAnimationControls()
  const dimmed = !isActive && !isSorted

  useEffect(() => {
    if (!isMoving || reducedMotion) {
      controls.set({ y: 0, rotate: 0, scale: 1 })
      return
    }

    void controls.start({
      y: [0, -58, -10, 0],
      rotate: [0, -4, 4, 0],
      scale: [1, 1.06, 1.02, 1],
      transition: { duration: 0.5, times: [0, 0.35, 0.72, 1], ease: 'easeInOut' },
    })
  }, [isMoving, reducedMotion, controls])

  const cardStyle = {
    '--card-color': card.color,
  } as CSSProperties

  return (
    <motion.div
      layout
      layoutId={card.id}
      transition={
        reducedMotion
          ? { duration: 0 }
          : { type: 'spring', stiffness: 280, damping: 26, mass: 0.9 }
      }
      className="relative w-full max-w-[5rem] pt-7"
      style={{
        zIndex: isPivot ? 30 : isMoving ? 20 : 1,
        opacity: dimmed ? 0.35 : 1,
        filter: dimmed ? 'saturate(0.35)' : undefined,
      }}
      role="img"
      aria-label={[
        `Carta ${card.value}`,
        isPivot ? 'pivote' : '',
        isSorted ? 'en posición final' : '',
        dimmed ? 'fuera del subconjunto activo' : '',
      ]
        .filter(Boolean)
        .join(', ')}
    >
      {isPivot ? (
        <span className="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap border border-white/70 bg-[#05060a]/95 px-1.5 py-0.5 font-display text-[8px] font-bold tracking-[0.2em] text-white shadow-[0_0_14px_rgba(255,255,255,0.45)]">
          <Crown size={9} aria-hidden="true" />
          PIVOTE
        </span>
      ) : null}

      <motion.div animate={controls} className="relative">
        <div
          className={cn('card-face relative aspect-[2/3] w-full rounded-sm', isMoving && 'card-glitch')}
          style={cardStyle}
        >
          {isPivot ? <span className="pivot-ring" aria-hidden="true" /> : null}
          <span className="card-scanline" aria-hidden="true" />

          <span
            className="absolute left-1 top-1 z-[2] font-mono text-[9px] leading-none opacity-90 sm:text-[10px]"
            style={{ textShadow: '0 0 8px currentColor' }}
          >
            {card.value}
          </span>
          <span
            className="absolute bottom-1 right-1 z-[2] rotate-180 font-mono text-[9px] leading-none opacity-90 sm:text-[10px]"
            style={{ textShadow: '0 0 8px currentColor' }}
            aria-hidden="true"
          >
            {card.value}
          </span>

          <span className="absolute inset-0 z-[1] flex items-center justify-center">
            <span
              className="font-mono text-[clamp(1rem,2.2vw,1.75rem)] leading-none"
              style={{ textShadow: '0 0 16px currentColor, 0 0 34px currentColor' }}
            >
              {card.value}
            </span>
          </span>

          <span className="absolute bottom-1.5 left-1.5 z-[2] font-mono text-[7px] tracking-[0.1em] text-white/40">
            #{String(index + 1).padStart(2, '0')}
          </span>

          {isSorted ? (
            <>
              <span className="absolute right-1 top-1 z-[2] flex h-4 w-4 items-center justify-center border border-neonGreen/70 bg-black/70 text-neonGreen shadow-[0_0_10px_rgba(57,255,20,0.5)]">
                <Lock size={8} aria-hidden="true" />
              </span>
              <span className="sorted-bar absolute inset-x-0 bottom-0 z-[2] h-1.5" aria-hidden="true" />
            </>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  )
}
