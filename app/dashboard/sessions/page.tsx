import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import SessionsContent from "@/components/dashboard/sessions-content"

export default async function SessionsPage() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return <SessionsContent user={user} />
}
