import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { pathwayId, completed } = await request.json()

    console.log('[API] Request:', { pathwayId, completed })

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    console.log('[API] User:', user?.id)
    
    if (userError || !user) {
      console.error('[API] Auth error:', userError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if progress exists
    const { data: existingProgress } = await supabase
      .from('user_pathway_progress')
      .select('id')
      .eq('user_id', user.id)
      .eq('pathway_id', pathwayId)
      .single()

    console.log('[API] Existing progress:', existingProgress)

    let progressResult

    if (existingProgress) {
      // Update existing progress
      const { data, error } = await supabase
        .from('user_pathway_progress')
        .update({
          status: completed ? 'completed' : 'in_progress',
          completed_at: completed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingProgress.id)
        .select()

      progressResult = { data, error }
    } else {
      // Insert new progress
      const { data, error } = await supabase
        .from('user_pathway_progress')
        .insert({
          user_id: user.id,
          pathway_id: pathwayId,
          status: completed ? 'completed' : 'in_progress',
          completed_at: completed ? new Date().toISOString() : null
        })
        .select()

      progressResult = { data, error }
    }

    console.log('[API] Progress result:', progressResult)

    if (progressResult.error) {
      console.error('[API] Progress error:', progressResult.error)
      return NextResponse.json(
        { error: progressResult.error.message },
        { status: 500 }
      )
    }

    // Cari pathway selanjutnya berdasarkan order_number
    const { data: currentPathway } = await supabase
      .from('pathways')
      .select('order_number')
      .eq('id', pathwayId)
      .single()

    console.log('[API] Current pathway:', currentPathway)

    const { data: nextPathway } = await supabase
      .from('pathways')
      .select('id')
      .gt('order_number', currentPathway?.order_number || 0)
      .order('order_number', { ascending: true })
      .limit(1)
      .maybeSingle()

    console.log('[API] Next pathway:', nextPathway)

    return NextResponse.json({
      success: true,
      nextPathwayId: nextPathway?.id || null
    })
  } catch (error) {
    console.error('[API] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update progress' },
      { status: 500 }
    )
  }
}
