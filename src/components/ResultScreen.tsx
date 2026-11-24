import { useState } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Flame,
  RotateCcw,
  Trophy,
  XCircle,
} from 'lucide-react';
import {
  LEVELS,
  type QuestionCategory,
  type QuizQuestion,
} from '../data/questions';
import { ConfettiCanvas } from './ConfettiCanvas';

export interface AnswerRecord {
  question: QuizQuestion;
  selectedIndex: number; // -1 se tempo esgotado
  isCorrect: boolean;
  pointsEarned: number;
}

interface ResultScreenProps {
  score: number;
  baseScore: number;
  bonusScore: number;
  maxStreak: number;
  totalQuestions: number;
  records: AnswerRecord[];
  bestScore: number | null;
  onPlayAgain: () => void;
}

function getPerformanceFeedback(correctCount: number, totalQuestions: number) {
  const ratio = correctCount / totalQuestions;
  if (ratio === 1) {
    return {
      title: 'Mestre Absoluto!',
      subtitle:
        'Você gabaritou todos os 5 níveis com domínio total de lógica, JavaScript e pensamento computacional.',
      accent: 'from-emerald-300 via-cyan-300 to-violet-300',
      won: true,
    };
  }
  if (ratio >= 0.7) {
    return {
      title: 'Vitória Brilhante!',
      subtitle:
        'Excelente desempenho! Você superou os níveis avançados com ótimo raciocínio e agilidade.',
      accent: 'from-cyan-300 via-blue-400 to-fuchsia-400',
      won: true,
    };
  }
  if (ratio >= 0.5) {
    return {
      title: 'Desafio Vencido!',
      subtitle:
        'Bom resultado! Você garantiu mais da metade dos acertos e pode revisar o gabarito para subir ainda mais.',
      accent: 'from-blue-300 to-violet-400',
      won: true,
    };
  }
  return {
    title: 'Continue Evoluindo!',
    subtitle:
      'Os níveis mais altos exigem prática. Revise as explicações abaixo e tente novamente para vencer o desafio.',
    accent: 'from-violet-300 to-rose-400',
    won: false,
  };
}

