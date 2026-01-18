import { useState, useMemo } from 'react'
import {
  toRomanString,
  fromRoman,
  looksLikeRoman,
  looksLikeArabic,
} from '../utils/romanNumerals'
import { RomanDisplay, RomanText } from './RomanDisplay'

type InputMode = 'auto' | 'arabic' | 'roman'

export function Converter() {
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<InputMode>('auto')

  const result = useMemo(() => {
    const trimmed = input.trim()
    if (!trimmed) {
      return { type: 'empty' as const }
    }

    let isRoman = false
    let isArabic = false

    if (mode === 'auto') {
      isRoman = looksLikeRoman(trimmed)
      isArabic = looksLikeArabic(trimmed)
    } else if (mode === 'roman') {
      isRoman = true
    } else {
      isArabic = true
    }

    if (isArabic) {
      const num = parseInt(trimmed, 10)
      if (isNaN(num)) {
        return { type: 'error' as const, message: 'Invalid number' }
      }
      if (num < 1 || num > 3999999) {
        return {
          type: 'error' as const,
          message: 'Number must be between 1 and 3,999,999',
        }
      }
      const roman = toRomanString(num)
      return {
        type: 'success' as const,
        direction: 'toRoman' as const,
        arabic: num,
        roman,
      }
    }

    if (isRoman) {
      const num = fromRoman(trimmed)
      if (num === 0) {
        return { type: 'error' as const, message: 'Invalid Roman numeral' }
      }
      return {
        type: 'success' as const,
        direction: 'toArabic' as const,
        arabic: num,
        roman: trimmed.toUpperCase(),
      }
    }

    return {
      type: 'error' as const,
      message: 'Enter a number (1-3,999,999) or Roman numeral',
    }
  }, [input, mode])

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Input type:</span>
        <div className="flex rounded-lg bg-gray-100 p-1">
          {(['auto', 'arabic', 'roman'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                mode === m
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {m === 'auto' ? 'Auto-detect' : m}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === 'roman'
              ? 'Enter Roman numeral (e.g., MCMXCIV)'
              : mode === 'arabic'
                ? 'Enter number (e.g., 1994)'
                : 'Enter number or Roman numeral...'
          }
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          autoFocus
        />
      </div>

      {/* Result */}
      <div className="rounded-xl bg-gray-50 p-6">
        {result.type === 'empty' && (
          <div className="text-center text-gray-400">
            Enter a value to convert
          </div>
        )}

        {result.type === 'error' && (
          <div className="text-center text-red-600">{result.message}</div>
        )}

        {result.type === 'success' && (
          <div className="space-y-4">
            {/* Arabic Number */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Arabic</span>
              <span className="text-2xl font-bold text-gray-900">
                {result.arabic.toLocaleString()}
              </span>
            </div>

            {/* Divider with arrow */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-gray-400">
                {result.direction === 'toRoman' ? '↓' : '↑'}
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Roman Numeral */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Roman</span>
              <span className="text-2xl font-bold text-gray-900">
                {result.arabic >= 4000 ? (
                  <RomanDisplay value={result.arabic} />
                ) : (
                  <RomanText text={result.roman} />
                )}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Examples */}
      <div className="border-t pt-4">
        <div className="mb-2 text-sm font-medium text-gray-500">
          Quick examples:
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: '1994', value: '1994' },
            { label: '2024', value: '2024' },
            { label: 'MCMXCIV', value: 'MCMXCIV' },
            { label: '4000', value: '4000' },
            { label: '1000000', value: '1000000' },
          ].map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setInput(value)}
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
