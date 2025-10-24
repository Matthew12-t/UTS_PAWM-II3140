import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import PathwayContent from "@/components/pathway/pathway-content"

export default async function PathwayPage({ params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const pathwayId = Number.parseInt(params.id)

  // Fetch pathway data
  const { data: pathway } = await supabase.from("pathways").select("*").eq("id", pathwayId).single()

  if (!pathway) {
    redirect("/dashboard")
  }

  if (pathway.order_number > 1) {
    const { data: previousPathway } = await supabase
      .from("pathways")
      .select("id")
      .eq("order_number", pathway.order_number - 1)
      .single()

    if (previousPathway) {
      const { data: previousProgress } = await supabase
        .from("user_pathway_progress")
        .select("status")
        .eq("user_id", user.id)
        .eq("pathway_id", previousPathway.id)
        .single()

      if (!previousProgress || previousProgress.status !== "completed") {
        redirect("/dashboard")
      }
    }
  }

  return <PathwayContent user={user} pathway={pathway} />
}
