import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import SettingsContent from "@/components/dashboard/settings-content"

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return <SettingsContent user={user} />
}
