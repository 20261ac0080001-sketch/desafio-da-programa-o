import { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Flame, Sparkles, Zap } from 'lucide-react';
import type { LevelInfo } from '../data/questions';

interface LevelUpScreenProps {
  completedLevel: LevelInfo;
  nextLevel: LevelInfo;
  score: number;
  streak: number;
  onContinue: () => void;
}

export function LevelUpScreen({
  completedLevel,
  nextLevel,
  score,
  streak,
  onContinue,
}: LevelUpScreenProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onContinue();
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onContinue]);

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -12 }}
      transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto w-full max-w-2xl"
    >
      <div className="neon-card relative overflow-hidden rounded-2xl border border-indigo-400/30 bg-[#0D1430]/95 p-7 text-center sm:p-10">
        {/* Brilho decorativo superior */}
        <div
          aria-hidden="true"
          className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${nextLevel.gradient} text-white shadow-lg shadow-indigo-950/60`}
        >
          <Sparkles className="h-10 w-10" />
        </div>

        <p className="text-sm font-semibold tracking-wide text-emerald-300">
          Nível {completedLevel.level} ({completedLevel.name}) Concluído!
        </p>

        <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-white [text-wrap:balance] sm:text-4xl">
          Você avançou para o Nível {nextLevel.level}:{' '}
          <span
            className={`bg-gradient-to-r ${nextLevel.gradient} bg-clip-text text-transparent`}
          >
            {nextLevel.name}
          </span>
        </h2>

        <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-slate-300">
          {nextLevel.description} Você terá{' '}
          <strong className="font-semibold text-white">
            {nextLevel.timeLimit} segundos
          </strong>{' '}
          por pergunta nesta etapa.
        </p>

        {/* Resumo do estado atual */}
        <div className="mt-8 grid grid-cols-2 gap-4 border-y border-indigo-300/15 py-5">
          <div>
            <div className="text-xs font-medium text-slate-400">
              Pontuação Atual
            </div>
            <div className="mt-1 font-display text-3xl font-bold text-white tabular-nums">
              {score} pts
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-slate-400">
              Sequência Ativa
            </div>
            <div className="mt-1 flex items-center justify-center gap-1.5 font-display text-3xl font-bold text-amber-300 tabular-nums">
              <Flame className="h-6 w-6 text-amber-400" aria-hidden="true" />
              <span>{streak}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={onContinue}
            className="neon-cta group inline-flex min-h-[56px] w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-8 py-4 text-base font-semibold text-white transition-all duration-150 hover:from-blue-500 hover:to-violet-500 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 sm:w-auto sm:text-lg"
          >
            <Zap className="h-5 w-5" aria-hidden="true" />
            <span>Continuar para Nível {nextLevel.level}</span>
            <ArrowRight
              className="h-5 w-5 transition-transform duration-150 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </button>

          <span className="text-xs text-slate-400">
            Pressione Enter para continuar rapidamente
          </span>
        </div>
      </div>
    </motion.section>
  );
}
