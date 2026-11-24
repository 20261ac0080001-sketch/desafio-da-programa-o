import { useCallback, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Terminal, Volume2, VolumeX } from 'lucide-react';
import {
  getLevelInfo,
  getStreakBonus,
  pickMatchQuestions,
  type DifficultyLevel,
  type QuizQuestion,
} from './data/questions';
import { StartScreen } from './components/StartScreen';
import { QuizScreen } from './components/QuizScreen';
import { LevelUpScreen } from './components/LevelUpScreen';
import { ResultScreen, type AnswerRecord } from './components/ResultScreen';
import {
  playCorrectSound,
  playLevelUpSound,
  playVictorySound,
  playWrongSound,
} from './utils/sound';

type GamePhase = 'START' | 'PLAYING' | 'LEVEL_UP' | 'RESULT';

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
  const [baseScore, setBaseScore] = useState(0);
  const [bonusScore, setBonusScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [lastPoints, setLastPoints] = useState<{
    base: number;
    bonus: number;
  } | null>(null);
  const [records, setRecords] = useState<AnswerRecord[]>([]);
  const [levelTransition, setLevelTransition] = useState<{
    from: DifficultyLevel;
    to: DifficultyLevel;
  } | null>(null);
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
    setBaseScore(0);
    setBonusScore(0);
    setStreak(0);
    setMaxStreak(0);
    setLastPoints(null);
    setRecords([]);
    setLevelTransition(null);
    setPhase('PLAYING');
  }, []);

  const handleSelectOption = useCallback(
    (optionIndex: number) => {
      if (selectedOption !== null) return;

      const currentQuestion = questions[currentIndex];
      const isCorrect = optionIndex === currentQuestion.correctIndex;

      setSelectedOption(optionIndex);

      if (isCorrect) {
        const nextStreak = streak + 1;
        const base = 10;
        const bonus = getStreakBonus(nextStreak);
        const totalEarned = base + bonus;

        setStreak(nextStreak);
        setMaxStreak((prev) => Math.max(prev, nextStreak));
        setBaseScore((prev) => prev + base);
        setBonusScore((prev) => prev + bonus);
        setScore((prev) => prev + totalEarned);
        setLastPoints({ base, bonus });

        playCorrectSound(muted, nextStreak);

        setRecords((prev) => [
          ...prev,
          {
            question: currentQuestion,
            selectedIndex: optionIndex,
            isCorrect: true,
            pointsEarned: totalEarned,
          },
        ]);
      } else {
        setStreak(0);
        setLastPoints({ base: 0, bonus: 0 });
        playWrongSound(muted);

        setRecords((prev) => [
          ...prev,
          {
            question: currentQuestion,
            selectedIndex: optionIndex,
            isCorrect: false,
            pointsEarned: 0,
          },
        ]);
      }
    },
    [selectedOption, questions, currentIndex, streak, muted]
  );

  const handleTimeout = useCallback(() => {
    if (selectedOption !== null) return;

    const currentQuestion = questions[currentIndex];
    setSelectedOption(-1);
    setStreak(0);
    setLastPoints({ base: 0, bonus: 0 });
    playWrongSound(muted);

    setRecords((prev) => [
      ...prev,
      {
        question: currentQuestion,
        selectedIndex: -1,
        isCorrect: false,
        pointsEarned: 0,
      },
    ]);
  }, [selectedOption, questions, currentIndex, muted]);

  const handleNextQuestion = useCallback(() => {
    if (currentIndex + 1 < questions.length) {
      const currentLevel = questions[currentIndex].level;
      const nextLevel = questions[currentIndex + 1].level;

      if (nextLevel > currentLevel) {
        setLevelTransition({ from: currentLevel, to: nextLevel });
        playLevelUpSound(muted);
        setPhase('LEVEL_UP');
        return;
      }

      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setLastPoints(null);
      return;
    }

    // Fim do jogo: atualiza estatísticas e exibe resultado final
    const nextGamesPlayed = gamesPlayed + 1;
    const nextBest = bestScore === null ? score : Math.max(bestScore, score);
    const correctCount = records.filter((r) => r.isCorrect).length;

    setGamesPlayed(nextGamesPlayed);
    setBestScore(nextBest);

    try {
      window.localStorage.setItem(BEST_SCORE_STORAGE_KEY, String(nextBest));
      window.localStorage.setItem(
        GAMES_PLAYED_STORAGE_KEY,
        String(nextGamesPlayed)
      );
    } catch {
      // Ignora caso localStorage esteja bloqueado
    }

    if (correctCount >= Math.ceil(questions.length / 2)) {
      playVictorySound(muted);
    }
    setPhase('RESULT');
  }, [
    currentIndex,
    questions,
    gamesPlayed,
    bestScore,
    score,
    records,
    muted,
  ]);

  const handleContinueAfterLevelUp = useCallback(() => {
    setLevelTransition(null);
    setCurrentIndex((prev) => prev + 1);
    setSelectedOption(null);
    setLastPoints(null);
    setPhase('PLAYING');
  }, []);

  return (
    <div className="app-backdrop flex min-h-screen flex-col text-slate-100">
      {/* Cabeçalho com controle de som */}
      <header className="border-b border-indigo-400/20 bg-[#050814]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <button
            type="button"
            onClick={() => setPhase('START')}
            className="flex cursor-pointer items-center gap-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 text-white shadow-[0_0_16px_rgba(56,189,248,0.45)]">
              <Terminal className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap">
              Desafio da Programação
            </span>
          </button>

          <div className="flex items-center gap-3 shrink-0">
            {(phase === 'PLAYING' || phase === 'LEVEL_UP') && (
              <button
                type="button"
                onClick={() => setPhase('START')}
                className="min-h-[40px] cursor-pointer rounded-lg px-3.5 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-indigo-500/15 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 whitespace-nowrap"
              >
                Início
              </button>
            )}

            <button
              type="button"
              onClick={() => setMuted((prev) => !prev)}
              aria-label={muted ? 'Ligar sons' : 'Desligar sons'}
              title={muted ? 'Ligar sons' : 'Desligar sons'}
              className="inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-xl border border-indigo-300/25 bg-[#0C132D]/90 px-3.5 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-cyan-400/50 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 whitespace-nowrap"
            >
              {muted ? (
                <>
                  <VolumeX
                    className="h-4 w-4 text-rose-300"
                    aria-hidden="true"
                  />
                  <span className="hidden sm:inline">Som desligado</span>
                </>
              ) : (
                <>
                  <Volume2
                    className="h-4 w-4 text-cyan-300"
                    aria-hidden="true"
                  />
                  <span className="hidden sm:inline">Som ligado</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Área principal */}
      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
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
              streak={streak}
              lastPoints={lastPoints}
              selectedOption={selectedOption}
              muted={muted}
              onSelectOption={handleSelectOption}
              onTimeout={handleTimeout}
              onNext={handleNextQuestion}
            />
          )}

          {phase === 'LEVEL_UP' && levelTransition && (
            <LevelUpScreen
              key={`levelup-${levelTransition.to}`}
              completedLevel={getLevelInfo(levelTransition.from)}
              nextLevel={getLevelInfo(levelTransition.to)}
              score={score}
              streak={streak}
              onContinue={handleContinueAfterLevelUp}
            />
          )}

          {phase === 'RESULT' && (
            <ResultScreen
              key="result"
              score={score}
              baseScore={baseScore}
              bonusScore={bonusScore}
              maxStreak={maxStreak}
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
