import { motion } from 'motion/react';
import {
  ArrowRight,
  Award,
  Brain,
  Code2,
  Cpu,
  Layers,
} from 'lucide-react';

interface StartScreenProps {
  bestScore: number | null;
  gamesPlayed: number;
  onStart: () => void;
}

export function StartScreen({
  bestScore,
  gamesPlayed,
  onStart,
}: StartScreenProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto w-full max-w-5xl"
    >
      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
        {/* Coluna principal: Apresentação e CTA */}
        <div className="flex flex-col justify-between rounded-2xl border border-indigo-400/20 bg-[#101733]/90 p-6 sm:p-10 lg:col-span-7">
          <div>
            <p className="text-sm font-medium tracking-wide text-sky-300">
              Quiz Educativo · 100% no Navegador
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white [text-wrap:balance] sm:text-5xl sm:leading-[1.1]">
              Desafio da{' '}
              <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                Programação
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Teste e aprimore seu raciocínio em lógica de programação,
              JavaScript e pensamento computacional com desafios práticos e
              explicações imediatas a cada resposta.
            </p>

            {/* Regras objetivas sem badges/pills */}
            <div className="mt-8 grid grid-cols-3 gap-4 border-y border-indigo-300/15 py-5">
              <div>
                <div className="font-display text-2xl font-bold text-white tabular-nums sm:text-3xl">
                  10
                </div>
                <div className="mt-1 text-xs text-slate-400 sm:text-sm">
                  Perguntas variadas
                </div>
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-sky-300 tabular-nums sm:text-3xl">
                  4
                </div>
                <div className="mt-1 text-xs text-slate-400 sm:text-sm">
                  Alternativas cada
                </div>
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-violet-300 tabular-nums sm:text-3xl">
                  10 pts
                </div>
                <div className="mt-1 text-xs text-slate-400 sm:text-sm">
                  Por resposta certa
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={onStart}
              className="group inline-flex min-h-[56px] w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-950/50 transition-all duration-150 hover:from-blue-500 hover:to-violet-500 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 sm:w-auto sm:text-lg"
            >
              <span>Começar Desafio</span>
              <ArrowRight
                className="h-5 w-5 transition-transform duration-150 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </button>

            {bestScore !== null && (
              <div className="flex items-center gap-2.5 text-sm text-slate-300">
                <Award className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                <span>
                  Melhor marca:{' '}
                  <strong className="font-semibold text-white tabular-nums">
                    {bestScore} pts
                  </strong>
                  {gamesPlayed > 0 && (
                    <span className="text-slate-400">
                      {' '}
                      · {gamesPlayed} {gamesPlayed === 1 ? 'partida' : 'partidas'}
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Coluna lateral: Três áreas do conhecimento */}
        <div className="flex flex-col justify-between rounded-2xl border border-indigo-400/20 bg-[#0D132B]/90 p-6 sm:p-8 lg:col-span-5">
          <div>
            <h2 className="text-lg font-semibold text-white">
              O que você vai praticar
            </h2>
            <p className="mt-1.5 text-sm text-slate-400">
              Cada partida sorteia 10 questões equilibradas entre os três temas
              abaixo.
            </p>

            <div className="mt-6 divide-y divide-indigo-300/12">
              <div className="flex items-start gap-4 py-4 first:pt-0">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-blue-300">
                  <Layers className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Lógica de Programação
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">
                    Condicionais, operadores lógicos, laços de repetição e
                    manipulação de variáveis.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 py-4">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
                  <Code2 className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    JavaScript na Prática
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">
                    Comparação estrita, escopo com const, arrays, índices e
                    métodos como map e filter.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 py-4 last:pb-0">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 text-sky-300">
                  <Brain className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Pensamento Computacional
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">
                    Decomposição, abstração, reconhecimento de padrões, busca
                    binária e depuração.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 border-t border-indigo-300/12 pt-5 text-xs text-slate-400 sm:text-sm">
            <Cpu className="h-4 w-4 shrink-0 text-violet-300" aria-hidden="true" />
            <span>
              Dica: no computador você pode responder usando as teclas{' '}
              <span className="font-mono text-slate-200">1–4</span> ou{' '}
              <span className="font-mono text-slate-200">A–D</span>.
            </span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
