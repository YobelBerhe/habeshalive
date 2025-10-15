-- Fix security warnings from linter

-- Add missing RLS policies
DROP POLICY IF EXISTS "Users can view own history" ON public.respect_score_history;
CREATE POLICY "Users can view own history" 
  ON public.respect_score_history FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create reports" ON public.reports;
CREATE POLICY "Users can create reports" 
  ON public.reports FOR INSERT 
  WITH CHECK (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Users can view own reports" ON public.reports;
CREATE POLICY "Users can view own reports" 
  ON public.reports FOR SELECT 
  USING (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Users can view own sessions" ON public.video_sessions;
CREATE POLICY "Users can view own sessions" 
  ON public.video_sessions FOR SELECT 
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

DROP POLICY IF EXISTS "Users can update own sessions" ON public.video_sessions;
CREATE POLICY "Users can update own sessions" 
  ON public.video_sessions FOR UPDATE 
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

DROP POLICY IF EXISTS "Users can insert sessions" ON public.video_sessions;
CREATE POLICY "Users can insert sessions" 
  ON public.video_sessions FOR INSERT 
  WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

DROP POLICY IF EXISTS "Authenticated users can view online users" ON public.online_users;
CREATE POLICY "Authenticated users can view online users" 
  ON public.online_users FOR SELECT 
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update own status" ON public.online_users;
CREATE POLICY "Users can manage own status" 
  ON public.online_users FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Fix function search paths
CREATE OR REPLACE FUNCTION update_respect_tier()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

CREATE OR REPLACE FUNCTION auto_ban_low_score()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.respect_score < 50 AND (OLD.respect_score IS NULL OR OLD.respect_score >= 50) THEN
    NEW.banned := true;
    NEW.ban_reason := 'Automatic ban: Respect score dropped below 50';
    NEW.active := false;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION calculate_session_duration()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.ended_at IS NOT NULL AND NEW.started_at IS NOT NULL THEN
    NEW.duration := EXTRACT(EPOCH FROM (NEW.ended_at - NEW.started_at))::INTEGER;
  END IF;
  RETURN NEW;
END;
$$;