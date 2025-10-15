-- Fix remaining security issues

-- Add RLS policies for violations table
DROP POLICY IF EXISTS "Moderators can view violations" ON public.violations;
CREATE POLICY "Users can view own violations" 
  ON public.violations FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can insert violations" ON public.violations;
CREATE POLICY "System can insert violations" 
  ON public.violations FOR INSERT 
  WITH CHECK (true);

-- Add RLS policies for screenshot_attempts table  
DROP POLICY IF EXISTS "Moderators can view screenshot attempts" ON public.screenshot_attempts;
CREATE POLICY "Users can view own screenshot attempts" 
  ON public.screenshot_attempts FOR SELECT 
  USING (auth.uid() = user_id OR auth.uid() = partner_id);

DROP POLICY IF EXISTS "System can insert screenshot attempts" ON public.screenshot_attempts;
CREATE POLICY "System can insert screenshot attempts" 
  ON public.screenshot_attempts FOR INSERT 
  WITH CHECK (true);

-- Fix views by removing SECURITY DEFINER
DROP VIEW IF EXISTS public.platform_stats;
CREATE VIEW public.platform_stats AS
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

DROP VIEW IF EXISTS public.purpose_distribution;
CREATE VIEW public.purpose_distribution AS
SELECT 
  purpose,
  COUNT(*) as user_count,
  ROUND((COUNT(*)::NUMERIC / NULLIF((SELECT COUNT(*) FROM public.profiles), 0) * 100), 2) as percentage
FROM public.profiles
WHERE purpose IS NOT NULL
GROUP BY purpose
ORDER BY user_count DESC;