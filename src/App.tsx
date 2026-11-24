import { useCallback, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Terminal, Volume2, VolumeX } from 'lucide-react';
import { pickMatchQuestions, type QuizQuestion } from './data/questions';
import { StartScreen } from './components/StartScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen, type AnswerRecord } from './components/ResultScreen';
import {
  playCorrectSound,
  playVictorySound,
  playWrongSound,
} from './utils/sound';

type GamePhase = 'START' | 'PLAYING' | 'RESULT';

const BEST_SCORE_STORAGE_KEY = 'desafio_programacao_best_score';
const GAMES_PLAYED_STORAGE_KEY = 'desafio_programacao_games_played';

function readStoredNumber(key: string): number | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('START');
  const [questions, setQuestions] = useState<QuizQuestion[]>(() =>
    pickMatchQuestions()
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [records, setRecords] = useState<AnswerRecord[]>([]);
  const [muted, setMuted] = useState(false);

  const [bestScore, setBestScore] = useState<number | null>(() =>
    readStoredNumber(BEST_SCORE_STORAGE_KEY)
  );
  const [gamesPlayed, setGamesPlayed] = useState<number>(() =>
    readStoredNumber(GAMES_PLAYED_STORAGE_KEY) ?? 0
  );

  const startNewGame = useCallback(() => {
    setQuestions(pickMatchQuestions());
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setRecords([]);
    setPhase('PLAYING');
  }, []);

  const handleSelectOption = useCallback(
    (optionIndex: number) => {
      if (selectedOption !== null) return;

      const currentQuestion = questions[currentIndex];
      const isCorrect = optionIndex === currentQuestion.correctIndex;

      setSelectedOption(optionIndex);
      if (isCorrect) {
        setScore((prev) => prev + 10);
        playCorrectSound(muted);
      } else {
        playWrongSound(muted);
      }

      setRecords((prev) => [
        ...prev,
        {
          question: currentQuestion,
          selectedIndex: optionIndex,
          isCorrect,
        },
      ]);
    },
    [selectedOption, questions, currentIndex, muted]
  );

  const handleNextQuestion = useCallback(() => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      return;
    }

    // Fim do jogo: atualiza recorde local e exibe resultado final
    const nextGamesPlayed = gamesPlayed + 1;
    const nextBest = bestScore === null ? score : Math.max(bestScore, score);

    setGamesPlayed(nextGamesPlayed);
    setBestScore(nextBest);

    try {
      window.localStorage.setItem(BEST_SCORE_STORAGE_KEY, String(nextBest));
      window.localStorage.setItem(
        GAMES_PLAYED_STORAGE_KEY,
        String(nextGamesPlayed)
      );
    } catch {
      // Ignora caso localStorage esteja indisponível
    }

    playVictorySound(muted);
    setPhase('RESULT');
  }, [currentIndex, questions.length, gamesPlayed, bestScore, score, muted]);

  return (
    <div className="app-backdrop flex min-h-screen flex-col text-slate-100">
      {/* Cabeçalho simples e limpo */}
      <header className="border-b border-indigo-400/15 bg-[#070B19]/75 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => setPhase('START')}
            className="flex cursor-pointer items-center gap-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-sm">
              <Terminal className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap">
              Desafio da Programação
            </span>
          </button>

          <div className="flex items-center gap-3 shrink-0">
            {phase === 'PLAYING' && (
              <button
                type="button"
                onClick={() => setPhase('START')}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-indigo-500/15 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 whitespace-nowrap cursor-pointer"
              >
                Início
              </button>
            )}

            <button
              type="button"
              onClick={() => setMuted((prev) => !prev)}
              aria-label={muted ? 'Ativar efeitos sonoros' : 'Silenciar efeitos sonoros'}
              title={muted ? 'Ativar som' : 'Silenciar som'}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-indigo-300/20 bg-[#101733]/80 text-slate-300 transition-colors hover:border-indigo-300/40 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
            >
              {muted ? (
                <VolumeX className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Volume2 className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Área principal */}
      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
        <AnimatePresence mode="wait">
          {phase === 'START' && (
            <StartScreen
              key="start"
              bestScore={bestScore}
              gamesPlayed={gamesPlayed}
              onStart={startNewGame}
            />
          )}

          {phase === 'PLAYING' && questions[currentIndex] && (
            <QuizScreen
              key={`quiz-${questions[currentIndex].id}`}
              question={questions[currentIndex]}
              questionIndex={currentIndex}
              totalQuestions={questions.length}
              score={score}
              selectedOption={selectedOption}
              onSelectOption={handleSelectOption}
              onNext={handleNextQuestion}
            />
          )}

          {phase === 'RESULT' && (
            <ResultScreen
              key="result"
              score={score}
              totalQuestions={questions.length}
              records={records}
              bestScore={bestScore}
              onPlayAgain={startNewGame}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Rodapé discreto */}
      <footer className="border-t border-indigo-400/10 py-4 text-center text-xs text-slate-500">
        Desafio da Programação · Lógica, JavaScript e Pensamento Computacional
      </footer>
    </div>
  );
}