export function ResultScreen({
  score,
  baseScore,
  bonusScore,
  maxStreak,
  totalQuestions,
  records,
  bestScore,
  onPlayAgain,
}: ResultScreenProps) {
  const [showReview, setShowReview] = useState(false);

  const correctCount = records.filter((r) => r.isCorrect).length;
  const wrongCount = totalQuestions - correctCount;
  const accuracy = Math.round((correctCount / totalQuestions) * 100);
  const feedback = getPerformanceFeedback(correctCount, totalQuestions);

  const categories: QuestionCategory[] = [
    'Lógica de Programação',
    'JavaScript',
    'Pensamento Computacional',
  ];

  const categoryStats = categories
    .map((cat) => {
      const catRecords = records.filter((r) => r.question.category === cat);
      const catCorrect = catRecords.filter((r) => r.isCorrect).length;
      return {
        category: cat,
        total: catRecords.length,
        correct: catCorrect,
      };
    })
    .filter((item) => item.total > 0);

  const levelStats = LEVELS.map((lvl) => {
    const lvlRecords = records.filter((r) => r.question.level === lvl.level);
    const lvlCorrect = lvlRecords.filter((r) => r.isCorrect).length;
    return {
      ...lvl,
      total: lvlRecords.length,
      correct: lvlCorrect,
    };
  }).filter((item) => item.total > 0);

  return (
    <>
      <ConfettiCanvas active={feedback.won} />

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto w-full max-w-4xl space-y-6"
      >
        {/* Card principal de resultado */}
        <div className="neon-card rounded-2xl border border-indigo-400/25 bg-[#0C132D]/95 p-6 sm:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-cyan-300">
                <Trophy className="h-4 w-4 text-amber-400" aria-hidden="true" />
                <span>Desafio Concluído</span>
                {bestScore !== null && score >= bestScore && score > 0 && (
                  <>
                    <span aria-hidden="true" className="text-slate-600">
                      ·
                    </span>
                    <span className="text-amber-300">Novo Recorde Pessoal</span>
                  </>
                )}
              </div>

              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white [text-wrap:balance] sm:text-4xl">
                {feedback.title}
              </h1>
              <p className="mt-2 max-w-xl text-base leading-relaxed text-slate-300">
                {feedback.subtitle}
              </p>
            </div>

            {/* Placar final */}
            <div className="shrink-0 rounded-2xl border border-indigo-300/25 bg-[#070B1E] px-7 py-5 text-center shadow-[0_0_28px_-8px_rgba(99,102,241,0.4)]">
              <div className="text-xs font-medium text-slate-400">
                Pontuação Final
              </div>
              <div
                className={`mt-1 bg-gradient-to-r ${feedback.accent} bg-clip-text font-display text-5xl font-extrabold text-transparent tabular-nums`}
              >
                {score}
              </div>
              <div className="mt-1.5 text-xs text-slate-400 tabular-nums">
                {baseScore} base + {bonusScore} bônus
              </div>
            </div>
          </div>

          {/* Métricas objetivas */}
          <div className="mt-8 grid grid-cols-2 gap-4 border-y border-indigo-300/15 py-5 sm:grid-cols-4">
            <div>
              <div className="font-display text-2xl font-bold text-emerald-400 tabular-nums sm:text-3xl">
                {correctCount}/{totalQuestions}
              </div>
              <div className="mt-1 text-xs text-slate-400 sm:text-sm">
                Acertos
              </div>
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-rose-400 tabular-nums sm:text-3xl">
                {wrongCount}
              </div>
              <div className="mt-1 text-xs text-slate-400 sm:text-sm">
                {wrongCount === 1 ? 'Erro' : 'Erros'}
              </div>
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-cyan-300 tabular-nums sm:text-3xl">
                {accuracy}%
              </div>
              <div className="mt-1 text-xs text-slate-400 sm:text-sm">
                Desempenho
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-display text-2xl font-bold text-amber-300 tabular-nums sm:text-3xl">
                <Flame className="h-5 w-5 text-amber-400" aria-hidden="true" />
                <span>{maxStreak}x</span>
              </div>
              <div className="mt-1 text-xs text-slate-400 sm:text-sm">
                Maior Sequência
              </div>
            </div>
          </div>

          {/* Desempenho por Nível */}
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-slate-300">
              Desempenho por Nível
            </h2>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {levelStats.map((lvl) => (
                <div
                  key={lvl.level}
                  className="rounded-xl bg-[#080D22] p-3.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-semibold ${lvl.textColor}`}>
                      {lvl.name}
                    </span>
                    <span className="font-mono font-bold text-white tabular-nums">
                      {lvl.correct}/{lvl.total}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${lvl.gradient}`}
                      style={{
                        width: `${Math.round((lvl.correct / lvl.total) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desempenho por Área */}
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-slate-300">
              Desempenho por Área
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {categoryStats.map((stat) => {
                const pct = Math.round((stat.correct / stat.total) * 100);
                return (
                  <div
                    key={stat.category}
                    className="rounded-xl bg-[#080D22] p-4"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-medium text-slate-200">
                        {stat.category}
                      </span>
                      <span className="font-mono text-sm font-semibold text-cyan-300 tabular-nums">
                        {stat.correct}/{stat.total}
                      </span>
                    </div>
                    <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Botões de ação */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={onPlayAgain}
              className="neon-cta inline-flex min-h-[56px] w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 px-8 py-4 text-base font-bold text-white transition-all duration-150 hover:from-cyan-400 hover:via-blue-500 hover:to-violet-500 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 sm:w-auto sm:text-lg"
            >
              <RotateCcw className="h-5 w-5" aria-hidden="true" />
              <span>Jogar Novamente</span>
            </button>

            <button
              type="button"
              onClick={() => setShowReview((prev) => !prev)}
              aria-expanded={showReview}
              className="inline-flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-indigo-300/25 bg-[#131C42]/75 px-6 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-cyan-400/50 hover:bg-[#192556] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 sm:w-auto sm:text-base"
            >
              <span>
                {showReview ? 'Ocultar Gabarito' : 'Revisar Respostas'}
              </span>
              {showReview ? (
                <ChevronUp className="h-4 w-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Gabarito comentado */}
        {showReview && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-indigo-400/20 bg-[#0C132D]/95 p-6 sm:p-8"
          >
            <h2 className="text-xl font-bold text-white">
              Gabarito Comentado
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Confira todas as questões da partida, sua pontuação em cada uma e
              as explicações.
            </p>

            <div className="mt-6 divide-y divide-indigo-300/15">
              {records.map((rec, idx) => {
                const lvl = LEVELS.find((l) => l.level === rec.question.level);
                return (
                  <div
                    key={rec.question.id}
                    className="py-5 first:pt-0 last:pb-0"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="text-xs font-medium text-slate-400">
                        <span>Pergunta {String(idx + 1).padStart(2, '0')}</span>
                        <span aria-hidden="true"> · </span>
                        <span className={lvl?.textColor ?? 'text-cyan-300'}>
                          Nível {rec.question.level} ({lvl?.name})
                        </span>
                        <span aria-hidden="true"> · </span>
                        <span className="text-slate-300">
                          {rec.question.category}
                        </span>
                      </div>

                      <div className="flex shrink-0 items-center gap-1.5 text-xs font-semibold">
                        {rec.isCorrect ? (
                          <>
                            <CheckCircle2
                              className="h-4 w-4 text-emerald-400"
                              aria-hidden="true"
                            />
                            <span className="text-emerald-300">
                              Correta (+{rec.pointsEarned} pts)
                            </span>
                          </>
                        ) : rec.selectedIndex === -1 ? (
                          <>
                            <Clock
                              className="h-4 w-4 text-rose-400"
                              aria-hidden="true"
                            />
                            <span className="text-rose-300">
                              Tempo esgotado (0)
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle
                              className="h-4 w-4 text-rose-400"
                              aria-hidden="true"
                            />
                            <span className="text-rose-300">Incorreta (0)</span>
                          </>
                        )}
                      </div>
                    </div>

                    <p className="mt-2 text-base font-medium text-white">
                      {rec.question.question}
                    </p>

                    <div className="mt-2.5 space-y-1 text-sm">
                      {!rec.isCorrect && rec.selectedIndex >= 0 && (
                        <p className="text-rose-300">
                          Sua resposta:{' '}
                          <span className="font-medium">
                            {rec.question.options[rec.selectedIndex]}
                          </span>
                        </p>
                      )}
                      <p className="text-emerald-300">
                        Resposta correta:{' '}
                        <span className="font-medium">
                          {rec.question.options[rec.question.correctIndex]}
                        </span>
                      </p>
                    </div>

                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {rec.question.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </motion.section>
    </>
  );
}
