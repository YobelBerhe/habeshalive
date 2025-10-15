// 💓 SUPABASE EDGE FUNCTION: update-status
// Update user's online status and heartbeat

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
    const { status, sessionId } = await req.json()

    // Validate status
    const validStatuses = ['available', 'in-call', 'offline']
    if (status && !validStatuses.includes(status)) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid status',
          validStatuses
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Update or insert online status
    const { error: upsertError } = await supabaseClient
      .from('online_users')
      .upsert({
        user_id: user.id,
        status: status || 'available',
        current_session_id: sessionId || null,
        last_heartbeat: new Date().toISOString(),
      })

    if (upsertError) {
      throw upsertError
    }

    // Update profile's last_seen
    await supabaseClient
      .from('profiles')
      .update({ last_seen: new Date().toISOString() })
      .eq('id', user.id)

    // If going offline, clean up any active sessions
    if (status === 'offline') {
      // Update any active sessions where user is a participant
      await supabaseClient
        .from('video_sessions')
        .update({ 
          status: 'ended',
          ended_at: new Date().toISOString()
        })
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .eq('status', 'active')
    }

    // Get online count
    const { count: onlineCount } = await supabaseClient
      .from('online_users')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'available')

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Status updated',
        status: status || 'available',
        onlineCount: onlineCount || 0,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Update status error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
