import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import ProfileContent from "@/components/dashboard/profile-content"

export default async function ProfilePage() {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return <ProfileContent user={user} />
}
