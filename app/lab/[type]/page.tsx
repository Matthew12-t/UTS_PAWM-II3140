import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import LabSimulator from "@/components/lab/lab-simulator"

export default async function LabPage({ params }: { params: { type: string } }) {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const validTypes = ["ionic", "covalent", "metallic", "hydrogen"]
  if (!validTypes.includes(params.type)) {
    redirect("/dashboard")
  }

  return <LabSimulator user={user} experimentType={params.type} />
}
