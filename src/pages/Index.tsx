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
import { Video, ChevronDown, Users, Shield, Instagram, Facebook, Youtube, Camera, Sparkles, MessageCircle, User as UserIcon, Edit, MoreHorizontal, Mail, LogOut } from "lucide-react";
import { AuthDialog } from "@/components/AuthDialog";
import { RegionalPreferenceDialog } from "@/components/RegionalPreferenceDialog";
import { ProfileViewDialog } from "@/components/ProfileViewDialog";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { SettingsDialog } from "@/components/SettingsDialog";
import { ManageAccountDialog } from "@/components/ManageAccountDialog";
import { ContactUsDialog } from "@/components/ContactUsDialog";
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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showEditProfileDialog, setShowEditProfileDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showManageAccountDialog, setShowManageAccountDialog] = useState(false);
  const [showContactUsDialog, setShowContactUsDialog] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  // Load profile data
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

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          loadProfile(session.user.id);
          toast.success('Signed in successfully!');
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
                      <UserIcon className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div 
                      className="flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-accent rounded-sm"
                      onClick={() => setShowProfileDialog(true)}
                    >
                      <UserIcon className="h-5 w-5" />
                      <span className="font-semibold">{user.email?.split('@')[0]}</span>
                    </div>
                    <div className="px-2 py-1 text-sm text-muted-foreground">
                      🌍 {profile?.country || 'Not set'}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setShowEditProfileDialog(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowSettingsDialog(true)}>
                      <MoreHorizontal className="mr-2 h-4 w-4" />
                      More
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowContactUsDialog(true)}>
                      <Mail className="mr-2 h-4 w-4" />
                      Contact Us
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
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

      {/* Hero Section with Split Layout */}
      <section className="relative overflow-hidden">
        {/* Desktop: Split View - Left Controls, Right Photos - FIXED HEIGHT */}
        <div className="hidden md:grid md:grid-cols-2 h-screen pt-20">
          {/* LEFT SIDE - Controls Panel */}
          <div className="relative bg-black flex flex-col justify-end p-12 h-full overflow-hidden">
            {/* Large Faded "habesha" Text - Center */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-[140px] font-bold text-white/5 leading-none select-none">
                habesha
              </div>
            </div>

            {/* Animated Counter - Above Buttons */}
            <div className="mb-8 relative z-10">
              <div className="flex items-center gap-3 text-white mb-2">
                <div className="relative">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping" />
                </div>
                <span className="text-3xl font-bold tabular-nums">
                  {matchingCount.toLocaleString()}
                </span>
                <span className="text-lg text-gray-300">are matching now!</span>
              </div>
            </div>

            {/* Bottom Buttons - Stacked */}
            <div className="space-y-3 relative z-10">
              <div className="grid grid-cols-2 gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="lg"
                      className="w-full bg-[#2a2a2a] hover:bg-[#333] text-white rounded-full py-6 text-base font-semibold border-0"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span className="text-pink-400">⚥</span>
                        Gender
                        <ChevronDown className="w-4 h-4" />
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 bg-gray-900 border-gray-700">
                    <DropdownMenuItem onClick={() => toast.info('💎 Use tokens to filter by Male')}>
                      Male
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.info('💎 Use tokens to filter by Female')}>
                      Female
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.info('💎 Use tokens to filter by Non-binary')}>
                      Non-binary
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button
                  onClick={() => setShowRegionalDialog(true)}
                  size="lg"
                  className="w-full bg-[#2a2a2a] hover:bg-[#333] text-white rounded-full py-6 text-base font-semibold border-0"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span className="text-green-400">🌍</span>
                    Country
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </Button>
              </div>
              
              <Button
                onClick={handleStartVideoChat}
                size="lg"
                className="w-full bg-white text-black hover:bg-gray-100 rounded-full py-7 text-xl font-bold shadow-2xl border-0"
              >
                <Video className="w-6 h-6 mr-2" />
                Start Video Chat
              </Button>
              
              <p className="text-xs text-gray-500 text-center mt-2">
                All images of models are used for illustrative purposes only.
              </p>
            </div>
          </div>

          {/* RIGHT SIDE - 3 Column Scrolling Photos */}
          <div className="relative bg-black flex gap-3 p-3 h-full overflow-hidden">
            {/* Column 1 - Scrolling Up */}
            <div className="flex-1 overflow-hidden">
              <div className="animate-scroll-up">
                {[...profiles[0], ...profiles[0]].map((profile, index) => (
                  <div key={index} className="mb-3 relative">
                    <img 
                      src={profile.image} 
                      alt="" 
                      className="w-full h-[420px] object-cover rounded-2xl"
                    />
                    {profile.online && (
                      <div className="absolute top-3 left-3 bg-black/80 rounded-full px-2.5 py-1 flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-[10px] font-bold text-green-500 uppercase tracking-wide">ONLINE</span>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <span className="text-lg">{profile.flag}</span>
                      <span className="text-white text-base font-semibold drop-shadow-lg">{profile.name}, {profile.age}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2 - Scrolling Down */}
            <div className="flex-1 overflow-hidden">
              <div className="animate-scroll-down">
                {[...profiles[1], ...profiles[1]].map((profile, index) => (
                  <div key={index} className="mb-3 relative">
                    <img 
                      src={profile.image} 
                      alt="" 
                      className="w-full h-[420px] object-cover rounded-2xl"
                    />
                    {profile.online && (
                      <div className="absolute top-3 left-3 bg-black/80 rounded-full px-2.5 py-1 flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-[10px] font-bold text-green-500 uppercase tracking-wide">ONLINE</span>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <span className="text-lg">{profile.flag}</span>
                      <span className="text-white text-base font-semibold drop-shadow-lg">{profile.name}, {profile.age}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3 - Scrolling Up */}
            <div className="flex-1 overflow-hidden">
              <div className="animate-scroll-up">
                {[...profiles[2], ...profiles[2]].map((profile, index) => (
                  <div key={index} className="mb-3 relative">
                    <img 
                      src={profile.image} 
                      alt="" 
                      className="w-full h-[420px] object-cover rounded-2xl"
                    />
                    {profile.online && (
                      <div className="absolute top-3 left-3 bg-black/80 rounded-full px-2.5 py-1 flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-[10px] font-bold text-green-500 uppercase tracking-wide">ONLINE</span>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <span className="text-lg">{profile.flag}</span>
                      <span className="text-white text-base font-semibold drop-shadow-lg">{profile.name}, {profile.age}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: Original Stacked Layout with Photos Background */}
        <div className="md:hidden relative min-h-screen pt-20">
          {/* Continuous Scrolling Photo Background */}
          <div className="absolute inset-0 flex gap-1">
            {/* Column 1 - Scrolling Up */}
            <div className="flex-1 overflow-hidden">
              <div className="animate-scroll-up">
                {[...profiles[0], ...profiles[0]].map((profile, index) => (
                  <div key={index} className="mb-1 relative">
                    <img 
                      src={profile.image} 
                      alt="" 
                      className="w-full h-[300px] object-cover"
                    />
                    {profile.online && (
                      <div className="absolute top-2 left-2 bg-black/80 rounded-full px-2 py-0.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                        <span className="text-[9px] font-bold text-green-600 uppercase tracking-wide">ONLINE</span>
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                      <span className="text-base">{profile.flag}</span>
                      <span className="text-white text-sm font-semibold drop-shadow-lg">{profile.name}, {profile.age}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2 - Scrolling Down */}
            <div className="flex-1 overflow-hidden">
              <div className="animate-scroll-down">
                {[...profiles[1], ...profiles[1]].map((profile, index) => (
                  <div key={index} className="mb-1 relative">
                    <img 
                      src={profile.image} 
                      alt="" 
                      className="w-full h-[300px] object-cover"
                    />
                    {profile.online && (
                      <div className="absolute top-2 left-2 bg-black/80 rounded-full px-2 py-0.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                        <span className="text-[9px] font-bold text-green-600 uppercase tracking-wide">ONLINE</span>
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                      <span className="text-base">{profile.flag}</span>
                      <span className="text-white text-sm font-semibold drop-shadow-lg">{profile.name}, {profile.age}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Bottom fade overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-10" />


          {/* Mobile Controls - Fixed at Bottom */}
          <div className="fixed inset-x-0 bottom-0 z-20 px-4 pb-safe pt-3 bg-gradient-to-t from-background/95 via-background/70 to-transparent backdrop-blur">
            {/* Filter Buttons - Side by Side */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-black/70 backdrop-blur-sm border border-white/20 text-white hover:bg-white/10 rounded-full py-5 text-sm font-semibold"
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      <span className="text-pink-400">⚥</span>
                      Gender
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40 bg-gray-900 border-gray-700">
                  <DropdownMenuItem onClick={() => toast.info('💎 Use tokens to filter by Male')}>
                    Male
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info('💎 Use tokens to filter by Female')}>
                    Female
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info('💎 Use tokens to filter by Non-binary')}>
                    Non-binary
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                onClick={() => setShowRegionalDialog(true)}
                size="lg"
                className="bg-black/70 backdrop-blur-sm border border-white/20 text-white hover:bg-white/10 rounded-full py-5 text-sm font-semibold"
              >
                <span className="flex items-center justify-center gap-1.5">
                  <span className="text-green-400">🌍</span>
                  Country
                  <ChevronDown className="w-4 h-4" />
                </span>
              </Button>
            </div>

            {/* Start Video Chat Button - Full Width */}
            <Button
              onClick={handleStartVideoChat}
              size="lg"
              className="w-full bg-white text-black hover:bg-gray-100 rounded-full py-6 text-xl font-bold shadow-2xl mb-2"
            >
              <Video className="w-6 h-6 mr-2" />
              Start Video Chat
            </Button>

            {/* Matching Counter - Below Start Video Chat */}
            <div className="text-center pb-2">
              <div className="flex items-center justify-center gap-2 text-white mb-1">
                <div className="relative">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping" />
                </div>
                <span className="text-base font-bold tabular-nums">
                  {matchingCount.toLocaleString()}
                </span>
                <span className="text-xs text-gray-300">are matching now!</span>
              </div>
              <p className="text-xs text-gray-500">
                All images of models are used for illustrative purposes only.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-8 md:py-12 px-4 md:px-6 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
            HabeshaLive Video Chat & Talk
          </h1>
          <h2 className="text-lg md:text-3xl lg:text-4xl font-bold mb-4 whitespace-nowrap overflow-hidden text-ellipsis">
            Don't Randomly Chat Around!
          </h2>
          <p className="text-base md:text-xl text-gray-300 mb-3">
            Meet Habesha friends and talk to people now!
          </p>
          <p className="text-base md:text-xl text-gray-300 leading-relaxed">
            HabeshaLive is a global video chat platform for meeting Habesha people.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Feature 1 */}
          <div className="border border-gray-800 rounded-3xl p-6 md:p-8 bg-[#0f0f0f] hover:border-gray-700 transition-all hover:scale-105">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white rounded-2xl p-3 md:p-4 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center flex-shrink-0">
                <Video className="w-7 h-7 md:w-8 md:h-8 text-black" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold">HD Video Chat</h3>
            </div>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Experience instant connection with Habesha people nearby and around the world. Crystal clear quality!
            </p>
          </div>

          {/* Feature 2 */}
          <div className="border border-gray-800 rounded-3xl p-6 md:p-8 bg-[#0f0f0f] hover:border-gray-700 transition-all hover:scale-105">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white rounded-2xl p-3 md:p-4 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center flex-shrink-0">
                <Shield className="w-7 h-7 md:w-8 md:h-8 text-black" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold">Safe & Secure</h3>
            </div>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              AI moderation, same-gender options, and cultural sensitivity. Built for our community values.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="border border-gray-800 rounded-3xl p-6 md:p-8 bg-[#0f0f0f] hover:border-gray-700 transition-all hover:scale-105">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white rounded-2xl p-3 md:p-4 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center flex-shrink-0">
                <Users className="w-7 h-7 md:w-8 md:h-8 text-black" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold">Cultural Connection</h3>
            </div>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Practice Tigrinya, Amharic. Share culture and celebrate our heritage together.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-center mb-12 md:mb-16">FAQs</h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem
              value="item-1"
              className="border border-gray-800 rounded-2xl px-6 md:px-8 bg-[#0f0f0f]"
            >
              <AccordionTrigger className="text-base md:text-xl font-normal hover:no-underline py-6 md:py-8">
                Can I Use HabeshaLive for Free?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 text-sm md:text-base pb-6 md:pb-8 leading-relaxed">
                HabeshaLive lets you access video chat features for free. Customizing who you meet by gender and region is available through our Gems. Don't miss out on bonus benefits!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-2"
              className="border border-gray-800 rounded-2xl px-6 md:px-8 bg-[#0f0f0f]"
            >
              <AccordionTrigger className="text-base md:text-xl font-normal hover:no-underline py-6 md:py-8">
                What Makes HabeshaLive Stand Out?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 text-sm md:text-base pb-6 md:pb-8 leading-relaxed">
                HabeshaLive makes meeting Habesha people feel real and exciting with face-to-face video chats that happen in the moment. Plus, with safety features and moderation tools, you can focus on having fun.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-3"
              className="border border-gray-800 rounded-2xl px-6 md:px-8 bg-[#0f0f0f]"
            >
              <AccordionTrigger className="text-base md:text-xl font-normal hover:no-underline py-6 md:py-8">
                Is HabeshaLive a random video chat?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 text-sm md:text-base pb-6 md:pb-8 leading-relaxed">
                HabeshaLive isn't just random - the more you use it, the more our recommendation algorithm learns the type of people you enjoyed chatting with and matches you with similar people.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-4"
              className="border border-gray-800 rounded-2xl px-6 md:px-8 bg-[#0f0f0f]"
            >
              <AccordionTrigger className="text-base md:text-xl font-normal hover:no-underline py-6 md:py-8">
                What safety features does HabeshaLive offer?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 text-sm md:text-base pb-6 md:pb-8 leading-relaxed">
                We offer MatchBlur feature that automatically blurs inappropriate content. You can report anyone with just a tap. If something makes you uncomfortable, hit that report button!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-5"
              className="border border-gray-800 rounded-2xl px-6 md:px-8 bg-[#0f0f0f]"
            >
              <AccordionTrigger className="text-base md:text-xl font-normal hover:no-underline py-6 md:py-8">
                Can I practice Tigrinya or Amharic?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 text-sm md:text-base pb-6 md:pb-8 leading-relaxed">
                Absolutely! Select "Language Practice" as your intention to match with native speakers or fellow learners. Perfect for diaspora connecting with their roots!
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 md:py-16 px-4 md:px-6 border-t border-gray-900">
        <div className="max-w-6xl mx-auto">
          {/* Company Name */}
          <div className="flex items-center justify-center gap-4 mb-8 md:mb-12">
            <div className="text-xl md:text-2xl font-bold tracking-wider">HABESHALIVE®</div>
          </div>

          {/* Social Media Links */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <a href="https://www.youtube.com/@HabeshaLoveOfficial" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Youtube className="w-6 h-6" />
            </a>
            <a href="https://www.instagram.com/habeshaloveofficial/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Instagram className="w-6 h-6" />
            </a>
            <a href="https://www.tiktok.com/@habeshaloveofficial" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61582349639643" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Facebook className="w-6 h-6" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-center text-sm text-gray-500 mb-6">© 2025 HabeshaLive. All rights reserved.</p>

          {/* App Store Buttons - Side by Side, Smaller */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <Button variant="outline" className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800 rounded-lg px-4 py-2 h-auto text-xs">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-1.5">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              App Store
            </Button>
            <Button variant="outline" className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800 rounded-lg px-4 py-2 h-auto text-xs">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-1.5">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
              Google Play
            </Button>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs text-gray-400">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Blog</a>
            <a href="#" className="hover:text-white transition-colors">Safety Tips</a>
            <a href="#" className="hover:text-white transition-colors">Guidelines</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {/* Auth Dialog */}
      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
      />
      
      {/* Regional Preference Dialog */}
      <RegionalPreferenceDialog 
        open={showRegionalDialog} 
        onOpenChange={setShowRegionalDialog} 
      />

      {/* Profile Dialogs */}
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
