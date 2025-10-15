-- 🗄️ HABESHLIVE - COMPLETE DATABASE SCHEMA (Fixed)
-- Extending profiles and creating new tables

-- ============================================
-- 1. UPDATE PROFILES TABLE
-- ============================================

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS birthday JSONB,
ADD COLUMN IF NOT EXISTS age INTEGER CHECK (age >= 18 AND age <= 120),
ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('male', 'female', 'non-binary')),
ADD COLUMN IF NOT EXISTS ethnicity TEXT DEFAULT 'habesha',
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS purpose TEXT CHECK (purpose IN (
  'language-practice', 'friendship', 'cultural-exchange',
  'diaspora-connect', 'business-networking', 'just-chat'
)),
ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS matching_mode TEXT DEFAULT 'same-gender-only' 
  CHECK (matching_mode IN ('both', 'same-gender-only', 'opposite-only')),
ADD COLUMN IF NOT EXISTS respect_score INTEGER DEFAULT 100 CHECK (respect_score >= 0 AND respect_score <= 100),
ADD COLUMN IF NOT EXISTS respect_tier TEXT DEFAULT 'perfect' 
  CHECK (respect_tier IN ('banned', 'warning', 'good', 'great', 'perfect')),
ADD COLUMN IF NOT EXISTS total_calls INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS completed_calls INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS skipped_calls INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS reports_received INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS reports_confirmed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS compliments_received INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS average_call_duration NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_blur BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS screenshot_watermark BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS modesty_filter BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS respect_score_visible BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS id_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS banned BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ban_reason TEXT,
ADD COLUMN IF NOT EXISTS ban_expires TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_seen TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_profiles_respect_score ON public.profiles(respect_score DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_purpose_score ON public.profiles(purpose, respect_score DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_gender_purpose ON public.profiles(gender, purpose);
CREATE INDEX IF NOT EXISTS idx_profiles_active_banned ON public.profiles(active, banned);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- ============================================
-- 2-7. CREATE NEW TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS public.respect_score_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  change INTEGER NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  from_user_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.video_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  user1_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user1_joined_at TIMESTAMPTZ,
  user1_left_at TIMESTAMPTZ,
  user2_joined_at TIMESTAMPTZ,
  user2_left_at TIMESTAMPTZ,
  purpose TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'ended')),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  duration INTEGER,
  user1_rating TEXT CHECK (user1_rating IN ('respectful', 'neutral', 'inappropriate')),
  user1_comment TEXT,
  user2_rating TEXT CHECK (user2_rating IN ('respectful', 'neutral', 'inappropriate')),
  user2_comment TEXT,
  watermark_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
  evidence_saved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.video_sessions(id),
  reason TEXT NOT NULL CHECK (reason IN (
    'inappropriate-content', 'harassment', 'nudity', 'threats',
    'spam', 'fake-profile', 'underage', 'other'
  )),
  description TEXT NOT NULL,
  evidence TEXT[],
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under-review', 'resolved', 'dismissed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  moderator_id UUID REFERENCES public.profiles(id),
  moderator_notes TEXT,
  resolution TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.video_sessions(id),
  type TEXT NOT NULL CHECK (type IN ('nudity', 'weapon', 'modesty', 'gesture', 'object')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  confidence NUMERIC NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  evidence TEXT[],
  ai_model TEXT NOT NULL,
  action_taken TEXT NOT NULL CHECK (action_taken IN ('warn', 'blur', 'disconnect')),
  respect_score_change INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.screenshot_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES public.profiles(id),
  session_id UUID REFERENCES public.video_sessions(id),
  method TEXT NOT NULL,
  attempt_number INTEGER NOT NULL,
  watermark_id TEXT,
  respect_score_change INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.online_users (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'in-call', 'offline')),
  current_session_id UUID REFERENCES public.video_sessions(id),
  last_heartbeat TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.respect_score_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screenshot_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.online_users ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_respect_history_user ON public.respect_score_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_user1 ON public.video_sessions(user1_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_user2 ON public.video_sessions(user2_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON public.video_sessions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_session_id ON public.video_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_reports_reported_user ON public.reports(reported_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_status_priority ON public.reports(status, priority, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_violations_user ON public.violations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_violations_severity ON public.violations(severity, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_screenshot_attempts_user ON public.screenshot_attempts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_online_users_status ON public.online_users(status, last_heartbeat DESC);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_respect_tier()
RETURNS TRIGGER AS $$
BEGIN
  NEW.respect_tier := CASE
    WHEN NEW.respect_score >= 95 THEN 'perfect'
    WHEN NEW.respect_score >= 85 THEN 'great'
    WHEN NEW.respect_score >= 70 THEN 'good'
    WHEN NEW.respect_score >= 50 THEN 'warning'
    ELSE 'banned'
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_respect_tier_trigger ON public.profiles;
CREATE TRIGGER update_respect_tier_trigger
  BEFORE INSERT OR UPDATE OF respect_score ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_respect_tier();

CREATE OR REPLACE FUNCTION auto_ban_low_score()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.respect_score < 50 AND (OLD.respect_score IS NULL OR OLD.respect_score >= 50) THEN
    NEW.banned := true;
    NEW.ban_reason := 'Automatic ban: Respect score dropped below 50';
    NEW.active := false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS auto_ban_trigger ON public.profiles;
CREATE TRIGGER auto_ban_trigger
  BEFORE INSERT OR UPDATE OF respect_score ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION auto_ban_low_score();

CREATE OR REPLACE FUNCTION calculate_session_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ended_at IS NOT NULL AND NEW.started_at IS NOT NULL THEN
    NEW.duration := EXTRACT(EPOCH FROM (NEW.ended_at - NEW.started_at))::INTEGER;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS calculate_duration_trigger ON public.video_sessions;
CREATE TRIGGER calculate_duration_trigger
  BEFORE UPDATE OF ended_at ON public.video_sessions
  FOR EACH ROW EXECUTE FUNCTION calculate_session_duration();

DROP TRIGGER IF EXISTS update_sessions_updated_at ON public.video_sessions;
CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON public.video_sessions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- ANALYTICS VIEWS
-- ============================================

CREATE OR REPLACE VIEW public.platform_stats AS
SELECT
  (SELECT COUNT(*) FROM public.profiles) as total_users,
  (SELECT COUNT(*) FROM public.profiles WHERE active = true) as active_users,
  (SELECT COUNT(*) FROM public.profiles WHERE banned = true) as banned_users,
  (SELECT COUNT(*) FROM public.online_users WHERE status = 'available') as online_users,
  (SELECT COUNT(*) FROM public.video_sessions) as total_sessions,
  (SELECT COUNT(*) FROM public.video_sessions WHERE status = 'active') as active_sessions,
  (SELECT AVG(duration) FROM public.video_sessions WHERE duration IS NOT NULL) as avg_session_duration,
  (SELECT AVG(respect_score) FROM public.profiles) as avg_respect_score,
  (SELECT COUNT(*) FROM public.reports WHERE status = 'pending') as pending_reports,
  (SELECT COUNT(*) FROM public.violations WHERE created_at > NOW() - INTERVAL '24 hours') as violations_today;

CREATE OR REPLACE VIEW public.purpose_distribution AS
SELECT 
  purpose,
  COUNT(*) as user_count,
  ROUND((COUNT(*)::NUMERIC / NULLIF((SELECT COUNT(*) FROM public.profiles), 0) * 100), 2) as percentage
FROM public.profiles
WHERE purpose IS NOT NULL
GROUP BY purpose
ORDER BY user_count DESC;