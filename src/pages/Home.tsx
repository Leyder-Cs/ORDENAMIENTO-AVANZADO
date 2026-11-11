import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  Clock3,
  Cpu,
  GitBranch,
  Layers,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { CyberBackdrop } from '../components/CyberBackdrop'
import { ALGORITHMS } from '../core/registry'

export function Home() {
  const readyCount = ALGORITHMS.filter((algorithm) => algorithm.status === 'ready').length

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <CyberBackdrop />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
            <div
              className="relative flex h-12 w-12 shrink-0 items-center justify-center border border-neonPink/60 bg-black/45"
              style={{ boxShadow: '0 0 24px -8px rgba(255, 43, 214, 0.9), inset 0 0 16px rgba(255, 43, 214, 0.12)' }}
              aria-hidden="true"
            >
              <Cpu size={24} className="text-neonPink" />
              <span className="absolute -right-1 -top-1 h-2 w-2 bg-neonCyan shadow-[0_0_10px_#00f0ff]" />
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.34em] text-neonCyan/70">
                // laboratorio de algoritmos
              </p>
              <h1
                className="glitch font-display text-3xl font-black uppercase leading-none tracking-[0.08em] text-white sm:text-5xl"
                data-text="ORDENAMIENTO AVANZADO"
              >
                ORDENAMIENTO AVANZADO
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 border border-neonGreen/40 bg-black/40 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-neonGreen">
              <CheckCircle2 size={11} aria-hidden="true" />
              {readyCount} listo{readyCount === 1 ? '' : 's'}
            </span>
            <span className="flex items-center gap-1.5 border border-neonYellow/40 bg-black/40 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-neonYellow">
              <Clock3 size={11} aria-hidden="true" />
              {ALGORITHMS.length - readyCount} en construcción
            </span>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ALGORITHMS.map((algorithm) => {
            const isReady = algorithm.status === 'ready'
            return (
              <Link
                key={algorithm.id}
                to={`/visualizador/${algorithm.id}`}
                className="algo-card group flex flex-col gap-4 border border-white/10 bg-black/40 p-4 transition-all hover:border-white/30"
                style={{ boxShadow: `inset 0 -3px 0 ${algorithm.accent}` }}
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className="flex h-8 w-8 items-center justify-center border"
                    style={{
                      borderColor: `${algorithm.accent}77`,
                      color: algorithm.accent,
                      boxShadow: `inset 0 0 12px ${algorithm.accent}22`,
                    }}
                    aria-hidden="true"
                  >
                    {isReady ? <GitBranch size={15} /> : <Boxes size={15} />}
                  </span>
                  <span
                    className="border px-1.5 py-0.5 font-display text-[7px] font-bold tracking-[0.18em]"
                    style={{
                      borderColor: isReady ? '#39ff1466' : '#f9f00266',
                      color: isReady ? '#39ff14' : '#f9f002',
                    }}
                  >
                    {isReady ? 'LISTO' : 'EN CONSTRUCCIÓN'}
                  </span>
                </div>

                <div>
                  <h2 className="font-display text-lg font-bold tracking-[0.12em] text-white">
                    {algorithm.name}
                  </h2>
                  <p className="mt-1 font-mono text-[11px] leading-relaxed text-slate-500">
                    {algorithm.description}
                  </p>
                </div>

                <dl className="grid grid-cols-2 gap-1 border-t border-white/10 pt-3 font-mono text-[9px]">
                  <div className="flex items-center gap-1 text-slate-500">
                    <Layers size={10} aria-hidden="true" />
                    <dt>Promedio</dt>
                    <dd className="text-slate-300">{algorithm.complexity.average}</dd>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <Boxes size={10} aria-hidden="true" />
                    <dt>Espacio</dt>
                    <dd className="text-slate-300">{algorithm.complexity.space}</dd>
                  </div>
                </dl>

                <span
                  className="mt-auto flex items-center justify-between border border-white/10 px-2.5 py-1.5 font-display text-[9px] font-bold uppercase tracking-[0.18em] text-slate-300 transition-colors group-hover:border-neonCyan/50 group-hover:text-neonCyan"
                >
                  Abrir visualizador
                  <ArrowRight size={12} aria-hidden="true" />
                </span>
              </Link>
            )
          })}
        </section>

        <section className="grid gap-3 border border-white/10 bg-black/30 p-4 sm:grid-cols-3">
          <div>
            <p className="font-display text-[9px] font-bold uppercase tracking-[0.2em] text-neonCyan">
              Pasos pre-calculados
            </p>
            <p className="mt-1 font-mono text-[10px] leading-relaxed text-slate-500">
              Avanza, retrocede y pausa sin perder el estado.
            </p>
          </div>
          <div>
            <p className="font-display text-[9px] font-bold uppercase tracking-[0.2em] text-neonPink">
              Código sincronizado
            </p>
            <p className="mt-1 font-mono text-[10px] leading-relaxed text-slate-500">
              La línea activa acompaña cada comparación e intercambio.
            </p>
          </div>
          <div>
            <p className="font-display text-[9px] font-bold uppercase tracking-[0.2em] text-neonGreen">
              Contrato abierto
            </p>
            <p className="mt-1 font-mono text-[10px] leading-relaxed text-slate-500">
              Cada compañero implementa su algoritmo en su propia carpeta.
            </p>
          </div>
        </section>

        <footer className="mt-auto pb-2 text-center font-mono text-[9px] uppercase tracking-[0.22em] text-slate-700">
          // un algoritmo por carpeta · sin atajos mágicos
        </footer>
      </div>
    </div>
  )
}
