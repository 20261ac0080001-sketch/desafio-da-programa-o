import { motion } from 'motion/react';
import {
  ArrowRight,
  Award,
  Brain,
  Code2,
  Cpu,
  Flame,
  Layers,
  Timer,
  Trophy,
} from 'lucide-react';
import { LEVELS } from '../data/questions';

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
      className="mx-auto w-full max-w-5xl space-y-6"
    >
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        {/* Coluna principal: Apresentação, regras e CTA */}
        <div className="neon-card flex flex-col justify-between rounded-2xl border border-indigo-400/25 bg-[#0C132D]/95 p-6 sm:p-10 lg:col-span-7">
          <div>
            <p className="text-sm font-semibold tracking-wide text-cyan-300">
              Quiz Educativo · 5 Níveis Progressivos
            </p>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white [text-wrap:balance] sm:text-5xl sm:leading-[1.08]">
              Desafio da{' '}
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent">
                Programação
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Avance do nível Iniciante ao Mestre respondendo desafios de lógica
              de programação, JavaScript e pensamento computacional antes do
              tempo acabar.
            </p>

            {/* Regras e bônus */}
            <div className="mt-7 grid grid-cols-2 gap-4 border-y border-indigo-300/15 py-5 sm:grid-cols-4">
              <div>
                <div className="font-display text-2xl font-bold text-white tabular-nums sm:text-3xl">
                  10
                </div>
                <div className="mt-1 text-xs text-slate-400 sm:text-sm">
                  Perguntas (5 níveis)
                </div>
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-cyan-300 tabular-nums sm:text-3xl">
                  10 pts
                </div>
                <div className="mt-1 text-xs text-slate-400 sm:text-sm">
                  Por acerto base
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 font-display text-2xl font-bold text-amber-300 tabular-nums sm:text-3xl">
                  <Flame className="h-5 w-5 text-amber-400" aria-hidden="true" />
                  <span>+10</span>
                </div>
                <div className="mt-1 text-xs text-slate-400 sm:text-sm">
                  Bônus por sequência
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 font-display text-2xl font-bold text-violet-300 tabular-nums sm:text-3xl">
                  <Timer className="h-5 w-5 text-violet-400" aria-hidden="true" />
                  <span>25–30s</span>
                </div>
                <div className="mt-1 text-xs text-slate-400 sm:text-sm">
                  Por pergunta
                </div>
              </div>
            </div>

            {/* Trilha dos 5 níveis */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs font-medium text-slate-400">
                <span>Jornada de Dificuldade</span>
                <span>2 perguntas por nível</span>
              </div>
              <div className="mt-2.5 grid grid-cols-5 gap-2">
                {LEVELS.map((lvl) => (
                  <div
                    key={lvl.level}
                    className="rounded-lg bg-[#080D22] px-2 py-2.5 text-center"
                  >
                    <div
                      className={`mx-auto mb-1.5 h-1.5 w-full rounded-full bg-gradient-to-r ${lvl.gradient}`}
                    />
                    <div className="text-[11px] font-semibold text-white truncate sm:text-xs">
                      {lvl.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={onStart}
              className="neon-cta group inline-flex min-h-[58px] w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 px-8 py-4 text-base font-bold text-white transition-all duration-150 hover:from-cyan-400 hover:via-blue-500 hover:to-violet-500 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 sm:w-auto sm:text-lg"
            >
              <span>Começar Desafio</span>
              <ArrowRight
                className="h-5 w-5 transition-transform duration-150 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </button>

            {bestScore !== null && (
              <div className="flex items-center gap-2.5 text-sm text-slate-300">
                <Award
                  className="h-4 w-4 shrink-0 text-amber-400"
                  aria-hidden="true"
                />
                <span>
                  Recorde:{' '}
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

        {/* Coluna lateral: Áreas e mecânicas */}
        <div className="flex flex-col justify-between rounded-2xl border border-indigo-400/20 bg-[#0A1026]/95 p-6 sm:p-8 lg:col-span-5">
          <div>
            <h2 className="text-lg font-bold text-white">
              O que você vai dominar
            </h2>
            <p className="mt-1.5 text-sm text-slate-400">
              Cada rodada combina desafios práticos em três pilares essenciais.
            </p>

            <div className="mt-5 divide-y divide-indigo-300/12">
              <div className="flex items-start gap-4 py-4 first:pt-0">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                  <Layers className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Lógica de Programação
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">
                    Condicionais, operadores booleanos, laços e recursão.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 py-4">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300 shadow-[0_0_15px_rgba(167,139,250,0.2)]">
                  <Code2 className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    JavaScript na Prática
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">
                    Escopo, closures, arrays e métodos map, filter e reduce.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 py-4">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300 shadow-[0_0_15px_rgba(96,165,250,0.2)]">
                  <Brain className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Pensamento Computacional
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">
                    Decomposição, abstração, busca binária e complexidade Big O.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 py-4 last:pb-0">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-fuchsia-500/15 text-fuchsia-300 shadow-[0_0_15px_rgba(232,121,249,0.2)]">
                  <Trophy className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Combos e Vitória
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">
                    Acerte em sequência para ganhar bônus extras e chegue ao
                    nível Mestre para vencer com confetes!
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 border-t border-indigo-300/12 pt-4 text-xs text-slate-400 sm:text-sm">
            <Cpu
              className="h-4 w-4 shrink-0 text-cyan-300"
              aria-hidden="true"
            />
            <span>
              Atalhos: use as teclas{' '}
              <span className="font-mono text-slate-200">1–4</span> ou{' '}
              <span className="font-mono text-slate-200">A–D</span> para
              responder.
            </span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
