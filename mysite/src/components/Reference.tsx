import { useState } from 'react'

interface AccordionSection {
  id: string
  title: string
  content: React.ReactNode
}

const sections: AccordionSection[] = [
  {
    id: 'basic',
    title: 'Basic Numerals',
    content: (
      <div className="space-y-3">
        <p className="text-sm text-gray-600">
          The seven basic Roman numeral symbols and their values:
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { numeral: 'I', value: 1 },
            { numeral: 'V', value: 5 },
            { numeral: 'X', value: 10 },
            { numeral: 'L', value: 50 },
            { numeral: 'C', value: 100 },
            { numeral: 'D', value: 500 },
            { numeral: 'M', value: 1000 },
          ].map(({ numeral, value }) => (
            <div
              key={numeral}
              className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2"
            >
              <span className="text-xl font-bold text-gray-900">{numeral}</span>
              <span className="text-gray-600">{value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'subtractive',
    title: 'Subtractive Notation',
    content: (
      <div className="space-y-3">
        <p className="text-sm text-gray-600">
          When a smaller numeral appears before a larger one, it is subtracted.
          This is only used for specific combinations:
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {[
            { numeral: 'IV', value: 4, explanation: '5 - 1' },
            { numeral: 'IX', value: 9, explanation: '10 - 1' },
            { numeral: 'XL', value: 40, explanation: '50 - 10' },
            { numeral: 'XC', value: 90, explanation: '100 - 10' },
            { numeral: 'CD', value: 400, explanation: '500 - 100' },
            { numeral: 'CM', value: 900, explanation: '1000 - 100' },
          ].map(({ numeral, value, explanation }) => (
            <div key={numeral} className="rounded-lg bg-gray-50 px-4 py-2">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">
                  {numeral}
                </span>
                <span className="text-gray-900">{value}</span>
              </div>
              <div className="mt-1 text-xs text-gray-500">{explanation}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'vinculum',
    title: 'Vinculum (Overline)',
    content: (
      <div className="space-y-3">
        <p className="text-sm text-gray-600">
          For numbers 4,000 and above, a line over a numeral (vinculum)
          multiplies its value by 1,000:
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {[
            { numeral: 'V', value: 5000 },
            { numeral: 'X', value: 10000 },
            { numeral: 'L', value: 50000 },
            { numeral: 'C', value: 100000 },
            { numeral: 'D', value: 500000 },
            { numeral: 'M', value: 1000000 },
          ].map(({ numeral, value }) => (
            <div
              key={numeral}
              className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2"
            >
              <span className="overline text-xl font-bold text-gray-900">
                {numeral}
              </span>
              <span className="text-gray-600">{value.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600">
          Examples:{' '}
          <span className="font-mono">
            <span className="overline">IV</span>
          </span>{' '}
          = 4,000,{' '}
          <span className="font-mono">
            <span className="overline">X</span>
          </span>{' '}
          = 10,000
        </p>
      </div>
    ),
  },
  {
    id: 'rules',
    title: 'Rules & Tips',
    content: (
      <div className="space-y-3">
        <ul className="list-inside list-disc space-y-2 text-sm text-gray-600">
          <li>
            <strong>Left to right:</strong> Roman numerals are read from left to
            right, adding values unless subtractive notation applies.
          </li>
          <li>
            <strong>Maximum repetition:</strong> A numeral can be repeated up to
            three times in a row (III = 3, XXX = 30, CCC = 300).
          </li>
          <li>
            <strong>V, L, D never repeat:</strong> These numerals (5, 50, 500)
            are never repeated as adding them would equal the next higher
            numeral.
          </li>
          <li>
            <strong>Subtractive pairs:</strong> Only I, X, and C can be used
            subtractively, and only before specific numerals (IV, IX, XL, XC,
            CD, CM).
          </li>
          <li>
            <strong>No zero:</strong> Roman numerals have no symbol for zero.
            The system represents positive integers only.
          </li>
          <li>
            <strong>Modern range:</strong> Standard Roman numerals (without
            vinculum) can represent 1 to 3,999. With vinculum, the range extends
            to 3,999,999.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'examples',
    title: 'Common Examples',
    content: (
      <div className="space-y-3">
        <div className="grid gap-2">
          {[
            { value: 1994, roman: 'MCMXCIV', note: 'Year 1994' },
            { value: 2024, roman: 'MMXXIV', note: 'Year 2024' },
            { value: 49, roman: 'XLIX', note: 'Super Bowl XLIX' },
            { value: 100, roman: 'C', note: 'Centennial' },
            { value: 500, roman: 'D', note: 'Half millennium' },
            { value: 1000, roman: 'M', note: 'Millennium' },
            { value: 3999, roman: 'MMMCMXCIX', note: 'Largest standard' },
          ].map(({ value, roman, note }) => (
            <div
              key={value}
              className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2"
            >
              <div>
                <span className="font-mono text-lg font-bold text-gray-900">
                  {roman}
                </span>
                <span className="ml-2 text-sm text-gray-500">{note}</span>
              </div>
              <span className="text-gray-600">{value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
]

export function Reference() {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(['basic'])
  )

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const expandAll = () => {
    setOpenSections(new Set(sections.map((s) => s.id)))
  }

  const collapseAll = () => {
    setOpenSections(new Set())
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={expandAll}
          className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
        >
          Expand all
        </button>
        <button
          onClick={collapseAll}
          className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
        >
          Collapse all
        </button>
      </div>

      {/* Accordion */}
      <div className="divide-y divide-gray-200 rounded-xl border border-gray-200">
        {sections.map((section) => {
          const isOpen = openSections.has(section.id)
          return (
            <div key={section.id}>
              <button
                onClick={() => toggleSection(section.id)}
                className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50"
              >
                <span className="font-medium text-gray-900">
                  {section.title}
                </span>
                <svg
                  className={`h-5 w-5 text-gray-500 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isOpen && <div className="px-4 pb-4">{section.content}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
