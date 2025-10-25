import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { pathwayId, status, score } = await request.json()

    console.log('[API] Request:', { pathwayId, status, score })

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    console.log('[API] User:', user?.id)
    
    if (userError || !user) {
      console.error('[API] Auth error:', userError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: existingProgress } = await supabase
      .from('user_pathway_progress')
      .select('id, status')
      .eq('user_id', user.id)
      .eq('pathway_id', pathwayId)
      .single()

    console.log('[API] Existing progress:', existingProgress)

    let progressResult

    if (existingProgress) {
      const updateData: any = {
        status: status || 'completed',
        updated_at: new Date().toISOString()
      }
      
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString()
      }
      
      if (score !== undefined) {
        updateData.score = score
      }

      const { data, error } = await supabase
        .from('user_pathway_progress')
        .update(updateData)
        .eq('id', existingProgress.id)
        .select()

      progressResult = { data, error }
    } else {
      // Insert new progress
      const insertData: any = {
        user_id: user.id,
        pathway_id: pathwayId,
        status: status || 'completed'
      }
      
      if (status === 'completed') {
        insertData.completed_at = new Date().toISOString()
      }
      
      if (score !== undefined) {
        insertData.score = score
      }

      const { data, error } = await supabase
        .from('user_pathway_progress')
        .insert(insertData)
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

    // Update user_progress
    const wasNotCompleted = !existingProgress || existingProgress.status !== 'completed'
    const isNowCompleted = status === 'completed'
    
    if (wasNotCompleted && isNowCompleted) {
      const { count: totalPathways } = await supabase
        .from('pathways')
        .select('*', { count: 'exact', head: true })

      const { count: completedPathways } = await supabase
        .from('user_pathway_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'completed')
        
      const { data: progressData } = await supabase
        .from('user_pathway_progress')
        .select('score')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .not('score', 'is', null)

      const scores = progressData?.map(p => p.score).filter(s => s !== null) || []
      const averageScore = scores.length > 0 
        ? scores.reduce((a, b) => a + b, 0) / scores.length 
        : 0

      console.log('[API] Statistics:', { 
        totalPathways, 
        completedPathways, 
        averageScore 
      })

      const { data: existingUserProgress } = await supabase
        .from('user_progress')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (existingUserProgress) {
        await supabase
          .from('user_progress')
          .update({
            total_experiments: totalPathways || 0,
            completed_experiments: completedPathways || 0,
            total_score: Math.round(averageScore * (completedPathways || 0)),
            average_score: averageScore,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingUserProgress.id)
      } else {
        await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            total_experiments: totalPathways || 0,
            completed_experiments: completedPathways || 0,
            total_score: Math.round(averageScore * (completedPathways || 0)),
            average_score: averageScore
          })
      }

      console.log('[API] User progress updated successfully')
    }

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
      message: 'Progress updated successfully',
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
