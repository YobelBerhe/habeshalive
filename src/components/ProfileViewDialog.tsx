import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Hash, Star, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProfileViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditProfile: () => void;
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

  const getStars = (score: number) => {
    if (score >= 95) return 5;
    if (score >= 85) return 4;
    if (score >= 70) return 3;
    if (score >= 50) return 2;
    return 1;
  };

  if (loading || !profile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] text-white border-gray-800">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00D9B4]"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const stars = getStars(profile.respect_score);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] text-white border-gray-800 max-w-md">
        <div className="space-y-6 py-4">
          {/* Avatar & Name */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="w-28 h-28 border-4 border-[#00D9B4]/30">
                <AvatarImage src={profile.avatar_url || ''} />
                <AvatarFallback className="bg-gradient-to-br from-[#00D9B4] to-[#00a085] text-black text-3xl font-bold">
                  {profile.username?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              {profile.verified && (
                <div className="absolute -bottom-2 -right-2 bg-[#00D9B4] rounded-full p-1">
                  <Star className="w-5 h-5 text-black fill-black" />
                </div>
              )}
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold">{profile.username}</h2>
              {profile.full_name && <p className="text-gray-400">{profile.full_name}</p>}
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <User className="w-4 h-4" />
                <span>{profile.gender || 'Not specified'}</span>
              </div>
            </div>
          </div>

          {/* Respect Score */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Respect Score</span>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < stars ? 'text-[#00D9B4] fill-[#00D9B4]' : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-[#00D9B4]">
                {profile.respect_score}/100
              </span>
              <span className="text-sm bg-[#00D9B4]/20 text-[#00D9B4] px-3 py-1 rounded-full">
                {profile.respect_tier || 'Good'}
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{getCountryFlag(profile.country)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>Location</span>
                </div>
                <p className="font-medium">
                  {profile.city && `${profile.city}, `}
                  {profile.country || 'Unknown'}
                </p>
              </div>
            </div>

            {profile.email && (
              <div className="border-t border-white/10 pt-3">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </div>
                <p className="font-medium text-sm">{profile.email}</p>
              </div>
            )}
          </div>

          {/* Hashtags */}
          {profile.interests && profile.interests.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Hash className="w-4 h-4" />
                <span>Profile Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((tag) => (
                  <Badge
                    key={tag}
                    className="bg-[#00D9B4]/20 text-[#00D9B4] px-3 py-1.5 rounded-full text-sm font-medium border border-[#00D9B4]/30"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Edit Button (only for own profile) */}
          {!userId && (
            <Button
              onClick={() => {
                onOpenChange(false);
                onEditProfile();
              }}
              className="w-full bg-[#00D9B4] hover:bg-[#00c9a4] text-black font-medium py-6 text-lg rounded-xl"
            >
              Edit Profile
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
