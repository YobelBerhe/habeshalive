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

    const { data: userProfile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      throw profileError
    }

    if (userProfile.banned) {
      return new Response(
        JSON.stringify({ error: 'Your account is banned' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        }
      )
    }

    if ((userProfile.respect_score || 100) < 85) {
      return new Response(
        JSON.stringify({
          error: 'Your respect score is too low to match',
          minimumScore: 85,
          currentScore: userProfile.respect_score || 100,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        }
      )
    }

    let genderFilter: any = {}
    if (userProfile.matching_mode === 'same-gender-only') {
      genderFilter = { gender: userProfile.gender }
    } else if (userProfile.matching_mode === 'opposite-only') {
      genderFilter = { gender: userProfile.gender === 'male' ? 'female' : 'male' }
    }

    let { data: matches } = await supabaseClient
      .from('profiles')
      .select('*')
      .match({
        purpose: userProfile.purpose,
        active: true,
        banned: false,
        ...genderFilter,
      })
      .gte('respect_score', 85)
      .neq('id', user.id)
      .order('respect_score', { ascending: false })
      .limit(10)

    if (matches && matches.length > 0) {
      const { data: onlineUsers } = await supabaseClient
        .from('online_users')
        .select('user_id')
        .eq('status', 'available')
        .in('user_id', matches.map(m => m.id))

      if (onlineUsers && onlineUsers.length > 0) {
        const onlineIds = onlineUsers.map(u => u.user_id)
        matches = matches.filter(m => onlineIds.includes(m.id))
      } else {
        matches = []
      }
    }

    if (!matches || matches.length === 0) {
      let { data: anyMatches } = await supabaseClient
        .from('profiles')
        .select('*')
        .match({
          active: true,
          banned: false,
          ...genderFilter,
        })
        .gte('respect_score', 85)
        .neq('id', user.id)
        .order('respect_score', { ascending: false })
        .limit(10)

      if (anyMatches && anyMatches.length > 0) {
        const { data: onlineUsers } = await supabaseClient
          .from('online_users')
          .select('user_id')
          .eq('status', 'available')
          .in('user_id', anyMatches.map(m => m.id))

        if (onlineUsers && onlineUsers.length > 0) {
          const onlineIds = onlineUsers.map(u => u.user_id)
          matches = anyMatches.filter(m => onlineIds.includes(m.id))
        }
      }
    }

    if (!matches || matches.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'No matches found',
          message: 'No users available matching your preferences. Try again later.',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        }
      )
    }

    const partner = matches[Math.floor(Math.random() * Math.min(matches.length, 3))]
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const { data: session, error: sessionError } = await supabaseClient
      .from('video_sessions')
      .insert({
        session_id: sessionId,
        user1_id: user.id,
        user2_id: partner.id,
        purpose: userProfile.purpose,
        status: 'waiting',
        user1_joined_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (sessionError) {
      throw sessionError
    }

    await supabaseClient
      .from('online_users')
      .upsert([
        { user_id: user.id, status: 'in-call', current_session_id: session.id },
        { user_id: partner.id, status: 'in-call', current_session_id: session.id },
      ])

    return new Response(
      JSON.stringify({
        success: true,
        partner: {
          id: partner.id,
          username: partner.username,
          firstName: partner.first_name,
          age: partner.age,
          gender: partner.gender,
          ethnicity: partner.ethnicity,
          purpose: partner.purpose,
          languages: partner.languages,
          interests: partner.interests,
          respectScore: partner.respect_score,
          respectTier: partner.respect_tier,
        },
        session: {
          id: session.id,
          sessionId: session.session_id,
          purpose: session.purpose,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Find match error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'An error occurred' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})