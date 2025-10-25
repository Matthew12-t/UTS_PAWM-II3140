"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface PathwayCardProps {
  pathway: {
    id: number
    title: string
    description: string
    order_number: number
    type: string
  }
  user: User
  isLocked?: boolean
}

export function PathwayCard({ pathway, user, isLocked = false }: PathwayCardProps) {
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

      setProgress(data)
    }

    fetchProgress()
  }, [pathway.id, user.id, supabase])

  // Log untuk debug
  useEffect(() => {
    console.log(`[PathwayCard ${pathway.order_number}] isLocked:`, isLocked)
  }, [isLocked, pathway.order_number])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "topic":
        return "📚"
      case "simulation":
        return "🔬"
      case "quiz":
        return "❓"
      case "final_test":
        return "🏆"
      default:
        return "📖"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "topic":
        return "Topik"
      case "simulation":
        return "Simulasi"
      case "quiz":
        return "Kuis"
      case "final_test":
        return "Tes Akhir"
      default:
        return "Materi"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "topic":
        return "from-blue-500 to-cyan-500"
      case "simulation":
        return "from-purple-500 to-pink-500"
      case "quiz":
        return "from-orange-500 to-red-500"
      case "final_test":
        return "from-green-500 to-emerald-500"
      default:
        return "from-indigo-500 to-blue-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-300"
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "✓ Selesai"
      case "in_progress":
        return "⏳ Sedang Dikerjakan"
      default:
        return "Belum Dimulai"
    }
  }

  const href = isLocked ? "#" : `/pathway/${pathway.id}`

  return (
    <Link href={href} className={`h-full ${isLocked ? "pointer-events-none" : ""}`}>
      <Card
        className={`h-full p-6 hover:shadow-xl transition-all duration-300 border-0 overflow-hidden group ${
          isLocked ? "bg-gray-100 opacity-60 cursor-not-allowed" : "bg-white cursor-pointer"
        }`}
      >
        {isLocked && (
          <div className="absolute inset-0 bg-black/0 flex items-center justify-center z-20 rounded-lg">
            <div className="text-center">
              <div className="text-5xl mb-2">🔒</div>
            </div>
          </div>
        )}

        <div
          className={`absolute inset-0 bg-gradient-to-br ${getTypeColor(pathway.type)} ${
            isLocked ? "opacity-0" : "opacity-0 group-hover:opacity-5"
          } transition-opacity duration-300`}
        ></div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-14 h-14 rounded-lg bg-gradient-to-br ${getTypeColor(pathway.type)} flex items-center justify-center text-2xl shadow-md`}
              >
                {getTypeIcon(pathway.type)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{pathway.title}</h3>
                <p className="text-xs text-gray-500 font-medium">{getTypeLabel(pathway.type)}</p>
              </div>
            </div>
            {progress && (
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(progress.status)}`}>
                {getStatusLabel(progress.status)}
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{pathway.description}</p>

          {progress?.score && (
            <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
              <p className="text-sm text-gray-700">
                <span className="font-bold text-indigo-600">Skor:</span>{" "}
                <span className="font-semibold">{progress.score}</span>
              </p>
            </div>
          )}

          <Button
            className={`w-full bg-gradient-to-r ${getTypeColor(pathway.type)} hover:shadow-lg transition-all duration-300 text-white font-semibold ${
              isLocked ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={isLocked}
          >
            {progress?.status === "completed" ? "Ulangi" : "Mulai Sekarang"}
          </Button>
        </div>
      </Card>
    </Link>
  )
}
