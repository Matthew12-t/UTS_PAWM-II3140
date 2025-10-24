"use client"

import type { User } from "@supabase/supabase-js"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function SettingsContent({ user }: { user: User }) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
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
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Account Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Account Settings</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Email</p>
                <p className="text-gray-900">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Account Created</p>
                <p className="text-gray-900">{new Date(user.created_at || "").toLocaleDateString()}</p>
              </div>
            </div>
          </Card>

          {/* Preferences */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Preferences</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-gray-900">Email notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                <span className="text-gray-900">Show progress tips</span>
              </label>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 border-red-200 bg-red-50">
            <h2 className="text-xl font-bold text-red-900 mb-4">Danger Zone</h2>
            <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">
              Logout
            </Button>
          </Card>
        </div>
      </main>
    </div>
  )
}
