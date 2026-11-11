import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

type Accent = 'pink' | 'cyan' | 'yellow' | 'green'

const ACCENT_COLOR: Record<Accent, string> = {
  pink: '#ff2bd6',
  cyan: '#00f0ff',
  yellow: '#f9f002',
  green: '#39ff14',
}

interface PanelProps {
  title: string
  icon?: LucideIcon
  accent?: Accent
  meta?: ReactNode
  className?: string
  bodyClassName?: string
  children: ReactNode
}

export function Panel({
  title,
  icon: Icon,
  accent = 'cyan',
  meta,
  className,
  bodyClassName,
  children,
}: PanelProps) {
  const color = ACCENT_COLOR[accent]

  return (
    <section className={cn('cyber-panel', className)}>
      <header className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2.5 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center border"
            style={{ borderColor: `${color}66`, color, boxShadow: `inset 0 0 10px ${color}22` }}
          >
            {Icon ? <Icon size={13} aria-hidden="true" /> : null}
          </span>
          <h2 className="truncate font-display text-[10px] font-bold uppercase tracking-[0.26em] text-slate-300 sm:text-[11px]">
            {title}
          </h2>
        </div>
        {meta}
      </header>
      <div className={cn('p-3 sm:p-4', bodyClassName)}>{children}</div>
    </section>
  )
}
