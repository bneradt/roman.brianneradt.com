import { useState } from 'react'
import { Quiz } from './components/Quiz'
import { Converter } from './components/Converter'
import { Reference } from './components/Reference'

type Tab = 'quiz' | 'converter' | 'reference'

const tabs: { id: Tab; label: string }[] = [
  { id: 'quiz', label: 'Quiz' },
  { id: 'converter', label: 'Converter' },
  { id: 'reference', label: 'Reference' },
]

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('quiz')

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-2xl px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Roman Numerals</h1>
          <p className="mt-1 text-sm text-gray-500">
            Learn, practice, and convert Roman numerals
          </p>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-2xl px-4">
          <div className="flex gap-6">
            {tabs.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`border-b-2 py-3 text-sm font-medium transition-colors ${
                  activeTab === id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-2xl px-4 py-6">
        {activeTab === 'quiz' && <Quiz />}
        {activeTab === 'converter' && <Converter />}
        {activeTab === 'reference' && <Reference />}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-2xl px-4 py-4 text-center text-sm text-gray-500">
          Supports numbers 1 to 3,999,999 with vinculum notation
        </div>
      </footer>
    </div>
  )
}

export default App
