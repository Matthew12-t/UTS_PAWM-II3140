"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { UserMenu } from "@/components/dashboard/user-menu"
import Link from "next/link"
import TopicView from "./topic-view"
import QuizView from "./quiz-view"
import FinalTestView from "./final-test-view"
import SimulasiSenyawa from "./simulasi-senyawa"
import SimulasiPembentukanIkatan from "./simulasi-pembentukan-ikatan"

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
    if (pathway.type === "simulation") {
      if (pathway.title.includes("Simulasi Senyawa")) {
        return <SimulasiSenyawa pathway={pathway} user={user} />
      }
      if (pathway.title.includes("Simulasi Pembentukan Ikatan Kimia")) {
        return <SimulasiPembentukanIkatan pathway={pathway} user={user} />
      }
      return <div className="text-red-600">Simulasi tidak ditemukan: {pathway.title}</div>
    }

    switch (pathway.type) {
      case "topic":
        return <TopicView pathway={pathway} />
      case "quiz":
        return <QuizView pathway={pathway} user={user} />
      case "final_test":
        return <FinalTestView pathway={pathway} user={user} />
      default:
        return <div>Unknown pathway type</div>
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{renderContent()}</section>
    </main>
  )
}
