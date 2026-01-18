import { toRomanSegments, type RomanSegment } from '../utils/romanNumerals'

interface RomanDisplayProps {
  value: number
  className?: string
}

export function RomanDisplay({ value, className = '' }: RomanDisplayProps) {
  const segments = toRomanSegments(value)

  if (segments.length === 0) {
    return <span className={className}>-</span>
  }

  return (
    <span className={className}>
      {segments.map((segment, index) => (
        <RomanSegmentDisplay key={index} segment={segment} />
      ))}
    </span>
  )
}

interface RomanSegmentDisplayProps {
  segment: RomanSegment
}

function RomanSegmentDisplay({ segment }: RomanSegmentDisplayProps) {
  if (segment.overline) {
    return <span className="overline">{segment.text}</span>
  }
  return <span>{segment.text}</span>
}

interface RomanTextProps {
  text: string
  className?: string
}

export function RomanText({ text, className = '' }: RomanTextProps) {
  // Parse text that may contain combining overlines and render with CSS overlines
  const parts: { text: string; overline: boolean }[] = []
  let currentPart = ''
  let currentOverline = false
  let i = 0

  while (i < text.length) {
    const char = text[i]
    const nextIsOverline = i + 1 < text.length && text[i + 1] === '\u0305'

    if (char === '\u0305') {
      i++
      continue
    }

    if (nextIsOverline !== currentOverline && currentPart) {
      parts.push({ text: currentPart, overline: currentOverline })
      currentPart = ''
    }

    currentOverline = nextIsOverline
    currentPart += char
    i++
    if (nextIsOverline) i++ // Skip the overline character
  }

  if (currentPart) {
    parts.push({ text: currentPart, overline: currentOverline })
  }

  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.overline ? (
          <span key={index} className="overline">
            {part.text}
          </span>
        ) : (
          <span key={index}>{part.text}</span>
        )
      )}
    </span>
  )
}
