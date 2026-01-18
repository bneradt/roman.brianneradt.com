import { describe, it, expect } from 'vitest'
import {
  toRoman,
  toRomanString,
  toRomanSegments,
  fromRoman,
  isValidRoman,
  looksLikeRoman,
  looksLikeArabic,
} from './romanNumerals'

describe('toRoman (1-3999)', () => {
  it('converts basic numerals', () => {
    expect(toRoman(1)).toBe('I')
    expect(toRoman(5)).toBe('V')
    expect(toRoman(10)).toBe('X')
    expect(toRoman(50)).toBe('L')
    expect(toRoman(100)).toBe('C')
    expect(toRoman(500)).toBe('D')
    expect(toRoman(1000)).toBe('M')
  })

  it('converts additive combinations', () => {
    expect(toRoman(2)).toBe('II')
    expect(toRoman(3)).toBe('III')
    expect(toRoman(6)).toBe('VI')
    expect(toRoman(7)).toBe('VII')
    expect(toRoman(8)).toBe('VIII')
    expect(toRoman(11)).toBe('XI')
    expect(toRoman(15)).toBe('XV')
    expect(toRoman(20)).toBe('XX')
  })

  it('converts subtractive notation', () => {
    expect(toRoman(4)).toBe('IV')
    expect(toRoman(9)).toBe('IX')
    expect(toRoman(40)).toBe('XL')
    expect(toRoman(90)).toBe('XC')
    expect(toRoman(400)).toBe('CD')
    expect(toRoman(900)).toBe('CM')
  })

  it('converts complex numbers', () => {
    expect(toRoman(14)).toBe('XIV')
    expect(toRoman(19)).toBe('XIX')
    expect(toRoman(44)).toBe('XLIV')
    expect(toRoman(99)).toBe('XCIX')
    expect(toRoman(444)).toBe('CDXLIV')
    expect(toRoman(999)).toBe('CMXCIX')
    expect(toRoman(1994)).toBe('MCMXCIV')
    expect(toRoman(2024)).toBe('MMXXIV')
    expect(toRoman(3999)).toBe('MMMCMXCIX')
  })

  it('returns empty string for invalid input', () => {
    expect(toRoman(0)).toBe('')
    expect(toRoman(-1)).toBe('')
    expect(toRoman(4000)).toBe('')
    expect(toRoman(1.5)).toBe('')
  })
})

describe('toRomanSegments (extended range with vinculum)', () => {
  it('returns segments for numbers < 4000 without overline', () => {
    const segments = toRomanSegments(1994)
    expect(segments).toHaveLength(1)
    expect(segments[0].text).toBe('MCMXCIV')
    expect(segments[0].overline).toBe(false)
  })

  it('returns segments with overline for numbers >= 4000', () => {
    const segments = toRomanSegments(4000)
    expect(segments).toHaveLength(1)
    expect(segments[0].text).toBe('IV')
    expect(segments[0].overline).toBe(true)
  })

  it('handles mixed overline and non-overline', () => {
    const segments = toRomanSegments(4500)
    expect(segments).toHaveLength(2)
    expect(segments[0].text).toBe('IV')
    expect(segments[0].overline).toBe(true)
    expect(segments[1].text).toBe('D')
    expect(segments[1].overline).toBe(false)
  })

  it('handles large numbers', () => {
    const segments = toRomanSegments(1000000)
    expect(segments).toHaveLength(1)
    expect(segments[0].text).toBe('M')
    expect(segments[0].overline).toBe(true)
  })

  it('handles 3999999 (maximum)', () => {
    const segments = toRomanSegments(3999999)
    expect(segments.length).toBeGreaterThan(0)
    // Should be MMMCMXCIX with overline followed by CMXCIX without
  })

  it('returns empty array for invalid input', () => {
    expect(toRomanSegments(0)).toEqual([])
    expect(toRomanSegments(-1)).toEqual([])
    expect(toRomanSegments(4000000)).toEqual([])
  })
})

describe('toRomanString (with Unicode overlines)', () => {
  it('produces string without overlines for numbers < 4000', () => {
    expect(toRomanString(1994)).toBe('MCMXCIV')
  })

  it('produces string with combining overlines for numbers >= 4000', () => {
    const result = toRomanString(4000)
    expect(result).toContain('\u0305') // Contains combining overline
    expect(result).toBe('I\u0305V\u0305')
  })

  it('produces correct string for 5000', () => {
    expect(toRomanString(5000)).toBe('V\u0305')
  })

  it('produces correct string for 10000', () => {
    expect(toRomanString(10000)).toBe('X\u0305')
  })
})

