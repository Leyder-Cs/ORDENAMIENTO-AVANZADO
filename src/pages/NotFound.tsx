import { AlertTriangle, ArrowLeft, FileCode2, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CyberBackdrop } from '../components/CyberBackdrop'

export function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-x-hidden px-4">
      <CyberBackdrop />

      <div className="cyber-panel relative z-10 w-full max-w-xl p-6 text-center sm:p-10">
        <AlertTriangle size={36} className="mx-auto text-neonYellow" aria-hidden="true" />
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-neonYellow">
          // señal perdida
        </p>
        <h1
          className="glitch mt-2 font-display text-4xl font-black uppercase tracking-[0.08em] text-white sm:text-6xl"
          data-text="404"
        >
          404
        </h1>
        <p className="mt-3 font-mono text-xs leading-relaxed text-slate-400">
          La ruta no existe o el algoritmo solicitado no está registrado.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link to="/" className="ctrl-btn ctrl-btn-primary">
            <ArrowLeft size={13} aria-hidden="true" />
            Volver al catálogo
          </Link>
          <span className="ctrl-btn cursor-default">
            <FileCode2 size={13} aria-hidden="true" />
            src/algorithms
          </span>
          <span className="ctrl-btn cursor-default">
            <BookOpen size={13} aria-hidden="true" />
            docs/GUIA_COMPANEROS.md
          </span>
        </div>
      </div>
    </div>
  )
}
