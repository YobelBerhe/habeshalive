// 🎯 SUPABASE EDGE FUNCTION: end-call
// End video session, process ratings, update respect scores

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Respect score rules
const SCORE_RULES = {
  CALL_COMPLETED: 2,
  RATED_RESPECTFUL: 5,
  LONG_CALL_BONUS: 1, // 15+ minutes
  RATED_INAPPROPRIATE: -20,
  MIN_SCORE: 0,
  MAX_SCORE: 100,
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    // Get request body
    const { sessionId, rating, comment, duration } = await req.json()

    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: 'Session ID is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Get session
    const { data: session, error: sessionError } = await supabaseClient
      .from('video_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .single()

    if (sessionError || !session) {
      return new Response(
        JSON.stringify({ error: 'Session not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      )
    }

    // Determine which user is ending (user1 or user2)
    const isUser1 = session.user1_id === user.id
    const isUser2 = session.user2_id === user.id

    if (!isUser1 && !isUser2) {
      return new Response(
        JSON.stringify({ error: 'Not a participant in this session' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        }
      )
    }

    const partnerId = isUser1 ? session.user2_id : session.user1_id

    // Update session with rating
    const updateData: any = {
      status: 'ended',
      ended_at: new Date().toISOString(),
    }

    if (isUser1) {
      if (rating) updateData.user1_rating = rating
      if (comment) updateData.user1_comment = comment
      if (!session.user1_left_at) updateData.user1_left_at = new Date().toISOString()
    } else {
      if (rating) updateData.user2_rating = rating
      if (comment) updateData.user2_comment = comment
      if (!session.user2_left_at) updateData.user2_left_at = new Date().toISOString()
    }

    await supabaseClient
      .from('video_sessions')
      .update(updateData)
      .eq('id', session.id)

    // Calculate call duration if not provided
    const callDuration = duration || (session.started_at 
      ? Math.floor((new Date().getTime() - new Date(session.started_at).getTime()) / 1000)
      : 0)

    // Update current user's profile (call completed)
    const { data: myProfile } = await supabaseClient
      .from('profiles')
      .select('respect_score, completed_calls, total_calls, average_call_duration')
      .eq('id', user.id)
      .single()

    if (myProfile) {
      let myScoreChange = SCORE_RULES.CALL_COMPLETED

      // Bonus for long calls (15+ minutes)
      if (callDuration >= 900) {
        myScoreChange += SCORE_RULES.LONG_CALL_BONUS
      }

      const newMyScore = Math.min(
        SCORE_RULES.MAX_SCORE,
        Math.max(SCORE_RULES.MIN_SCORE, myProfile.respect_score + myScoreChange)
      )

      const newAvgDuration = 
        (myProfile.average_call_duration * myProfile.completed_calls + callDuration) / 
        (myProfile.completed_calls + 1)

      await supabaseClient
        .from('profiles')
        .update({
          respect_score: newMyScore,
          completed_calls: myProfile.completed_calls + 1,
          total_calls: myProfile.total_calls + 1,
          average_call_duration: Math.round(newAvgDuration),
        })
        .eq('id', user.id)

      // Log to history
      await supabaseClient
        .from('respect_score_history')
        .insert({
          user_id: user.id,
          change: myScoreChange,
          reason: callDuration >= 900 
            ? 'Call completed (15+ minutes bonus)'
            : 'Call completed',
          details: `Call duration: ${Math.floor(callDuration / 60)} minutes`,
        })
    }

    // Update partner's score based on rating
    if (rating && partnerId) {
      const { data: partnerProfile } = await supabaseClient
        .from('profiles')
        .select('respect_score')
        .eq('id', partnerId)
        .single()

      if (partnerProfile) {
        let scoreChange = 0
        let reason = ''

        if (rating === 'respectful') {
          scoreChange = SCORE_RULES.RATED_RESPECTFUL
          reason = 'Rated respectful by partner'
        } else if (rating === 'inappropriate') {
          scoreChange = SCORE_RULES.RATED_INAPPROPRIATE
          reason = 'Rated inappropriate by partner'
        }

        if (scoreChange !== 0) {
          const newPartnerScore = Math.min(
            SCORE_RULES.MAX_SCORE,
            Math.max(SCORE_RULES.MIN_SCORE, partnerProfile.respect_score + scoreChange)
          )

          await supabaseClient
            .from('profiles')
            .update({ respect_score: newPartnerScore })
            .eq('id', partnerId)

          // Log to partner's history
          await supabaseClient
            .from('respect_score_history')
            .insert({
              user_id: partnerId,
              change: scoreChange,
              reason,
              from_user_id: user.id,
              details: comment || undefined,
            })
        }
      }
    }

    // Update online status back to available
    await supabaseClient
      .from('online_users')
      .update({ 
        status: 'available', 
        current_session_id: null 
      })
      .eq('user_id', user.id)

    // Get updated scores
    const { data: updatedMyProfile } = await supabaseClient
      .from('profiles')
      .select('respect_score, respect_tier')
      .eq('id', user.id)
      .single()

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Call ended successfully',
        yourScore: updatedMyProfile?.respect_score || 100,
        yourTier: updatedMyProfile?.respect_tier || 'perfect',
        callDuration,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('End call error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
