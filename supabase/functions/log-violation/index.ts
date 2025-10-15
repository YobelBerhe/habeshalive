// 🤖 SUPABASE EDGE FUNCTION: log-violation
// Log AI-detected violations and update respect scores

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Violation score penalties
const VIOLATION_PENALTIES = {
  nudity: {
    low: -20,
    medium: -40,
    high: -60,
    critical: -80,
  },
  weapon: {
    low: -30,
    medium: -50,
    high: -70,
    critical: -90,
  },
  modesty: {
    low: -10,
    medium: -20,
    high: -40,
    critical: -60,
  },
  gesture: {
    low: -15,
    medium: -25,
    high: -50,
    critical: -70,
  },
  object: {
    low: -10,
    medium: -20,
    high: -30,
    critical: -50,
  },
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
    const { 
      violatorUserId, 
      sessionId, 
      type, 
      severity, 
      confidence, 
      evidence, 
      aiModel, 
      actionTaken 
    } = await req.json()

    // Validate inputs
    if (!violatorUserId || !type || !severity || confidence === undefined) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
          required: ['violatorUserId', 'type', 'severity', 'confidence']
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Validate type and severity
    const validTypes = ['nudity', 'weapon', 'modesty', 'gesture', 'object']
    const validSeverities = ['low', 'medium', 'high', 'critical']

    if (!validTypes.includes(type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid violation type', validTypes }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    if (!validSeverities.includes(severity)) {
      return new Response(
        JSON.stringify({ error: 'Invalid severity', validSeverities }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Calculate respect score penalty
    const scorePenalty = (VIOLATION_PENALTIES as any)[type]?.[severity] || -20

    // Insert violation record
    const { data: violation, error: violationError } = await supabaseClient
      .from('violations')
      .insert({
        user_id: violatorUserId,
        session_id: sessionId || null,
        type,
        severity,
        confidence,
        evidence: evidence || [],
        ai_model: aiModel || 'Unknown',
        action_taken: actionTaken || 'warn',
        respect_score_change: scorePenalty,
      })
      .select()
      .single()

    if (violationError) {
      throw violationError
    }

    // Update violator's respect score
    const { data: violatorProfile } = await supabaseClient
      .from('profiles')
      .select('respect_score, username')
      .eq('id', violatorUserId)
      .single()

    if (violatorProfile) {
      const newScore = Math.max(0, Math.min(100, violatorProfile.respect_score + scorePenalty))

      await supabaseClient
        .from('profiles')
        .update({ respect_score: newScore })
        .eq('id', violatorUserId)

      // Log to history
      await supabaseClient
        .from('respect_score_history')
        .insert({
          user_id: violatorUserId,
          change: scorePenalty,
          reason: `AI violation detected: ${type} (${severity})`,
          details: `${aiModel} detected violation with ${Math.round(confidence * 100)}% confidence. Action: ${actionTaken}`,
        })

      // Check if user should be banned (score < 50)
      if (newScore < 50) {
        await supabaseClient
          .from('profiles')
          .update({
            banned: true,
            active: false,
            ban_reason: `Automatic ban: Respect score dropped to ${newScore} after ${type} violation`,
          })
          .eq('id', violatorUserId)

        // Disconnect if currently online
        await supabaseClient
          .from('online_users')
          .update({ status: 'offline' })
          .eq('user_id', violatorUserId)
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Violation logged successfully',
          violation: {
            id: violation.id,
            type,
            severity,
            scorePenalty,
          },
          user: {
            id: violatorUserId,
            username: violatorProfile.username,
            newScore,
            banned: newScore < 50,
          },
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Violation logged',
        violation: {
          id: violation.id,
          type,
          severity,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Log violation error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
