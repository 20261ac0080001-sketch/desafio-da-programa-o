import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import type { QuizQuestion } from '../data/questions';
import { CodeBlock } from './CodeBlock';

interface QuizScreenProps {
  question: QuizQuestion;
  questionIndex: number;
  totalQuestions: number;
  score: number;
  selectedOption: number | null;
  onSelectOption: (optionIndex: number) => void;
  onNext: () => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

export function QuizScreen({
  question,
  questionIndex,
  totalQuestions,
  score,
  selectedOption,
  onSelectOption,
  onNext,
}: QuizScreenProps) {
  const hasAnswered = selectedOption !== null;
  const isCorrect = hasAnswered && selectedOption === question.correctIndex;
  const isLastQuestion = questionIndex === totalQuestions - 1;
  const progressPercent = ((questionIndex + (hasAnswered ? 1 : 0)) / totalQuestions) * 100;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
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

  return (
    <motion.section
      key={question.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto w-full max-w-3xl"
    >
      {/* HUD do jogo: progresso e pontuação visíveis sem poluição */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 px-1 text-sm">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="font-semibold text-white tabular-nums">
            Pergunta {String(questionIndex + 1).padStart(2, '0')} de{' '}
            {totalQuestions}
          </span>
          <span aria-hidden="true" className="text-slate-500">
            ·
          </span>
          <span className="text-sky-300">{question.category}</span>
        </div>

        <div className="flex items-center gap-2 text-slate-300">
          <span>Pontuação:</span>
          <span className="font-display text-lg font-bold text-white tabular-nums">
            {score}
          </span>
          <span className="text-slate-400 tabular-nums">
            / {totalQuestions * 10} pts
          </span>
        </div>
      </div>

      {/* Barra de progresso suave */}
      <div
        className="mb-6 h-2 w-full overflow-hidden rounded-full bg-[#131B3A]"
        role="progressbar"
        aria-valuenow={questionIndex + (hasAnswered ? 1 : 0)}
        aria-valuemin={0}
        aria-valuemax={totalQuestions}
        aria-label="Progresso do quiz"
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500"
          initial={false}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      {/* Superfície principal da pergunta */}
      <div className="rounded-2xl border border-indigo-400/20 bg-[#101733]/95 p-5 sm:p-8">
        <h2 className="text-xl font-semibold leading-snug text-white [text-wrap:balance] sm:text-2xl">
          {question.question}
        </h2>

        {question.code && <CodeBlock code={question.code} />}

        {/* 4 alternativas grandes e fáceis de clicar */}
        <div
          className="mt-6 grid grid-cols-1 gap-3.5"
          role="radiogroup"
          aria-label="Alternativas da pergunta"
        >
          {question.options.map((optionText, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectOption = idx === question.correctIndex;

            let buttonStyle =
              'border-indigo-300/20 bg-[#151E42]/80 text-slate-100 hover:border-blue-400/60 hover:bg-[#1B2654]';
            let keycapStyle =
              'border-indigo-300/25 bg-[#0D132B] text-sky-300';

            if (hasAnswered) {
              if (isCorrectOption) {
                buttonStyle =
                  'border-emerald-400/70 bg-emerald-500/15 text-white';
                keycapStyle =
                  'border-emerald-400/70 bg-emerald-500 text-slate-950 font-bold';
              } else if (isSelected && !isCorrectOption) {
                buttonStyle =
                  'border-rose-400/70 bg-rose-500/15 text-white';
                keycapStyle =
                  'border-rose-400/70 bg-rose-500 text-white font-bold';
              } else {
                buttonStyle =
                  'border-indigo-300/10 bg-[#0D132B]/60 text-slate-400 opacity-65';
                keycapStyle =
                  'border-indigo-300/10 bg-[#090E20] text-slate-500';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={hasAnswered}
                onClick={() => onSelectOption(idx)}
                aria-pressed={isSelected}
                className={`group flex min-h-[64px] w-full items-center justify-between gap-4 rounded-xl border px-4 py-3.5 text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 sm:px-5 sm:py-4 ${
                  !hasAnswered ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'
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

        {/* Feedback imediato + explicação educativa */}
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
                  <div className="flex items-center gap-2.5">
                    {isCorrect ? (
                      <>
                        <CheckCircle2
                          className="h-5 w-5 shrink-0 text-emerald-400"
                          aria-hidden="true"
                        />
                        <span className="font-display text-base font-bold text-emerald-300 sm:text-lg">
                          Resposta Correta · +10 pontos
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
                  className="inline-flex min-h-[52px] shrink-0 cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-7 py-3.5 text-base font-semibold text-white shadow-md shadow-blue-950/50 transition-all duration-150 hover:from-blue-500 hover:to-violet-500 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 whitespace-nowrap"
                >
                  <span>
                    {isLastQuestion ? 'Ver Resultado Final' : 'Próxima Pergunta'}
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
