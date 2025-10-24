"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

interface UserProfile {
  full_name: string
  email: string
  avatar_url: string | null
}

export default function ProfileContent({ user }: { user: User }) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState("")
  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase.from("user_profiles").select("*").eq("id", user.id).single()

      if (data) {
        setProfile(data)
        setFullName(data.full_name || "")
      }
      setLoading(false)
    }

    fetchProfile()
  }, [user.id, supabase])

  const handleUpdateProfile = async () => {
    const { error } = await supabase.from("user_profiles").update({ full_name: fullName }).eq("id", user.id)

    if (!error) {
      setProfile({ ...profile!, full_name: fullName })
      setEditing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/dashboard"
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mb-2 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading profile...</div>
        ) : (
          <Card className="p-8">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user.user_metadata?.full_name?.charAt(0) || "U"}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{profile?.full_name || "User"}</h2>
                <p className="text-gray-600">{profile?.email}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {editing ? (
                  <div className="flex gap-2">
                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="flex-1" />
                    <Button onClick={handleUpdateProfile} className="bg-indigo-600 hover:bg-indigo-700">
                      Save
                    </Button>
                    <Button onClick={() => setEditing(false)} variant="outline">
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <p className="text-gray-900">{profile?.full_name || "Not set"}</p>
                    <Button onClick={() => setEditing(true)} variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="p-3 bg-slate-50 rounded-lg text-gray-900">{profile?.email}</div>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}
