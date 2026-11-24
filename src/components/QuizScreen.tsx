import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Flame,
  XCircle,
} from 'lucide-react';
import { getLevelInfo, type QuizQuestion } from '../data/questions';
import { playTickWarningSound } from '../utils/sound';
import { CodeBlock } from './CodeBlock';

interface QuizScreenProps {
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  score: number;
  streak: number;
  lastPoints: { base: number; bonus: number } | null;
  selectedOption: number | null; // null = aguardando, -1 = tempo esgotado, 0..3 = alternativa
  muted: boolean;
  onSelectOption: (optionIndex: number) => void;
  onTimeout: () => void;
  onNext: () => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

export function QuizScreen({
  question,
  questionIndex,
  totalQuestions,
  score,
  streak,
  lastPoints,
  selectedOption,
  muted,
  onSelectOption,
  onTimeout,
  onNext,
}: QuizScreenProps) {
  const levelInfo = getLevelInfo(question.level);
  const [timeLeft, setTimeLeft] = useState<number>(levelInfo.timeLimit);

  const hasAnswered = selectedOption !== null;
  const timedOut = selectedOption === -1;
  const isCorrect =
    hasAnswered && !timedOut && selectedOption === question.correctIndex;
  const isLastQuestion = questionIndex === totalQuestions - 1;
  const progressPercent =
    ((questionIndex + (hasAnswered ? 1 : 0)) / totalQuestions) * 100;
  const timerPercent = Math.max(0, (timeLeft / levelInfo.timeLimit) * 100);

  // Reinicia cronômetro ao trocar de pergunta
  useEffect(() => {
    setTimeLeft(levelInfo.timeLimit);
  }, [question.id, levelInfo.timeLimit]);

  // Contagem regressiva
  useEffect(() => {
    if (hasAnswered) return;

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        const next = prev - 1;
        if (next <= 5 && next > 0) {
          playTickWarningSound(muted);
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [hasAnswered, question.id, muted]);

  // Dispara timeout quando o relógio chega a 0
  useEffect(() => {
    if (timeLeft === 0 && !hasAnswered) {
      onTimeout();
    }
  }, [timeLeft, hasAnswered, onTimeout]);

  // Atalhos de teclado: 1-4 / A-D para responder, Enter para avançar
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = event.key.toUpperCase();
      if (!hasAnswered) {
        const keyMap: Record<string, number> = {
          '1': 0,
          '2': 1,
          '3': 2,
          '4': 3,
          A: 0,
          B: 1,
          C: 2,
          D: 3,
        };
        if (key in keyMap) {
          event.preventDefault();
          onSelectOption(keyMap[key]);
        }
      } else if (event.key === 'Enter') {
        event.preventDefault();
        onNext();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasAnswered, onSelectOption, onNext]);

  const timerColor =
    timeLeft <= 5
      ? 'text-rose-400'
      : timeLeft <= 10
        ? 'text-amber-300'
        : 'text-cyan-300';

  const timerBarGradient =
    timeLeft <= 5
      ? 'from-rose-500 to-orange-500'
      : timeLeft <= 10
        ? 'from-amber-400 to-orange-400'
        : 'from-cyan-400 to-blue-500';

  return (
    <motion.section
      key={question.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto w-full max-w-3xl"
    >
      {/* HUD Superior: Nível, Pergunta, Categoria, Pontos, Sequência e Cronômetro */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1 text-sm">
        <div className="flex flex-wrap items-center gap-2 text-slate-300">
          <span className={`font-display font-bold ${levelInfo.textColor}`}>
            Nível {levelInfo.level}: {levelInfo.name}
          </span>
          <span aria-hidden="true" className="text-slate-600">
            ·
          </span>
          <span className="font-semibold text-white tabular-nums">
            {String(questionIndex + 1).padStart(2, '0')}/{totalQuestions}
          </span>
          <span aria-hidden="true" className="text-slate-600">
            ·
          </span>
          <span className="text-slate-300">{question.category}</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Sequência de acertos */}
          <div
            className="flex items-center gap-1.5 text-sm"
            title="Sequência atual de acertos"
          >
            <Flame
              className={`h-4 w-4 ${streak >= 2 ? 'text-amber-400' : 'text-slate-500'}`}
              aria-hidden="true"
            />
            <span
              className={`font-semibold tabular-nums ${
                streak >= 2 ? 'text-amber-300' : 'text-slate-400'
              }`}
            >
              {streak}x
            </span>
          </div>

          {/* Pontuação */}
          <div className="flex items-center gap-1.5 text-slate-300">
            <span>Pontos:</span>
            <span className="font-display text-lg font-bold text-white tabular-nums">
              {score}
            </span>
          </div>

          {/* Cronômetro */}
          <div
            className={`flex items-center gap-1.5 font-mono text-sm font-bold tabular-nums ${timerColor}`}
            aria-label={`Tempo restante: ${timeLeft} segundos`}
          >
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span>{String(timeLeft).padStart(2, '0')}s</span>
          </div>
        </div>
      </div>

      {/* Barra de progresso geral + barra de tempo */}
      <div className="mb-5 space-y-1.5">
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-[#121938]"
          role="progressbar"
          aria-valuenow={questionIndex + (hasAnswered ? 1 : 0)}
          aria-valuemin={0}
          aria-valuemax={totalQuestions}
          aria-label="Progresso geral do desafio"
        >
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${levelInfo.gradient} shadow-[0_0_12px_rgba(56,189,248,0.5)]`}
            initial={false}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        <div
          className="h-1 w-full overflow-hidden rounded-full bg-[#0D132B]"
          aria-hidden="true"
        >
          <div
            className={`h-full rounded-full bg-gradient-to-r ${timerBarGradient} transition-all duration-500 ease-linear`}
            style={{ width: `${timerPercent}%` }}
          />
        </div>
      </div>

      {/* Superfície da pergunta */}
      <div className="neon-card rounded-2xl border border-indigo-400/25 bg-[#0C132D]/95 p-5 sm:p-8">
        <h2 className="text-xl font-semibold leading-snug text-white [text-wrap:balance] sm:text-2xl">
          {question.question}
        </h2>

        {question.code && <CodeBlock code={question.code} />}

        {/* 4 alternativas grandes e responsivas */}
        <div
          className="mt-6 grid grid-cols-1 gap-3.5"
          role="radiogroup"
          aria-label="Alternativas da pergunta"
        >
          {question.options.map((optionText, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectOption = idx === question.correctIndex;

            let buttonStyle =
              'border-indigo-300/20 bg-[#131C42]/85 text-slate-100 hover:border-cyan-400/65 hover:bg-[#192556] hover:shadow-[0_0_20px_-6px_rgba(56,189,248,0.45)]';
            let keycapStyle =
              'border-indigo-300/25 bg-[#090F26] text-cyan-300 group-hover:border-cyan-400/60';

            if (hasAnswered) {
              if (isCorrectOption) {
                buttonStyle =
                  'border-emerald-400/80 bg-emerald-500/15 text-white shadow-[0_0_22px_-6px_rgba(16,185,129,0.5)]';
                keycapStyle =
                  'border-emerald-400 bg-emerald-500 text-slate-950 font-bold';
              } else if (isSelected && !isCorrectOption) {
                buttonStyle =
                  'border-rose-400/80 bg-rose-500/15 text-white shadow-[0_0_20px_-6px_rgba(244,63,94,0.45)]';
                keycapStyle =
                  'border-rose-400 bg-rose-500 text-white font-bold';
              } else {
                buttonStyle =
                  'border-indigo-300/10 bg-[#0A1026]/65 text-slate-400 opacity-60';
                keycapStyle =
                  'border-indigo-300/10 bg-[#070B1A] text-slate-500';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={hasAnswered}
                onClick={() => onSelectOption(idx)}
                aria-pressed={isSelected}
                className={`group flex min-h-[64px] w-full items-center justify-between gap-4 rounded-xl border px-4 py-3.5 text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 sm:px-5 sm:py-4 ${
                  !hasAnswered
                    ? 'cursor-pointer active:scale-[0.99]'
                    : 'cursor-default'
                } ${buttonStyle}`}
              >
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border font-mono text-sm font-semibold transition-colors ${keycapStyle}`}
                  >
                    {OPTION_LETTERS[idx]}
                  </span>
                  <span className="text-base font-medium leading-snug sm:text-[17px]">
                    {optionText}
                  </span>
                </div>

                {hasAnswered && isCorrectOption && (
                  <CheckCircle2
                    className="h-6 w-6 shrink-0 text-emerald-400"
                    aria-label="Alternativa correta"
                  />
                )}
                {hasAnswered && isSelected && !isCorrectOption && (
                  <XCircle
                    className="h-6 w-6 shrink-0 text-rose-400"
                    aria-label="Alternativa incorreta"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback imediato + explicação + bônus */}
        <AnimatePresence mode="wait">
          {hasAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 border-t border-indigo-300/15 pt-6"
              aria-live="polite"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {isCorrect ? (
                      <>
                        <CheckCircle2
                          className="h-5 w-5 shrink-0 text-emerald-400"
                          aria-hidden="true"
                        />
                        <span className="font-display text-base font-bold text-emerald-300 sm:text-lg">
                          Resposta Correta · +{lastPoints?.base ?? 10} pts
                        </span>
                        {lastPoints && lastPoints.bonus > 0 && (
                          <span className="font-display text-sm font-bold text-amber-300 sm:text-base">
                            · +{lastPoints.bonus} bônus ({streak}x sequência)
                          </span>
                        )}
                      </>
                    ) : timedOut ? (
                      <>
                        <Clock
                          className="h-5 w-5 shrink-0 text-rose-400"
                          aria-hidden="true"
                        />
                        <span className="font-display text-base font-bold text-rose-300 sm:text-lg">
                          Tempo Esgotado · +0 pontos
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle
                          className="h-5 w-5 shrink-0 text-rose-400"
                          aria-hidden="true"
                        />
                        <span className="font-display text-base font-bold text-rose-300 sm:text-lg">
                          Resposta Incorreta · +0 pontos
                        </span>
                      </>
                    )}
                  </div>

                  <p className="text-sm leading-relaxed text-slate-300 sm:text-[15px]">
                    {question.explanation}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onNext}
                  className="neon-cta inline-flex min-h-[54px] shrink-0 cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 px-7 py-3.5 text-base font-bold text-white transition-all duration-150 hover:from-cyan-400 hover:via-blue-500 hover:to-violet-500 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 whitespace-nowrap"
                >
                  <span>
                    {isLastQuestion
                      ? 'Ver Resultado Final'
                      : 'Próxima Pergunta'}
                  </span>
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
