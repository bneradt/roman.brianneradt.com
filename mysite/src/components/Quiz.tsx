import { useState, useCallback, useRef, useEffect } from 'react'
import {
  toRomanString,
  fromRoman,
  randomInRange,
  DIFFICULTY_RANGES,
  type Difficulty,
  looksLikeRoman,
} from '../utils/romanNumerals'
import { RomanDisplay, RomanText } from './RomanDisplay'

type QuizDirection = 'arabicToRoman' | 'romanToArabic'

interface QuizState {
  currentNumber: number
  userAnswer: string
  isAnswered: boolean
  isCorrect: boolean
  score: { correct: number; total: number }
}

export function Quiz() {
  const [direction, setDirection] = useState<QuizDirection>('arabicToRoman')
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [state, setState] = useState<QuizState>(() => ({
    currentNumber: randomInRange(
      DIFFICULTY_RANGES.medium.min,
      DIFFICULTY_RANGES.medium.max
    ),
    userAnswer: '',
    isAnswered: false,
    isCorrect: false,
    score: { correct: 0, total: 0 },
  }))

  const nextButtonRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus Next button when answer is checked
  useEffect(() => {
    if (state.isAnswered) {
      nextButtonRef.current?.focus()
    }
  }, [state.isAnswered])

  const generateNewQuestion = useCallback(() => {
    const range = DIFFICULTY_RANGES[difficulty]
    setState((prev) => ({
      ...prev,
      currentNumber: randomInRange(range.min, range.max),
      userAnswer: '',
      isAnswered: false,
      isCorrect: false,
    }))
    // Focus and select input after generating new question
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    }, 0)
  }, [difficulty])

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty)
    const range = DIFFICULTY_RANGES[newDifficulty]
    setState({
      currentNumber: randomInRange(range.min, range.max),
      userAnswer: '',
      isAnswered: false,
      isCorrect: false,
      score: { correct: 0, total: 0 },
    })
  }

  const handleDirectionChange = (newDirection: QuizDirection) => {
    setDirection(newDirection)
    generateNewQuestion()
    setState((prev) => ({ ...prev, score: { correct: 0, total: 0 } }))
  }

  const checkAnswer = () => {
    if (state.isAnswered || !state.userAnswer.trim()) return

    let isCorrect = false

    if (direction === 'arabicToRoman') {
      // User should enter Roman numeral
      const correctRoman = toRomanString(state.currentNumber)
      const userRoman = state.userAnswer.toUpperCase().trim()
      // Compare without combining overlines for flexibility
      const normalizeRoman = (s: string) =>
        s.replace(/\u0305/g, '').toUpperCase()

      // For simple comparison, also check if they entered correct value
      if (looksLikeRoman(userRoman)) {
        const userValue = fromRoman(state.userAnswer)
        isCorrect = userValue === state.currentNumber
      } else {
        isCorrect = normalizeRoman(correctRoman) === normalizeRoman(userRoman)
      }
    } else {
      // User should enter Arabic number
      const userNumber = parseInt(state.userAnswer.trim(), 10)
      isCorrect = userNumber === state.currentNumber
    }

    setState((prev) => ({
      ...prev,
      isAnswered: true,
      isCorrect,
      score: {
        correct: prev.score.correct + (isCorrect ? 1 : 0),
        total: prev.score.total + 1,
      },
    }))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (state.isAnswered) {
        generateNewQuestion()
      } else {
        checkAnswer()
      }
    }
  }

  const correctAnswer =
    direction === 'arabicToRoman'
      ? toRomanString(state.currentNumber)
      : state.currentNumber.toLocaleString()

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4">
        {/* Direction Toggle */}
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => handleDirectionChange('arabicToRoman')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              direction === 'arabicToRoman'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Arabic → Roman
          </button>
          <button
            onClick={() => handleDirectionChange('romanToArabic')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              direction === 'romanToArabic'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Roman → Arabic
          </button>
        </div>

        {/* Difficulty Select */}
        <select
          value={difficulty}
          onChange={(e) => handleDifficultyChange(e.target.value as Difficulty)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {Object.entries(DIFFICULTY_RANGES).map(([key, { label }]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Score */}
      <div className="text-sm text-gray-600">
        Score: {state.score.correct} / {state.score.total}
        {state.score.total > 0 && (
          <span className="ml-2">
            ({Math.round((state.score.correct / state.score.total) * 100)}%)
          </span>
        )}
      </div>

      {/* Question */}
      <div className="rounded-xl bg-gray-50 p-6">
        <div className="mb-2 text-sm font-medium text-gray-500">
          {direction === 'arabicToRoman'
            ? 'Convert to Roman numerals:'
            : 'Convert to Arabic number:'}
        </div>
        <div className="text-4xl font-bold text-gray-900">
          {direction === 'arabicToRoman' ? (
            state.currentNumber.toLocaleString()
          ) : (
            <RomanDisplay value={state.currentNumber} />
          )}
        </div>
      </div>

      {/* Answer Input */}
      <div className="space-y-3">
        <input
          ref={inputRef}
          type="text"
          value={state.userAnswer}
          onChange={(e) =>
            setState((prev) => ({ ...prev, userAnswer: e.target.value }))
          }
          onKeyDown={handleKeyDown}
          placeholder={
            direction === 'arabicToRoman'
              ? 'Enter Roman numeral...'
              : 'Enter number...'
          }
          disabled={state.isAnswered}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
          autoFocus
        />

        {/* Feedback */}
        {state.isAnswered && (
          <div
            className={`rounded-lg p-4 ${
              state.isCorrect
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            {state.isCorrect ? (
              <div className="font-medium">Correct!</div>
            ) : (
              <div>
                <div className="font-medium">Incorrect</div>
                <div className="mt-1 text-sm">
                  The correct answer is:{' '}
                  {direction === 'arabicToRoman' ? (
                    <RomanText text={correctAnswer} className="font-mono" />
                  ) : (
                    <span className="font-mono">{correctAnswer}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!state.isAnswered ? (
            <button
              onClick={checkAnswer}
              disabled={!state.userAnswer.trim()}
              className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Check
            </button>
          ) : (
            <button
              ref={nextButtonRef}
              onClick={generateNewQuestion}
              className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Next
            </button>
          )}
          <button
            onClick={generateNewQuestion}
            className="rounded-lg border border-gray-300 px-6 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  )
}
