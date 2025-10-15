// Smart matching algorithm with respect score filtering
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      console.error('Auth error:', userError)
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    console.log('Finding match for user:', user.id)

    // Get user's profile
    const { data: userProfile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile error:', profileError)
      throw profileError
    }

    console.log('User profile:', { 
      gender: userProfile.gender, 
      purpose: userProfile.purpose,
      matching_mode: userProfile.matching_mode,
      respect_score: userProfile.respect_score 
    })

    // Check if user can match
    if (userProfile.banned) {
      return new Response(
        JSON.stringify({ error: 'Your account is banned' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        }
      )
    }

    if (userProfile.respect_score < 85) {
      return new Response(
        JSON.stringify({
          error: 'Your respect score is too low to match',
          currentScore: userProfile.respect_score,
          minimumScore: 85,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403,
        }
      )
    }

    // Build query for matching
    let query = supabaseClient
      .from('profiles')
      .select('*')
      .eq('active', true)
      .eq('banned', false)
      .gte('respect_score', 85)
      .neq('id', user.id)

    // Apply gender filter
    if (userProfile.matching_mode === 'same-gender-only') {
      query = query.eq('gender', userProfile.gender)
    } else if (userProfile.matching_mode === 'opposite-only') {
      query = query.neq('gender', userProfile.gender)
    }

    // STEP 1: Try same purpose first
    console.log('Searching for matches with same purpose...')
    let { data: matches } = await query
      .eq('purpose', userProfile.purpose)
      .order('respect_score', { ascending: false })
      .limit(10)

    console.log('Found matches with same purpose:', matches?.length || 0)

    // STEP 2: Filter by online status
    if (matches && matches.length > 0) {
      const { data: onlineUsers } = await supabaseClient
        .from('online_users')
        .select('user_id')
        .eq('status', 'available')
        .in('user_id', matches.map(m => m.id))

      if (onlineUsers && onlineUsers.length > 0) {
        const onlineIds = onlineUsers.map(u => u.user_id)
        matches = matches.filter(m => onlineIds.includes(m.id))
        console.log('Online matches with same purpose:', matches.length)
      } else {
        matches = []
      }
    }

    // STEP 3: Try any purpose if no matches
    if (!matches || matches.length === 0) {
      console.log('Searching for matches with any purpose...')
      query = supabaseClient
        .from('profiles')
        .select('*')
        .eq('active', true)
        .eq('banned', false)
        .gte('respect_score', 85)
        .neq('id', user.id)

      if (userProfile.matching_mode === 'same-gender-only') {
        query = query.eq('gender', userProfile.gender)
      } else if (userProfile.matching_mode === 'opposite-only') {
        query = query.neq('gender', userProfile.gender)
      }

      const { data: anyMatches } = await query
        .order('respect_score', { ascending: false })
        .limit(10)

      console.log('Found matches with any purpose:', anyMatches?.length || 0)

      if (anyMatches && anyMatches.length > 0) {
        const { data: onlineUsers } = await supabaseClient
          .from('online_users')
          .select('user_id')
          .eq('status', 'available')
          .in('user_id', anyMatches.map(m => m.id))

        if (onlineUsers && onlineUsers.length > 0) {
          const onlineIds = onlineUsers.map(u => u.user_id)
          matches = anyMatches.filter(m => onlineIds.includes(m.id))
          console.log('Online matches with any purpose:', matches.length)
        }
      }
    }

    // No matches found
    if (!matches || matches.length === 0) {
      console.log('No matches available')
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

    // Pick random match from top candidates
    const partner = matches[Math.floor(Math.random() * Math.min(matches.length, 3))]
    console.log('Selected partner:', partner.id)

    // Create video session
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
      console.error('Session creation error:', sessionError)
      throw sessionError
    }

    console.log('Session created:', session.id)

    // Update both users to 'in-call' status
    await supabaseClient
      .from('online_users')
      .upsert([
        { user_id: user.id, status: 'in-call', current_session_id: session.id },
        { user_id: partner.id, status: 'in-call', current_session_id: session.id },
      ])

    // Return match
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
    console.error('Error in find-match:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
