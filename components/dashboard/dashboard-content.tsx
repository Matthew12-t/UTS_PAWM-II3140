"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LabCard } from "./lab-card"
import { StatsCard } from "./stats-card"
import { UserMenu } from "./user-menu"

interface UserProgress {
  total_experiments: number
  completed_experiments: number
  total_score: number
  average_score: number
}

export default function DashboardContent({ user }: { user: User }) {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchProgress = async () => {
      const { data } = await supabase.from("user_progress").select("*").eq("user_id", user.id).single()

      if (data) {
        setProgress(data)
      }
      setLoading(false)
    }

    fetchProgress()
  }, [user.id, supabase])

  const experiments = [
    {
      id: "ionic",
      title: "Ionic Bonding",
      description: "Learn about electron transfer between atoms",
      icon: "⚡",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "covalent",
      title: "Covalent Bonding",
      description: "Explore electron sharing between atoms",
      icon: "🔗",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "metallic",
      title: "Metallic Bonding",
      description: "Understand the sea of electrons model",
      icon: "✨",
      color: "from-amber-500 to-orange-500",
    },
    {
      id: "hydrogen",
      title: "Hydrogen Bonding",
      description: "Discover intermolecular forces",
      icon: "💧",
      color: "from-green-500 to-emerald-500",
    },
  ]

  return (
    <body className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ChemLab</h1>
            <p className="text-sm text-gray-600">Virtual Chemistry Laboratory</p>
          </div>
          <nav aria-label="User menu">
            <UserMenu user={user} />
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section aria-labelledby="welcome-section" className="mb-8">
          <h2 id="welcome-section" className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user.user_metadata?.full_name || "Student"}!
          </h2>
          <p className="text-gray-600">Continue your chemistry learning journey with interactive experiments</p>
        </section>

        <section aria-labelledby="stats-overview" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <h2 id="stats-overview" className="sr-only">User Progress Overview</h2>
          <StatsCard title="Total Experiments" value={progress?.total_experiments || 0} icon="📊" color="bg-blue-50" />
          <StatsCard title="Completed" value={progress?.completed_experiments || 0} icon="✅" color="bg-green-50" />
          <StatsCard title="Total Score" value={progress?.total_score || 0} icon="🏆" color="bg-amber-50" />
          <StatsCard
            title="Average Score"
            value={progress?.average_score?.toFixed(1) || "0"}
            icon="📈"
            color="bg-purple-50"
          />
        </section>

        <section aria-labelledby="available-experiments" className="mb-8">
          <h3 id="available-experiments" className="text-xl font-bold text-gray-900 mb-4">
            Available Experiments
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {experiments.map((exp) => (
              <article key={exp.id}>
                <LabCard experiment={exp} />
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="quick-actions" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <h3 id="quick-actions" className="sr-only">Quick Access</h3>

          <article>
            <Card className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Recent Sessions</h4>
              <p className="text-gray-600 text-sm mb-4">View and continue your previous lab sessions</p>
              <Link href="/dashboard/sessions">
                <Button variant="outline" className="w-full bg-transparent">
                  View Sessions
                </Button>
              </Link>
            </Card>
          </article>

          <article>
            <Card className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Your Results</h4>
              <p className="text-gray-600 text-sm mb-4">Check your experiment results and scores</p>
              <Link href="/dashboard/results">
                <Button variant="outline" className="w-full bg-transparent">
                  View Results
                </Button>
              </Link>
            </Card>
          </article>
        </section>
      </main>

      <footer className="text-center text-sm text-gray-500 py-4 border-t border-slate-200">
        <p>© {new Date().getFullYear()} ChemLab — Virtual Chemistry Laboratory</p>
      </footer>
    </body>
  )
}
