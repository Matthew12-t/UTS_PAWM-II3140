"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface LabSession {
  id: string
  title: string
  description: string
  status: string
  started_at: string
  completed_at: string | null
  created_at: string
}

export default function SessionsContent({ user }: { user: User }) {
  const [sessions, setSessions] = useState<LabSession[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchSessions = async () => {
      const { data } = await supabase
        .from("lab_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (data) {
        setSessions(data)
      }
      setLoading(false)
    }

    fetchSessions()
  }, [user.id, supabase])

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
          <h1 className="text-3xl font-bold text-gray-900">Lab Sessions</h1>
          <p className="text-gray-600 text-sm mt-1">View and manage your lab sessions</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-12 text-gray-500">Loading sessions...</div>
          ) : sessions.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No sessions yet. Start an experiment to create a session!
            </div>
          ) : (
            sessions.map((session) => (
              <Card key={session.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{session.title}</h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      session.status === "completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {session.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{session.description}</p>
                <p className="text-xs text-gray-500 mb-4">
                  Started: {new Date(session.started_at).toLocaleDateString()}
                </p>
                <Button variant="outline" className="w-full bg-transparent">
                  View Details
                </Button>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
