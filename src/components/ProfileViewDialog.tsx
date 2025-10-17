import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle, Settings, MessageCircle, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProfileViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditProfile: () => void;
  onOpenSettings: () => void;
  onOpenContactUs: () => void;
  userId?: string;
}

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  gender: string | null;
  country: string | null;
  city: string | null;
  email: string | null;
  interests: string[] | null;
  respect_score: number;
  respect_tier: string;
  verified: boolean;
}

export function ProfileViewDialog({ 
  open, 
  onOpenChange, 
  onEditProfile,
  onOpenSettings,
  onOpenContactUs,
  userId 
}: ProfileViewDialogProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (open) {
      loadProfile();
    }
  }, [open, userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      
      const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
      if (!targetUserId) return;

      const { data: { user } } = await supabase.auth.getUser();
      const userEmail = user?.email || '';

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();

      if (error) throw error;
      
      // Use username if available, otherwise use first part of email
      let displayName = data.username;
      if (!displayName && userEmail) {
        displayName = userEmail.split('@')[0];
      }

      // Get country from IP if not set
      let country = data.country;
      if (!country) {
        try {
          const ipResponse = await fetch('https://ipapi.co/json/');
          const ipData = await ipResponse.json();
          country = ipData.country_name;
          
          // Optionally save it to profile
          await supabase
            .from('profiles')
            .update({ country: country })
            .eq('id', targetUserId);
        } catch (e) {
          console.error('Error fetching country:', e);
        }
      }
      
      setProfile({ ...data, username: displayName, country: country } as UserProfile);
      
      // Check online status
      const { data: onlineData } = await supabase
        .from('online_users')
        .select('status')
        .eq('user_id', targetUserId)
        .single();
      
      setIsOnline(onlineData?.status === 'available');
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCountryFlag = (country: string | null) => {
    if (!country) return '🌍';
    const flags: Record<string, string> = {
      'United States': '🇺🇸', 'United Kingdom': '🇬🇧', 'Canada': '🇨🇦',
      'Germany': '🇩🇪', 'France': '🇫🇷', 'Italy': '🇮🇹',
      'Ethiopia': '🇪🇹', 'Eritrea': '🇪🇷', 'Sweden': '🇸🇪', 'Norway': '🇳🇴'
    };
    return flags[country] || '🌍';
  };

  const generateUserCode = (userId: string) => {
    // Generate a unique code from user ID (first 12 chars)
    return userId.replace(/-/g, '').substring(0, 12);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to log out");
    }
  };

  if (loading || !profile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-habesha-gradient text-habesha-cream border-habesha-border max-w-sm">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-habesha-gold"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const userCode = generateUserCode(profile.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-habesha-gradient text-habesha-cream border-habesha-border max-w-sm p-0 gap-0">
        {/* Habesha Cultural Header Pattern */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-habesha-gold via-habesha-hover-gold to-habesha-gold opacity-80"></div>
        
        {/* User Info Header */}
        <div className="p-6 border-b border-habesha-border">
          <div 
            className="flex items-center gap-3 mb-3 cursor-pointer hover:bg-habesha-gold/10 rounded-lg p-2 -m-2 transition-colors"
            onClick={() => {
              onOpenChange(false);
              onEditProfile();
            }}
          >
            <div className="relative">
              <Avatar className="w-12 h-12 border-2 border-habesha-gold/30">
                <AvatarImage src={profile.avatar_url || ''} />
                <AvatarFallback className="bg-gradient-to-br from-habesha-gold to-habesha-hover-gold text-habesha-bg font-bold">
                  {profile.username?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              {isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-habesha-bg rounded-full"></div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-habesha-cream">{profile.username}</h3>
              <div className="flex items-center gap-1 text-sm text-habesha-cream/70">
                <span className="text-xl">{getCountryFlag(profile.country)}</span>
                <span>{profile.country || 'Unknown'}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-habesha-dark/50 rounded-lg px-3 py-2 flex items-center justify-between border border-habesha-border">
            <span className="text-xs text-habesha-cream/60">Code</span>
            <span className="text-sm font-mono text-habesha-gold">{userCode}</span>
          </div>
        </div>

        {/* Menu Actions */}
        <div className="p-2">
          <button
            onClick={() => {
              onOpenChange(false);
              onEditProfile();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-habesha-gold/10 rounded-lg transition-colors text-left"
          >
            <UserCircle className="w-5 h-5 text-habesha-gold" />
            <span className="font-medium text-habesha-cream">Edit Profile</span>
          </button>

          <button
            onClick={() => {
              onOpenChange(false);
              onOpenSettings();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-habesha-gold/10 rounded-lg transition-colors text-left"
          >
            <Settings className="w-5 h-5 text-habesha-gold" />
            <span className="font-medium text-habesha-cream">More</span>
          </button>

          <button
            onClick={() => {
              onOpenChange(false);
              onOpenContactUs();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-habesha-gold/10 rounded-lg transition-colors text-left"
          >
            <MessageCircle className="w-5 h-5 text-habesha-gold" />
            <span className="font-medium text-habesha-cream">Contact us</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-habesha-gold/10 rounded-lg transition-colors text-left"
          >
            <LogOut className="w-5 h-5 text-habesha-gold" />
            <span className="font-medium text-habesha-cream">Log out</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
