import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import PathwaysContent from "@/components/dashboard/pathways-content"

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return <PathwaysContent user={user} />
}
