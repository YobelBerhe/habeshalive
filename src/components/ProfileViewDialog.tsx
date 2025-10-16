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

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();

      if (error) throw error;
      setProfile(data as UserProfile);
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
        <DialogContent className="bg-black/95 text-white border-none max-w-sm">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D9B4]"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const userCode = generateUserCode(profile.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/95 backdrop-blur-xl text-white border-none max-w-sm p-0 gap-0">
        {/* User Info Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-12 h-12 border-2 border-white/20">
              <AvatarImage src={profile.avatar_url || ''} />
              <AvatarFallback className="bg-gradient-to-br from-[#00D9B4] to-[#00a085] text-black font-bold">
                {profile.username?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{profile.username}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className="text-xl">{getCountryFlag(profile.country)}</span>
                <span>{profile.country || 'Unknown'}</span>
                <span>•</span>
                <span>{profile.gender || 'Not specified'}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg px-3 py-2 flex items-center justify-between">
            <span className="text-xs text-gray-400">Code</span>
            <span className="text-sm font-mono text-white">{userCode}</span>
          </div>
        </div>

        {/* Menu Actions */}
        <div className="p-2">
          <button
            onClick={() => {
              onOpenChange(false);
              onEditProfile();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition-colors text-left"
          >
            <UserCircle className="w-5 h-5 text-gray-400" />
            <span className="font-medium">Edit Profile</span>
          </button>

          <button
            onClick={() => {
              onOpenChange(false);
              onOpenSettings();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition-colors text-left"
          >
            <Settings className="w-5 h-5 text-gray-400" />
            <span className="font-medium">More</span>
          </button>

          <button
            onClick={() => {
              onOpenChange(false);
              onOpenContactUs();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition-colors text-left"
          >
            <MessageCircle className="w-5 h-5 text-gray-400" />
            <span className="font-medium">Contact us</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition-colors text-left"
          >
            <LogOut className="w-5 h-5 text-gray-400" />
            <span className="font-medium">Log out</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
