"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { UserMenu } from "@/components/dashboard/user-menu"
import Link from "next/link"
import TopicView from "./topic-view"
import SimulationView from "./simulation-view"
import QuizView from "./quiz-view"
import FinalTestView from "./final-test-view"

interface Pathway {
  id: number
  title: string
  description: string
  order_number: number
  type: string
  content: any
}

export default function PathwayContent({ user, pathway }: { user: User; pathway: Pathway }) {
  const [progress, setProgress] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchProgress = async () => {
      const { data } = await supabase
        .from("user_pathway_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("pathway_id", pathway.id)
        .single()

      if (!data) {
        // Create progress record if it doesn't exist
        await supabase.from("user_pathway_progress").insert({
          user_id: user.id,
          pathway_id: pathway.id,
          status: "in_progress",
        })
      }

      setProgress(data)
    }

    fetchProgress()
  }, [pathway.id, user.id, supabase])

  const renderContent = () => {
    switch (pathway.type) {
      case "topic":
        return <TopicView pathway={pathway} />
      case "simulation":
        return <SimulationView pathway={pathway} user={user} />
      case "quiz":
        return <QuizView pathway={pathway} user={user} />
      case "final_test":
        return <FinalTestView pathway={pathway} user={user} />
      default:
        return <div>Unknown pathway type</div>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 text-sm mb-2 inline-block">
              ← Kembali ke Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{pathway.title}</h1>
          </div>
          <UserMenu user={user} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{renderContent()}</main>
    </div>
  )
}
