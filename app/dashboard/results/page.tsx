import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import ResultsContent from "@/components/dashboard/results-content"

export default async function ResultsPage() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return <ResultsContent user={user} />
}
