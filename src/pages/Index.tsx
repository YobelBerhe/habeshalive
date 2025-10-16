import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { AuthDialog } from "@/components/AuthDialog";
import { ProfileViewDialog } from "@/components/ProfileViewDialog";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { SettingsDialog } from "@/components/SettingsDialog";
import { ManageAccountDialog } from "@/components/ManageAccountDialog";
import { ContactUsDialog } from "@/components/ContactUsDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video, Users, Shield, Sparkles, Globe, Menu, User, Settings as SettingsIcon } from "lucide-react";
import { RotatingGlobe } from "@/components/RotatingGlobe";

export default function Index() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showEditProfileDialog, setShowEditProfileDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showManageAccountDialog, setShowManageAccountDialog] = useState(false);
  const [showContactUsDialog, setShowContactUsDialog] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    if (session?.user) {
      loadProfile(session.user.id);
    }
  };

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleStartChat = () => {
    if (!user) {
      setShowAuthDialog(true);
    } else {
      navigate('/video-chat');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="text-3xl">🌍</div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-yellow-500 bg-clip-text text-transparent">
                HabeshLive
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  {/* User Profile Button */}
                  <button
                    onClick={() => setShowProfileDialog(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <Avatar className="w-8 h-8 border-2 border-[#00D9B4]/50">
                      <AvatarImage src={profile?.avatar_url || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-[#00D9B4] to-[#00a085] text-black text-sm font-bold">
                        {profile?.username?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-white font-medium">{profile?.username || 'User'}</span>
                  </button>

                  {/* Settings Button */}
                  <button
                    onClick={() => setShowSettingsDialog(true)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <SettingsIcon className="w-6 h-6 text-white" />
                  </button>
                </>
              ) : (
                <Button
                  onClick={() => setShowAuthDialog(true)}
                  className="bg-gradient-to-r from-green-400 to-yellow-500 hover:from-green-500 hover:to-yellow-600 text-black font-bold"
                >
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden py-4 space-y-2 border-t border-white/10">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      setShowProfileDialog(true);
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10"
                  >
                    <User className="w-5 h-5" />
                    <span>View Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowSettingsDialog(true);
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10"
                  >
                    <SettingsIcon className="w-5 h-5" />
                    <span>Settings</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowAuthDialog(true);
                    setShowMobileMenu(false);
                  }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-400 to-yellow-500 text-black font-bold rounded-lg"
                >
                  Sign In
                </button>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Connect with{" "}
                  <span className="bg-gradient-to-r from-green-400 to-yellow-500 bg-clip-text text-transparent">
                    Habesha
                  </span>{" "}
                  people worldwide
                </h2>
                <p className="text-xl text-gray-300">
                  Video chat with Eritrean & Ethiopian diaspora. Practice languages, make friends, and celebrate our culture together.
                </p>
              </div>

              {/* CTA Button */}
              <Button
                onClick={handleStartChat}
                className="w-full lg:w-auto px-12 py-6 text-xl font-bold bg-gradient-to-r from-green-400 to-yellow-500 hover:from-green-500 hover:to-yellow-600 text-black rounded-xl shadow-2xl hover:shadow-green-500/50 transition-all"
              >
                <Video className="w-6 h-6 mr-2" />
                Start Video Chat
              </Button>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-[#00D9B4]">10K+</div>
                  <div className="text-sm text-gray-400">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#00D9B4]">50K+</div>
                  <div className="text-sm text-gray-400">Video Calls</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#00D9B4]">20+</div>
                  <div className="text-sm text-gray-400">Countries</div>
                </div>
              </div>
            </div>

            {/* Right Column - Rotating Globe */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-yellow-500/20 rounded-full blur-3xl"></div>
                <RotatingGlobe />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl font-bold text-center text-white mb-12">
            Why HabeshLive?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="w-12 h-12 text-[#00D9B4]" />}
              title="AI Safety Systems"
              description="Advanced AI moderation, respect scores, and screenshot protection keep everyone safe."
            />
            <FeatureCard
              icon={<Users className="w-12 h-12 text-[#00D9B4]" />}
              title="Smart Matching"
              description="Match with people who share your interests, language goals, and cultural background."
            />
            <FeatureCard
              icon={<Globe className="w-12 h-12 text-[#00D9B4]" />}
              title="Global Community"
              description="Connect with Habesha diaspora from USA, UK, Canada, Europe, Middle East, and beyond."
            />
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
      />

      <ProfileViewDialog
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
        onEditProfile={() => {
          setShowProfileDialog(false);
          setShowEditProfileDialog(true);
        }}
        onOpenSettings={() => {
          setShowProfileDialog(false);
          setShowSettingsDialog(true);
        }}
        onOpenContactUs={() => {
          setShowProfileDialog(false);
          setShowContactUsDialog(true);
        }}
      />

      <EditProfileDialog
        open={showEditProfileDialog}
        onOpenChange={setShowEditProfileDialog}
      />

      <SettingsDialog
        open={showSettingsDialog}
        onOpenChange={setShowSettingsDialog}
        onManageAccount={() => {
          setShowSettingsDialog(false);
          setShowManageAccountDialog(true);
        }}
        onContactUs={() => {
          setShowSettingsDialog(false);
          setShowContactUsDialog(true);
        }}
      />

      <ManageAccountDialog
        open={showManageAccountDialog}
        onOpenChange={setShowManageAccountDialog}
        onBack={() => {
          setShowManageAccountDialog(false);
          setShowSettingsDialog(true);
        }}
      />

      <ContactUsDialog
        open={showContactUsDialog}
        onOpenChange={setShowContactUsDialog}
      />
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-white/10 rounded-2xl p-8 hover:border-[#00D9B4]/50 transition-all">
      <div className="mb-4">{icon}</div>
      <h4 className="text-2xl font-bold text-white mb-3">{title}</h4>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}
