"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { QuizDetailModal } from "./quiz-detail-modal"

interface QuizResult {
  pathwayId: number
  title: string
  score: number
  status: string
  type: string
}

export function QuizResultsSummary({ user }: { user: User }) {
  const [results, setResults] = useState<QuizResult[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPathway, setSelectedPathway] = useState<number | null>(null)
  const [selectedTitle, setSelectedTitle] = useState<string>("")
  const supabase = createClient()

  useEffect(() => {
    const fetchResults = async () => {
      // Fetch all user pathway progress
      const { data: progressData } = await supabase.from("user_pathway_progress").select("*").eq("user_id", user.id)

      if (progressData) {
        // Fetch pathways to get titles and types
        const { data: pathwaysData } = await supabase.from("pathways").select("*")

        if (pathwaysData) {
          const formattedResults = progressData
            .filter((p: any) => p.status === "completed" && p.score !== null)
            .map((p: any) => {
              const pathway = pathwaysData.find((pw: any) => pw.id === p.pathway_id)
              return {
                pathwayId: p.pathway_id,
                title: pathway?.title || "Unknown",
                score: p.score || 0,
                status: p.status,
                type: pathway?.type,
              }
            })
            .filter((r: any) => r.type === "quiz" || r.type === "final_test")
            .sort((a: any, b: any) => a.pathwayId - b.pathwayId)

          setResults(formattedResults)
        }
      }
      setLoading(false)
    }

    fetchResults()
  }, [user.id, supabase])

  if (loading) {
    return (
      <Card className="p-6 bg-white border-0 shadow-md">
        <p className="text-gray-600 text-center">Memuat hasil...</p>
      </Card>
    )
  }

  if (results.length === 0) {
    return (
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
        <p className="text-gray-600 text-center">Belum ada hasil kuis atau tes. Mulai belajar sekarang!</p>
      </Card>
    )
  }

  const averageScore = Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
  const totalScore = results.reduce((sum, r) => sum + r.score, 0)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-500 to-cyan-500 border-0 text-white shadow-lg">
          <p className="text-sm font-medium text-blue-100 mb-2">Total Nilai</p>
          <p className="text-4xl font-bold">{totalScore}</p>
          <p className="text-xs text-blue-100 mt-2">{results.length} hasil</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-indigo-500 to-purple-500 border-0 text-white shadow-lg">
          <p className="text-sm font-medium text-indigo-100 mb-2">Rata-rata Nilai</p>
          <p className="text-4xl font-bold">{averageScore}</p>
          <p className="text-xs text-indigo-100 mt-2">dari 100</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-500 border-0 text-white shadow-lg">
          <p className="text-sm font-medium text-green-100 mb-2">Selesai</p>
          <p className="text-4xl font-bold">{results.length}</p>
          <p className="text-xs text-green-100 mt-2">kuis & tes</p>
        </Card>
      </div>

      <Card className="p-6 bg-white border-0 shadow-md">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Detail Hasil</h3>
        <div className="space-y-3">
          {results.map((result, index) => (
            <button
              key={result.pathwayId}
              onClick={() => {
                setSelectedPathway(result.pathwayId)
                setSelectedTitle(result.title)
              }}
              className="w-full text-left flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-blue-400 flex items-center justify-center text-white font-bold text-sm group-hover:shadow-lg transition-shadow">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {result.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {result.type === "quiz" ? "Kuis" : "Tes Akhir"} • Klik untuk melihat pembahasan
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-indigo-600">{result.score}</p>
                <p className="text-xs text-gray-500">/ 100</p>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <QuizDetailModal
        isOpen={selectedPathway !== null}
        onClose={() => setSelectedPathway(null)}
        pathwayId={selectedPathway || 0}
        user={user}
        pathwayTitle={selectedTitle}
      />
    </div>
  )
}
