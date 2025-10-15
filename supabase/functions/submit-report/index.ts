// 🚨 SUPABASE EDGE FUNCTION: submit-report
// Submit security reports with evidence

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    const { reportedUserId, sessionId, reason, description, evidence } = await req.json()

    // Validate inputs
    if (!reportedUserId || !reason || !description) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
          required: ['reportedUserId', 'reason', 'description']
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Validate reason
    const validReasons = [
      'inappropriate-content',
      'harassment',
      'nudity',
      'threats',
      'spam',
      'fake-profile',
      'underage',
      'other'
    ]

    if (!validReasons.includes(reason)) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid reason',
          validReasons
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Check if user exists
    const { data: reportedUser } = await supabaseClient
      .from('profiles')
      .select('id, username')
      .eq('id', reportedUserId)
      .single()

    if (!reportedUser) {
      return new Response(
        JSON.stringify({ error: 'Reported user not found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      )
    }

    // Determine priority based on reason
    let priority: 'low' | 'medium' | 'high' | 'critical' = 'medium'
    if (['nudity', 'threats', 'underage'].includes(reason)) {
      priority = 'critical'
    } else if (['harassment', 'inappropriate-content'].includes(reason)) {
      priority = 'high'
    }

    // Insert report
    const { data: report, error: reportError } = await supabaseClient
      .from('reports')
      .insert({
        reporter_id: user.id,
        reported_user_id: reportedUserId,
        session_id: sessionId || null,
        reason,
        description,
        evidence: evidence || [],
        priority,
        status: 'pending',
      })
      .select()
      .single()

    if (reportError) {
      throw reportError
    }

    // Update reported user's profile (increment reports_received)
    const { data: reportedProfile } = await supabaseClient
      .from('profiles')
      .select('reports_received, respect_score')
      .eq('id', reportedUserId)
      .single()

    if (reportedProfile) {
      // Reduce respect score for receiving a report
      const scoreReduction = priority === 'critical' ? -30 : priority === 'high' ? -20 : -10
      const newScore = Math.max(0, reportedProfile.respect_score + scoreReduction)

      await supabaseClient
        .from('profiles')
        .update({
          reports_received: reportedProfile.reports_received + 1,
          respect_score: newScore,
        })
        .eq('id', reportedUserId)

      // Log to history
      await supabaseClient
        .from('respect_score_history')
        .insert({
          user_id: reportedUserId,
          change: scoreReduction,
          reason: `Report filed: ${reason}`,
          details: 'Report pending review',
          from_user_id: user.id,
        })
    }

    // If critical priority, check if user should be auto-banned
    if (priority === 'critical' && reportedProfile) {
      const totalReports = reportedProfile.reports_received + 1
      
      // Auto-ban if 3+ critical reports
      if (totalReports >= 3) {
        await supabaseClient
          .from('profiles')
          .update({
            banned: true,
            active: false,
            ban_reason: `Automatic ban: ${totalReports} reports received`,
          })
          .eq('id', reportedUserId)

        // Disconnect if currently online
        await supabaseClient
          .from('online_users')
          .update({ status: 'offline' })
          .eq('user_id', reportedUserId)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Report submitted successfully',
        report: {
          id: report.id,
          priority,
          status: 'pending',
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Submit report error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