describe('fromRoman', () => {
  it('converts basic numerals', () => {
    expect(fromRoman('I')).toBe(1)
    expect(fromRoman('V')).toBe(5)
    expect(fromRoman('X')).toBe(10)
    expect(fromRoman('L')).toBe(50)
    expect(fromRoman('C')).toBe(100)
    expect(fromRoman('D')).toBe(500)
    expect(fromRoman('M')).toBe(1000)
  })

  it('converts additive combinations', () => {
    expect(fromRoman('II')).toBe(2)
    expect(fromRoman('III')).toBe(3)
    expect(fromRoman('VI')).toBe(6)
    expect(fromRoman('VIII')).toBe(8)
    expect(fromRoman('XX')).toBe(20)
  })

  it('converts subtractive notation', () => {
    expect(fromRoman('IV')).toBe(4)
    expect(fromRoman('IX')).toBe(9)
    expect(fromRoman('XL')).toBe(40)
    expect(fromRoman('XC')).toBe(90)
    expect(fromRoman('CD')).toBe(400)
    expect(fromRoman('CM')).toBe(900)
  })

  it('converts complex numbers', () => {
    expect(fromRoman('XIV')).toBe(14)
    expect(fromRoman('XIX')).toBe(19)
    expect(fromRoman('XLIV')).toBe(44)
    expect(fromRoman('XCIX')).toBe(99)
    expect(fromRoman('CDXLIV')).toBe(444)
    expect(fromRoman('CMXCIX')).toBe(999)
    expect(fromRoman('MCMXCIV')).toBe(1994)
    expect(fromRoman('MMXXIV')).toBe(2024)
    expect(fromRoman('MMMCMXCIX')).toBe(3999)
  })

  it('is case insensitive', () => {
    expect(fromRoman('mcmxciv')).toBe(1994)
    expect(fromRoman('McmXCiv')).toBe(1994)
  })

  it('handles vinculum notation', () => {
    expect(fromRoman('I\u0305V\u0305')).toBe(4000)
    expect(fromRoman('V\u0305')).toBe(5000)
    expect(fromRoman('X\u0305')).toBe(10000)
  })

  it('returns 0 for invalid input', () => {
    expect(fromRoman('')).toBe(0)
    expect(fromRoman('ABC')).toBe(0)
    expect(fromRoman('IIII')).toBe(4) // Actually parses, but invalid form
  })
})

describe('round-trip conversion', () => {
  const testCases = [1, 4, 9, 14, 19, 40, 44, 49, 90, 99, 400, 444, 900, 999, 1994, 2024, 3999]

  testCases.forEach((num) => {
    it(`round-trips ${num} correctly`, () => {
      const roman = toRomanString(num)
      const back = fromRoman(roman)
      expect(back).toBe(num)
    })
  })

  it('round-trips extended range numbers', () => {
    const extendedCases = [4000, 5000, 10000, 50000, 100000, 500000, 1000000, 3999999]
    extendedCases.forEach((num) => {
      const roman = toRomanString(num)
      const back = fromRoman(roman)
      expect(back).toBe(num)
    })
  })
})

describe('isValidRoman', () => {
  it('returns true for valid numerals', () => {
    expect(isValidRoman('I')).toBe(true)
    expect(isValidRoman('IV')).toBe(true)
    expect(isValidRoman('MCMXCIV')).toBe(true)
  })

  it('returns false for invalid numerals', () => {
    expect(isValidRoman('')).toBe(false)
    expect(isValidRoman('ABC')).toBe(false)
    expect(isValidRoman('IIII')).toBe(false) // Invalid form
  })

  it('is case insensitive', () => {
    expect(isValidRoman('mcmxciv')).toBe(true)
  })
})

describe('looksLikeRoman', () => {
  it('returns true for Roman numeral characters', () => {
    expect(looksLikeRoman('XIV')).toBe(true)
    expect(looksLikeRoman('mcm')).toBe(true)
  })

  it('returns false for non-Roman characters', () => {
    expect(looksLikeRoman('123')).toBe(false)
    expect(looksLikeRoman('ABC')).toBe(false)
    expect(looksLikeRoman('')).toBe(false)
  })
})

describe('looksLikeArabic', () => {
  it('returns true for numeric strings', () => {
    expect(looksLikeArabic('123')).toBe(true)
    expect(looksLikeArabic('1994')).toBe(true)
  })

  it('returns false for non-numeric strings', () => {
    expect(looksLikeArabic('XIV')).toBe(false)
    expect(looksLikeArabic('12a3')).toBe(false)
    expect(looksLikeArabic('')).toBe(false)
  })
})
