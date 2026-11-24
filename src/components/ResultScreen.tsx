import { useState } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Trophy,
  XCircle,
} from 'lucide-react';
import type { QuestionCategory, QuizQuestion } from '../data/questions';

export interface AnswerRecord {
  question: QuizQuestion;
  selectedIndex: number;
  isCorrect: boolean;
}

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  records: AnswerRecord[];
  bestScore: number | null;
  onPlayAgain: () => void;
}

function getPerformanceFeedback(score: number, maxScore: number) {
  const ratio = score / maxScore;
  if (ratio === 1) {
    return {
      title: 'Pontuação Máxima!',
      subtitle:
        'Domínio completo de lógica, JavaScript e pensamento computacional.',
      accent: 'from-emerald-400 to-sky-400',
    };
  }
  if (ratio >= 0.8) {
    return {
      title: 'Excelente Desempenho!',
      subtitle:
        'Você demonstrou raciocínio sólido e ótimo domínio dos fundamentos.',
      accent: 'from-sky-400 to-violet-400',
    };
  }
  if (ratio >= 0.5) {
    return {
      title: 'Bom Progresso!',
      subtitle:
        'Você já domina vários conceitos. Vale revisar as questões abaixo para chegar aos 100 pontos.',
      accent: 'from-blue-400 to-violet-400',
    };
  }
  return {
    title: 'Continue Praticando!',
    subtitle:
      'Cada erro é uma chance de aprender. Veja as explicações abaixo e tente uma nova rodada.',
    accent: 'from-violet-400 to-rose-400',
  };
}

export function ResultScreen({
  score,
  totalQuestions,
  records,
  bestScore,
  onPlayAgain,
}: ResultScreenProps) {
  const [showReview, setShowReview] = useState(false);

  const maxScore = totalQuestions * 10;
  const correctCount = records.filter((r) => r.isCorrect).length;
  const wrongCount = totalQuestions - correctCount;
  const accuracy = Math.round((correctCount / totalQuestions) * 100);
  const feedback = getPerformanceFeedback(score, maxScore);

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

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto w-full max-w-4xl space-y-6"
    >
      {/* Card principal de resultado */}
      <div className="rounded-2xl border border-indigo-400/20 bg-[#101733]/95 p-6 sm:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2.5 text-sm font-medium text-sky-300">
              <Trophy className="h-4 w-4 text-amber-400" aria-hidden="true" />
              <span>Desafio Concluído</span>
              {bestScore !== null && score >= bestScore && score > 0 && (
                <>
                  <span aria-hidden="true" className="text-slate-500">
                    ·
                  </span>
                  <span className="text-amber-300">Novo Recorde Pessoal</span>
                </>
              )}
            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white [text-wrap:balance] sm:text-4xl">
              {feedback.title}
            </h1>
            <p className="mt-2 max-w-xl text-base leading-relaxed text-slate-300">
              {feedback.subtitle}
            </p>
          </div>

          {/* Placar final em destaque */}
          <div className="shrink-0 rounded-xl border border-indigo-300/20 bg-[#0A0F24] px-7 py-5 text-center">
            <div className="text-xs font-medium text-slate-400">
              Pontuação Final
            </div>
            <div
              className={`mt-1 bg-gradient-to-r ${feedback.accent} bg-clip-text font-display text-5xl font-extrabold text-transparent tabular-nums`}
            >
              {score}
            </div>
            <div className="mt-1 text-sm text-slate-400 tabular-nums">
              de {maxScore} pontos
            </div>
          </div>
        </div>

        {/* Métricas objetivas */}
        <div className="mt-8 grid grid-cols-3 gap-4 border-y border-indigo-300/15 py-5">
          <div>
            <div className="font-display text-2xl font-bold text-emerald-400 tabular-nums sm:text-3xl">
              {correctCount}
            </div>
            <div className="mt-1 text-xs text-slate-400 sm:text-sm">
              {correctCount === 1 ? 'Acerto' : 'Acertos'}
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
            <div className="font-display text-2xl font-bold text-sky-300 tabular-nums sm:text-3xl">
              {accuracy}%
            </div>
            <div className="mt-1 text-xs text-slate-400 sm:text-sm">
              Aproveitamento
            </div>
          </div>
        </div>

        {/* Desempenho por categoria */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-slate-300">
            Desempenho por Área
          </h2>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {categoryStats.map((stat) => {
              const pct = Math.round((stat.correct / stat.total) * 100);
              return (
                <div
                  key={stat.category}
                  className="rounded-xl bg-[#0B1026]/80 p-4"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-medium text-slate-200">
                      {stat.category}
                    </span>
                    <span className="font-mono text-sm font-semibold text-sky-300 tabular-nums">
                      {stat.correct}/{stat.total}
                    </span>
                  </div>
                  <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-300"
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
            className="inline-flex min-h-[56px] w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-950/50 transition-all duration-150 hover:from-blue-500 hover:to-violet-500 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 sm:w-auto sm:text-lg"
          >
            <RotateCcw className="h-5 w-5" aria-hidden="true" />
            <span>Jogar Novamente</span>
          </button>

          <button
            type="button"
            onClick={() => setShowReview((prev) => !prev)}
            aria-expanded={showReview}
            className="inline-flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-indigo-300/25 bg-[#151E42]/70 px-6 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-indigo-300/45 hover:bg-[#1B2654] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 sm:w-auto sm:text-base"
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

      {/* Revisão educativa das 10 perguntas */}
      {showReview && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-indigo-400/20 bg-[#101733]/90 p-6 sm:p-8"
        >
          <h2 className="text-xl font-bold text-white">
            Gabarito Comentado
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Confira todas as perguntas desta rodada e suas respectivas
            explicações.
          </p>

          <div className="mt-6 divide-y divide-indigo-300/15">
            {records.map((rec, idx) => (
              <div key={rec.question.id} className="py-5 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="text-xs font-medium text-slate-400">
                    <span>Pergunta {String(idx + 1).padStart(2, '0')}</span>
                    <span aria-hidden="true"> · </span>
                    <span className="text-sky-300">{rec.question.category}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5 text-xs font-semibold">
                    {rec.isCorrect ? (
                      <>
                        <CheckCircle2
                          className="h-4 w-4 text-emerald-400"
                          aria-hidden="true"
                        />
                        <span className="text-emerald-300">Correta (+10)</span>
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
                  {!rec.isCorrect && (
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
            ))}
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}
