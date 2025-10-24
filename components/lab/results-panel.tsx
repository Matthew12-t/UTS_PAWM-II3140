import { Card } from "@/components/ui/card"

interface BondResult {
  atom1: string
  atom2: string
  bondType: string
  electronegativityDiff: number
  bondStrength: number
  isCorrect: boolean
  score: number
}

interface ResultsPanelProps {
  results: BondResult[]
  experimentType: string
}

export function ResultsPanel({ results, experimentType }: ResultsPanelProps) {
  return (
    <Card className="p-6 sticky top-24">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Results</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {results.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">No results yet. Start analyzing bonds!</p>
        ) : (
          results.map((result, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border ${
                result.isCorrect ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="font-semibold text-gray-900">
                  {result.atom1} - {result.atom2}
                </span>
                <span className="text-lg font-bold text-indigo-600">+{result.score}</span>
              </div>
              <p className="text-sm text-gray-700 mb-1">
                Bond Type: <span className="font-medium">{result.bondType}</span>
              </p>
              <p className="text-xs text-gray-600">
                EN Diff: {result.electronegativityDiff.toFixed(2)} | Strength: {result.bondStrength.toFixed(0)}%
              </p>
            </div>
          ))
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-slate-200">
        <p className="text-sm text-gray-600">Total Experiments: {results.length}</p>
        <p className="text-2xl font-bold text-indigo-600 mt-2">{results.reduce((sum, r) => sum + r.score, 0)}</p>
      </div>
    </Card>
  )
}
