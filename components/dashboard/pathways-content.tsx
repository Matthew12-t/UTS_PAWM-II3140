"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { PathwayCard } from "./pathway-card"
import { QuizResultsSummary } from "./quiz-results-summary"
import { UserMenu } from "./user-menu"
import { Card } from "@/components/ui/card"
import { AnimatedBackground } from "@/components/layout/animated-background"

interface Pathway {
  id: number
  title: string
  description: string
  order_number: number
  type: string
}

export default function PathwaysContent({ user }: { user: User }) {
  const [pathways, setPathways] = useState<Pathway[]>([])
  const [loading, setLoading] = useState(true)
  const [userProgress, setUserProgress] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchPathways = async () => {
      const { data } = await supabase.from("pathways").select("*").order("order_number", { ascending: true })

      if (data) {
        setPathways(data)
      }
      setLoading(false)
    }

    fetchPathways()
  }, [supabase])

  useEffect(() => {
    const fetchUserProgress = async () => {
      const { data } = await supabase
        .from("user_pathway_progress")
        .select("*")
        .eq("user_id", user.id)
        .order("pathway_id", { ascending: true })

      if (data) {
        setUserProgress(data)
      }
    }

    fetchUserProgress()
  }, [user.id, supabase])

  const [completedCount, setCompletedCount] = useState(0)

  useEffect(() => {
    setCompletedCount(userProgress.filter((p) => p.status === "completed").length)
  }, [userProgress])

  const progressPercentage = pathways.length > 0 ? Math.round((completedCount / pathways.length) * 100) : 0

  const isPathwayLocked = (pathwayOrderNumber: number): boolean => {
    if (pathwayOrderNumber === 1) return false // First pathway is always unlocked

    const previousPathway = pathways.find((p) => p.order_number === pathwayOrderNumber - 1)
    if (!previousPathway) return false

    const previousProgress = userProgress.find((p) => p.pathway_id === previousPathway.id)
    return previousProgress?.status !== "completed"
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden">
      <AnimatedBackground />

      <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">ChemLab</h1>
            <p className="text-sm text-indigo-100">Virtual Chemistry Laboratory</p>
          </div>
          <UserMenu user={user} />
        </div>
      </header>

      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-2">
            Selamat datang kembali, {user.user_metadata?.full_name || "Siswa"}!
          </h2>
          <p className="text-lg text-indigo-100">
            Lanjutkan perjalanan belajar kimia Anda dengan materi Chemical Bonding
          </p>
        </header>
        <Card className="p-8 mb-12 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 border-0 text-white shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Progress Pembelajaran</h3>
              <p className="text-indigo-100">
                {completedCount} dari {pathways.length} pathway selesai
              </p>
            </div>
            <span className="text-5xl font-bold text-white/90">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-4">
            <div
              className="bg-white h-4 rounded-full transition-all duration-500 shadow-lg"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </Card>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-green-400 to-emerald-400 rounded-full"></div>
            <h2 className="text-2xl font-bold text-white">Hasil Kuis & Tes</h2>
          </div>
          <QuizResultsSummary user={user} />
        </div>

        {/* Chemical Bonding Title Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 bg-gradient-to-b from-indigo-400 to-blue-400 rounded-full"></div>
            <h2 className="text-3xl font-bold text-white">Chemical Bonding</h2>
          </div>
          <p className="text-indigo-100 ml-4">
            Pelajari konsep dasar ikatan kimia melalui 7 pathway pembelajaran interaktif
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-indigo-100">Memuat pathway...</p>
          </div>
        ) : (
          <div className="space-y-6 relative">
            {/* Timeline line */}
            <div className="absolute left-7 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 via-blue-400 to-cyan-400 rounded-full"></div>

            {/* Pathway cards in vertical layout */}
            {pathways.map((pathway, index) => (
              <div key={pathway.id} className="relative pl-20">
                {/* Timeline dot */}
                <div className="absolute left-0 top-6 w-16 h-16 -ml-8 flex items-center justify-center">
                  <div
                    className={`w-16 h-16 rounded-full border-4 flex items-center justify-center shadow-lg font-bold text-lg ${
                      isPathwayLocked(pathway.order_number)
                        ? "bg-gray-400 border-gray-500 text-gray-600"
                        : "bg-white border-indigo-400 text-indigo-600"
                    }`}
                  >
                    {isPathwayLocked(pathway.order_number) ? "🔒" : pathway.order_number}
                  </div>
                </div>

                {/* Pathway Card */}
                <PathwayCard pathway={pathway} user={user} isLocked={isPathwayLocked(pathway.order_number)} />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
