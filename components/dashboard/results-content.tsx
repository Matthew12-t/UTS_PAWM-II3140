"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface LabResult {
  id: string
  experiment_type: string
  atom1: string
  atom2: string
  bond_type: string
  electronegativity_diff: number
  bond_strength: number
  is_correct: boolean
  score: number
  created_at: string
}

export default function ResultsContent({ user }: { user: User }) {
  const [results, setResults] = useState<LabResult[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const supabase = createClient()

  useEffect(() => {
    const fetchResults = async () => {
      let query = supabase
        .from("lab_results")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (filter !== "all") {
        query = query.eq("experiment_type", filter)
      }

      const { data } = await query

      if (data) {
        setResults(data)
      }
      setLoading(false)
    }

    fetchResults()
  }, [user.id, filter, supabase])

  const experimentTypes = ["ionic", "covalent", "metallic", "hydrogen"]
  const totalScore = results.reduce((sum, r) => sum + r.score, 0)
  const correctCount = results.filter((r) => r.is_correct).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/dashboard"
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mb-2 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Your Results</h1>
          <p className="text-gray-600 text-sm mt-1">View all your experiment results and scores</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-blue-50 border-0">
            <p className="text-sm font-medium text-gray-600 mb-1">Total Results</p>
            <p className="text-3xl font-bold text-gray-900">{results.length}</p>
          </Card>
          <Card className="p-6 bg-green-50 border-0">
            <p className="text-sm font-medium text-gray-600 mb-1">Correct Answers</p>
            <p className="text-3xl font-bold text-gray-900">{correctCount}</p>
          </Card>
          <Card className="p-6 bg-amber-50 border-0">
            <p className="text-sm font-medium text-gray-600 mb-1">Total Score</p>
            <p className="text-3xl font-bold text-gray-900">{totalScore}</p>
          </Card>
        </div>

        <div className="mb-6 flex gap-2 flex-wrap">
          <Button
            onClick={() => setFilter("all")}
            variant={filter === "all" ? "default" : "outline"}
            className={filter === "all" ? "bg-indigo-600 hover:bg-indigo-700" : ""}
          >
            All
          </Button>
          {experimentTypes.map((type) => (
            <Button
              key={type}
              onClick={() => setFilter(type)}
              variant={filter === type ? "default" : "outline"}
              className={filter === type ? "bg-indigo-600 hover:bg-indigo-700" : ""}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>

        <Card className="overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading results...</div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No results found. Start an experiment to see your results here!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Experiment</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Atoms</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Bond Type</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">EN Diff</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {results.map((result) => (
                    <tr key={result.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {result.experiment_type.charAt(0).toUpperCase() + result.experiment_type.slice(1)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {result.atom1} - {result.atom2}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{result.bond_type}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{result.electronegativity_diff.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            result.is_correct ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {result.is_correct ? "Correct" : "Partial"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-indigo-600">+{result.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
