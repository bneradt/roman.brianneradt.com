// Roman numeral conversion utilities supporting 1 to 3,999,999
// Vinculum notation (overline) used for numbers >= 4000

export interface RomanSegment {
  text: string
  overline: boolean
}

// Standard Roman numeral values (descending order for greedy algorithm)
const STANDARD_VALUES: [number, string][] = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
]

// Extended values with vinculum (×1000 multiplier, represented with overline)
const EXTENDED_VALUES: [number, string, boolean][] = [
  [1000000, 'M', true],
  [900000, 'CM', true],
  [500000, 'D', true],
  [400000, 'CD', true],
  [100000, 'C', true],
  [90000, 'XC', true],
  [50000, 'L', true],
  [40000, 'XL', true],
  [10000, 'X', true],
  [9000, 'IX', true],
  [5000, 'V', true],
  [4000, 'IV', true],
  [1000, 'M', false],
  [900, 'CM', false],
  [500, 'D', false],
  [400, 'CD', false],
  [100, 'C', false],
  [90, 'XC', false],
  [50, 'L', false],
  [40, 'XL', false],
  [10, 'X', false],
  [9, 'IX', false],
  [5, 'V', false],
  [4, 'IV', false],
  [1, 'I', false],
]

// Map for Roman to Arabic conversion
const ROMAN_TO_ARABIC: Record<string, number> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
}

/**
 * Convert an Arabic number to Roman numeral segments
 * Each segment indicates whether it should have an overline (vinculum)
 */
export function toRomanSegments(num: number): RomanSegment[] {
  if (num < 1 || num > 3999999 || !Number.isInteger(num)) {
    return []
  }

  const segments: RomanSegment[] = []
  let remaining = num

  for (const [value, numeral, hasOverline] of EXTENDED_VALUES) {
    while (remaining >= value) {
      // Try to merge with last segment if same overline status
      const lastSegment = segments[segments.length - 1]
      if (lastSegment && lastSegment.overline === hasOverline) {
        lastSegment.text += numeral
      } else {
        segments.push({ text: numeral, overline: hasOverline })
      }
      remaining -= value
    }
  }

  return segments
}

/**
 * Convert an Arabic number to a plain Roman numeral string
 * (without vinculum, only works for 1-3999)
 */
export function toRoman(num: number): string {
  if (num < 1 || num > 3999 || !Number.isInteger(num)) {
    return ''
  }

  let result = ''
  let remaining = num

  for (const [value, numeral] of STANDARD_VALUES) {
    while (remaining >= value) {
      result += numeral
      remaining -= value
    }
  }

  return result
}

/**
 * Convert an Arabic number to Roman numeral string with Unicode overlines
 * Uses combining overline character (U+0305) for vinculum notation
 */
export function toRomanString(num: number): string {
  const segments = toRomanSegments(num)
  return segments
    .map((seg) => {
      if (seg.overline) {
        // Add combining overline after each character
        return seg.text
          .split('')
          .map((c) => c + '\u0305')
          .join('')
      }
      return seg.text
    })
    .join('')
}

/**
 * Parse a Roman numeral string to an Arabic number
 * Handles both standard numerals and vinculum notation (with combining overline)
 */
export function fromRoman(roman: string): number {
  if (!roman || typeof roman !== 'string') {
    return 0
  }

  const normalized = roman.toUpperCase().trim()
  if (!normalized) {
    return 0
  }

  let total = 0
  let i = 0

  while (i < normalized.length) {
    const char = normalized[i]

    // Skip combining overline characters for now, handle them with the base character
    if (char === '\u0305') {
      i++
      continue
    }

    const currentValue = ROMAN_TO_ARABIC[char]
    if (currentValue === undefined) {
      // Invalid character
      return 0
    }

    // Check if next character (skipping overlines) has combining overline
    let hasOverline = false
    if (i + 1 < normalized.length && normalized[i + 1] === '\u0305') {
      hasOverline = true
    }

    const multiplier = hasOverline ? 1000 : 1
    const adjustedValue = currentValue * multiplier

    // Look ahead to next Roman numeral (skip overline chars)
    let nextIndex = i + 1
    if (hasOverline) nextIndex++ // Skip the overline char

    let nextValue = 0
    let nextHasOverline = false

    if (nextIndex < normalized.length) {
      const nextChar = normalized[nextIndex]
      if (nextChar !== '\u0305' && ROMAN_TO_ARABIC[nextChar] !== undefined) {
        nextValue = ROMAN_TO_ARABIC[nextChar]
        if (
          nextIndex + 1 < normalized.length &&
          normalized[nextIndex + 1] === '\u0305'
        ) {
          nextHasOverline = true
        }
        nextValue *= nextHasOverline ? 1000 : 1
      }
    }

    // Subtractive notation: if current value < next value, subtract
    if (adjustedValue < nextValue) {
      total -= adjustedValue
    } else {
      total += adjustedValue
    }

    i++
    if (hasOverline) i++ // Skip the overline character
  }

  return total
}

/**
 * Validate if a string is a valid Roman numeral
 */
export function isValidRoman(roman: string): boolean {
  if (!roman || typeof roman !== 'string') {
    return false
  }

  const normalized = roman.toUpperCase().trim()
  if (!normalized) {
    return false
  }

  // Check all characters are valid (Roman numerals or combining overline)
  for (const char of normalized) {
    if (char !== '\u0305' && !ROMAN_TO_ARABIC[char]) {
      return false
    }
  }

  // Convert and verify it produces a valid number
  const value = fromRoman(normalized)
  if (value < 1 || value > 3999999) {
    return false
  }

  // Round-trip validation: converting back should give same string
  const roundTrip = toRomanString(value)
  return roundTrip.toUpperCase() === normalized

}

/**
 * Check if input looks like a Roman numeral (for auto-detection)
 */
export function looksLikeRoman(input: string): boolean {
  if (!input || typeof input !== 'string') {
    return false
  }

  const normalized = input.toUpperCase().trim()
  if (!normalized) {
    return false
  }

  // If it contains only Roman numeral characters and combining overlines
  for (const char of normalized) {
    if (char !== '\u0305' && !ROMAN_TO_ARABIC[char]) {
      return false
    }
  }

  return true
}

/**
 * Check if input looks like an Arabic number
 */
export function looksLikeArabic(input: string): boolean {
  const trimmed = input.trim()
  return /^\d+$/.test(trimmed)
}

/**
 * Generate a random number within the specified range
 */
export function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Difficulty levels for the quiz
 */
export const DIFFICULTY_RANGES = {
  easy: { min: 1, max: 10, label: 'Easy (1-10)' },
  medium: { min: 1, max: 100, label: 'Medium (1-100)' },
  hard: { min: 1, max: 1000, label: 'Hard (1-1000)' },
  expert: { min: 1, max: 3999, label: 'Expert (1-3999)' },
  master: { min: 1, max: 3999999, label: 'Master (1-3,999,999)' },
} as const

export type Difficulty = keyof typeof DIFFICULTY_RANGES
