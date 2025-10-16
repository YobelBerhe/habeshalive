"use client";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Video, ChevronDown, Users, Shield, Instagram, Facebook, Youtube, Camera, Sparkles, MessageCircle, User as UserIcon, Edit, MoreHorizontal, Mail, LogOut, Globe } from "lucide-react";
import { AuthDialog } from "@/components/AuthDialog";
import { RegionalPreferenceDialog } from "@/components/RegionalPreferenceDialog";
import { ProfileViewDialog } from "@/components/ProfileViewDialog";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { SettingsDialog } from "@/components/SettingsDialog";
import { ManageAccountDialog } from "@/components/ManageAccountDialog";
import { ContactUsDialog } from "@/components/ContactUsDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RotatingGlobe } from "@/components/RotatingGlobe";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

export default function Home() {
  const navigate = useNavigate();
  const [matchingCount, setMatchingCount] = useState(342768);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showRegionalDialog, setShowRegionalDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showEditProfileDialog, setShowEditProfileDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showManageAccountDialog, setShowManageAccountDialog] = useState(false);
  const [showContactUsDialog, setShowContactUsDialog] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          toast.success('Signed in successfully!');
        }
        
        if (session?.user) {
          loadProfile(session.user.id);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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

  const handleStartVideoChat = () => {
    if (!user) {
      setShowAuthDialog(true);
    } else {
      navigate('/video-chat');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
  };

  // Animate the matching counter with flipping effect
  useEffect(() => {
    const interval = setInterval(() => {
      setMatchingCount(prev => prev + Math.floor(Math.random() * 10));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Handle scroll for header transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Profile photos for continuous scrolling (6 rows, 3 columns)
  const profiles = [
    // Column 1 (scrolls up) - Mix of genders
    [
      { name: "Selam", age: 24, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=700&fit=crop", flag: "🇪🇹", online: true },
      { name: "Daniel", age: 26, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=700&fit=crop", flag: "🇺🇸", online: true },
      { name: "Meron", age: 23, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=700&fit=crop", flag: "🇪🇷", online: true },
      { name: "Samuel", age: 27, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=700&fit=crop", flag: "🇬🇧", online: true },
      { name: "Rahel", age: 25, image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=700&fit=crop", flag: "🇪🇹", online: true },
      { name: "Yonas", age: 28, image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=700&fit=crop", flag: "🇪🇷", online: true },
    ],
    // Column 2 (scrolls down) - Mix of genders
    [
      { name: "Helen", age: 26, image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=700&fit=crop", flag: "🇬🇧", online: true },
      { name: "Dawit", age: 29, image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=700&fit=crop", flag: "🇺🇸", online: true },
      { name: "Tsigereda", age: 22, image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=700&fit=crop", flag: "🇪🇹", online: true },
      { name: "Amanuel", age: 30, image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=700&fit=crop", flag: "🇪🇷", online: true },
      { name: "Liya", age: 24, image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=700&fit=crop", flag: "🇪🇹", online: true },
      { name: "Henok", age: 31, image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400&h=700&fit=crop", flag: "🇺🇸", online: true },
    ],
    // Column 3 (scrolls up) - Mix of genders
    [
      { name: "Bethlehem", age: 23, image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=700&fit=crop", flag: "🇪🇷", online: true },
      { name: "Aman", age: 28, image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=700&fit=crop", flag: "🇬🇧", online: true },
      { name: "Natsinet", age: 25, image: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=700&fit=crop", flag: "🇪🇹", online: true },
      { name: "Bereket", age: 27, image: "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=400&h=700&fit=crop", flag: "🇪🇷", online: true },
      { name: "Saron", age: 24, image: "https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=400&h=700&fit=crop", flag: "🇺🇸", online: true },
      { name: "Elias", age: 29, image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=700&fit=crop", flag: "🇪🇹", online: true },
    ],
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 transition-all duration-300 ${
        isScrolled ? 'md:bg-transparent md:backdrop-blur-none' : 'md:bg-black/60 md:backdrop-blur-sm'
      }`}>
        {/* Gradient fade shadow from top */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/50 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo - Bigger */}
          <div className="flex items-center gap-8">
            <div className="text-3xl md:text-3xl font-bold tracking-tight">
              habesha
            </div>
            
            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <button 
                onClick={handleStartVideoChat}
                className="text-white hover:text-gray-300 transition-colors"
              >
                Video Chat
              </button>
              <button className="text-white hover:text-gray-300 transition-colors">
                Blog
              </button>
              <button className="text-white hover:text-gray-300 transition-colors">
                About
              </button>
            </nav>
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center gap-2 md:gap-3">
            <Button
              className="hidden md:inline-flex items-center gap-1.5 bg-white text-black hover:bg-gray-100 rounded-full px-6 py-2.5 font-semibold text-base h-auto"
            >
              💎 Shop
            </Button>
            <Button
              className="hidden md:inline-flex items-center gap-1.5 bg-white text-black hover:bg-gray-100 rounded-full px-6 py-2.5 font-semibold text-base h-auto"
            >
              🕐 History
            </Button>
            {user ? (
              <>
                <Button
                  onClick={handleSignOut}
                  className="bg-white text-black hover:bg-gray-100 rounded-full px-6 py-2.5 font-semibold text-base h-auto"
                >
                  Sign Out
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      className="bg-white text-black hover:bg-gray-100 rounded-full w-11 h-11"
                    >
                      <Avatar className="w-9 h-9">
                        <AvatarImage src={profile?.avatar_url || ''} />
                        <AvatarFallback className="bg-gradient-to-br from-[#00D9B4] to-[#00a085] text-black text-xs font-bold">
                          {profile?.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-black/95 border-white/10 text-white">
                    <div className="flex items-center gap-2 px-2 py-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={profile?.avatar_url || ''} />
                        <AvatarFallback className="bg-gradient-to-br from-[#00D9B4] to-[#00a085] text-black text-xs font-bold">
                          {profile?.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{profile?.username || user.email?.split('@')[0]}</div>
                        <div className="text-xs text-gray-400">{profile?.country ? `${profile.country}` : '🌍 Unknown'}</div>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem 
                      onClick={() => {
                        setShowProfileDialog(true);
                      }}
                      className="focus:bg-white/10 focus:text-white cursor-pointer"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        setShowSettingsDialog(true);
                      }}
                      className="focus:bg-white/10 focus:text-white cursor-pointer"
                    >
                      <MoreHorizontal className="mr-2 h-4 w-4" />
                      More
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        setShowContactUsDialog(true);
                      }}
                      className="focus:bg-white/10 focus:text-white cursor-pointer"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Contact Us
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem 
                      onClick={handleSignOut}
                      className="focus:bg-white/10 focus:text-white cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                onClick={() => setShowAuthDialog(true)}
                className="bg-white text-black hover:bg-gray-100 rounded-full px-6 py-2.5 font-semibold text-base h-auto"
              >
                Log in
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative pt-32 md:pt-40 pb-16 md:pb-24 px-4 md:px-6">
        {/* Animated Matching Counter */}
        <div className="absolute top-12 left-0 right-0 flex items-center justify-center gap-3 text-gray-400 text-sm md:text-base">
          <Sparkles className="w-4 h-4" />
          {matchingCount.toLocaleString()} online right now
          <Sparkles className="w-4 h-4" />
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Video chat with{" "}
                <span className="text-[#00D9B4]">Habesha</span> diaspora
              </h2>
              <p className="text-gray-300 text-lg md:text-xl">
                Practice languages, make friends, and celebrate our culture
                together.
              </p>
            </div>

            {/* CTA Button */}
            <Button
              onClick={handleStartVideoChat}
              className="bg-[#00D9B4] text-black hover:bg-[#00a085] rounded-full px-8 py-4 font-semibold text-lg md:text-xl h-auto"
            >
              <Video className="w-5 h-5 mr-2" />
              Start Video Chat
            </Button>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div>
                <div className="text-2xl font-bold text-[#00D9B4]">10K+</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#00D9B4]">50K+</div>
                <div className="text-sm text-gray-400">Video Calls</div>
              </div>
            </div>
          </div>

          {/* Right Column - Rotating Globe */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[#00D9B4]/10 rounded-full blur-2xl"></div>
              <RotatingGlobe />
            </div>
          </div>
        </div>
      </div>

      {/* Profile Scrolling Section */}
      <div className="py-16 px-4 md:px-6 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-8">
            Meet Someone New
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {profiles.map((column, columnIndex) => (
              <div key={columnIndex} className="overflow-hidden">
                <div className={`flex flex-col gap-6 ${columnIndex % 2 === 0 ? 'animate-scroll-up' : 'animate-scroll-down'}`}>
                  {column.map((profile, profileIndex) => (
                    <div key={profileIndex} className="relative">
                      <img
                        src={profile.image}
                        alt={profile.name}
                        className="rounded-2xl object-cover w-full h-80"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{profile.name}, {profile.age}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <span>{profile.flag}</span>
                              <span>Online</span>
                            </div>
                          </div>
                          {/* Online Status Indicator */}
                          <div className={`w-3 h-3 rounded-full ${profile.online ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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

      {/* FAQ Section */}
      <div className="py-16 px-4 md:px-6 bg-black/30">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h3>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is HabeshLive safe?</AccordionTrigger>
              <AccordionContent>
                Yes, we use advanced AI moderation and respect scores to ensure
                a safe environment for everyone.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How does matching work?</AccordionTrigger>
              <AccordionContent>
                Our smart matching system connects you with people who share
                your interests, language goals, and cultural background.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                Can I use HabeshLive on my phone?
              </AccordionTrigger>
              <AccordionContent>
                Yes, HabeshLive is available on desktop, iOS, and Android.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-4 md:px-6 bg-black/80 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} HabeshLive. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <a
              href="#"
              className="hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>

      {/* Dialogs */}
      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
      />
      <RegionalPreferenceDialog
        open={showRegionalDialog}
        onOpenChange={setShowRegionalDialog}
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
