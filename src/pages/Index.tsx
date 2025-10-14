"use client";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Video, ChevronDown, Users, Shield, Globe, Instagram, Facebook, Youtube } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [matchingCount, setMatchingCount] = useState(172839788927);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Animate the matching counter
  useEffect(() => {
    const interval = setInterval(() => {
      setMatchingCount(prev => prev + Math.floor(Math.random() * 100));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll carousel every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Profile data (3 slides, 3 columns desktop, 2 mobile)
  const profiles = [
    // Slide 1
    [
      { name: "Sara", age: 24, image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop", online: false },
      { name: "Daniel", age: 26, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop", online: true },
      { name: "Meron", age: 23, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop", online: true },
    ],
    // Slide 2
    [
      { name: "Samuel", age: 27, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop", online: true },
      { name: "Tsinat", age: 25, image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=600&fit=crop", online: true },
      { name: "Yonas", age: 28, image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop", online: false },
    ],
    // Slide 3
    [
      { name: "Rahel", age: 24, image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop", online: true },
      { name: "Dawit", age: 29, image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=600&fit=crop", online: true },
      { name: "Helen", age: 26, image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=600&fit=crop", online: true },
    ],
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header - Azar Style */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md px-4 md:px-6 py-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <div className="text-2xl md:text-3xl font-bold tracking-tight">
              habeshalive
            </div>
            
            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <button 
                onClick={() => navigate('/video-chat')}
                className="text-white hover:text-gray-300 transition-colors font-medium"
              >
                Video Chat
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                Blog
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                About
              </button>
            </nav>
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="hidden md:flex items-center gap-2 text-white hover:bg-white/10 rounded-full px-6"
            >
              <span className="text-yellow-400">💎</span>
              Shop
            </Button>
            <Button
              variant="ghost"
              className="hidden md:flex items-center gap-2 text-white hover:bg-white/10 rounded-full px-6"
            >
              <span>🕐</span>
              History
            </Button>
            <Button
              variant="outline"
              className="bg-white text-black hover:bg-gray-100 rounded-full px-4 md:px-6 border-0 font-semibold"
            >
              Log in
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - Desktop with Animated Number */}
      <section className="relative pt-24 md:pt-32 pb-8 md:pb-16 px-4 md:px-6 overflow-hidden">
        {/* Large "habeshalive" Background Text - Desktop Only */}
        <div className="hidden md:block absolute left-1/2 top-32 -translate-x-1/2 pointer-events-none">
          <div className="text-[200px] font-bold text-white/5 tracking-tight whitespace-nowrap">
            habeshalive
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Animated Matching Counter - Azar Style */}
          <div className="text-center mb-8 md:mb-12">
            <div className="flex items-center justify-center gap-2 md:gap-3 text-sm md:text-base">
              <div className="relative">
                <div className="w-2 md:w-3 h-2 md:h-3 bg-green-500 rounded-full" />
                <div className="absolute inset-0 w-2 md:w-3 h-2 md:h-3 bg-green-500 rounded-full animate-ping" />
              </div>
              <span className="text-2xl md:text-4xl font-bold text-white tabular-nums">
                {matchingCount.toLocaleString()}
              </span>
              <span className="text-gray-400 text-sm md:text-lg">are matching now!</span>
            </div>
          </div>

          {/* Profile Carousel - 3 columns desktop, 2 mobile */}
          <div className="relative mb-8 md:mb-12">
            <div className="overflow-hidden">
              {profiles.map((slide, slideIndex) => (
                <div
                  key={slideIndex}
                  className={`grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 transition-all duration-700 ${
                    slideIndex === currentSlide
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 absolute inset-0 pointer-events-none"
                  }`}
                  style={{
                    transform: slideIndex === currentSlide ? 'translateY(0)' : 
                               slideIndex < currentSlide ? 'translateY(-50px)' : 'translateY(50px)'
                  }}
                >
                  {slide.map((profile, index) => (
                    <div
                      key={index}
                      className={`relative rounded-2xl overflow-hidden aspect-[3/4] bg-gray-900 shadow-2xl group hover:scale-105 transition-transform duration-300 ${
                        index === 2 ? 'hidden md:block' : ''
                      }`}
                    >
                      {/* Profile Image */}
                      <img
                        src={profile.image}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                      {/* Online Badge */}
                      {profile.online && (
                        <div className="absolute top-4 left-4 z-10">
                          <div className="bg-green-500 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold flex items-center gap-2 shadow-lg">
                            <span className="w-1.5 md:w-2 h-1.5 md:h-2 bg-white rounded-full animate-pulse" />
                            ONLINE
                          </div>
                        </div>
                      )}

                      {/* Profile Name - Bottom */}
                      <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                        <div className="text-xl md:text-2xl font-bold mb-1">
                          {profile.name}, {profile.age}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Carousel Indicators */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide 
                      ? 'w-8 bg-white' 
                      : 'w-2 bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Filter Buttons - Azar Style */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-8 md:mb-12">
            <Button
              variant="outline"
              size="lg"
              className="bg-black/60 backdrop-blur-sm border-white/20 text-white hover:bg-white/10 rounded-full px-6 md:px-8 py-5 md:py-6 text-base md:text-lg font-semibold"
            >
              <span className="flex items-center gap-2">
                <span className="text-pink-400">⚥</span>
                Gender
                <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />
              </span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-black/60 backdrop-blur-sm border-white/20 text-white hover:bg-white/10 rounded-full px-6 md:px-8 py-5 md:py-6 text-base md:text-lg font-semibold"
            >
              <span className="flex items-center gap-2">
                <span className="text-green-400">🌍</span>
                Country
                <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />
              </span>
            </Button>
          </div>

          {/* Giant Start Video Chat Button - Azar Style */}
          <div className="text-center">
            <Button
              onClick={() => navigate('/video-chat')}
              size="lg"
              className="bg-white text-black hover:bg-gray-100 rounded-full px-8 md:px-16 py-6 md:py-8 text-lg md:text-2xl font-bold shadow-2xl hover:shadow-white/20 transition-all hover:scale-105 w-full md:w-auto"
            >
              <Video className="w-6 h-6 md:w-8 md:h-8 mr-3 md:mr-4" />
              Start Video Chat
            </Button>
            <p className="text-xs md:text-sm text-gray-500 mt-4">
              All images are of models and are used for illustrative purposes only.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section - Azar Style */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-7xl font-bold mb-6 md:mb-8 leading-tight">
            HabeshLive Video Chat & Talk to Strangers
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
            Don't Randomly Chat Around!
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-3 md:mb-4">
            Meet Habesha friends and talk to people now!
          </p>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            HabeshLive is a global video chat platform for meeting Habesha people.
            <br />
            Discover an alternative to Azar & Omegle for Ethiopian and Eritrean connections.
          </p>
        </div>
      </section>

      {/* Features Section - Azar Style */}
      <section className="py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Feature 1 */}
          <div className="border border-gray-800 rounded-3xl p-6 md:p-8 bg-[#0f0f0f] hover:border-gray-700 transition-all hover:scale-105">
            <div className="bg-white rounded-2xl p-3 md:p-4 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-4 md:mb-6">
              <Video className="w-7 h-7 md:w-8 md:h-8 text-black" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">HD Video Chat</h3>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Experience instant connection with Habesha people nearby and around the world. Crystal clear quality!
            </p>
          </div>

          {/* Feature 2 */}
          <div className="border border-gray-800 rounded-3xl p-6 md:p-8 bg-[#0f0f0f] hover:border-gray-700 transition-all hover:scale-105">
            <div className="bg-white rounded-2xl p-3 md:p-4 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-4 md:mb-6">
              <Shield className="w-7 h-7 md:w-8 md:h-8 text-black" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Safe & Secure</h3>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              AI moderation, same-gender options, and cultural sensitivity. Built for our community values.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="border border-gray-800 rounded-3xl p-6 md:p-8 bg-[#0f0f0f] hover:border-gray-700 transition-all hover:scale-105">
            <div className="bg-white rounded-2xl p-3 md:p-4 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-4 md:mb-6">
              <Users className="w-7 h-7 md:w-8 md:h-8 text-black" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Cultural Connection</h3>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Practice Tigrinya, Amharic, or Oromo. Share culture and celebrate our heritage together.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs Section - Azar Style */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-center mb-12 md:mb-16">FAQs</h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem
              value="item-1"
              className="border border-gray-800 rounded-2xl px-6 md:px-8 bg-[#0f0f0f]"
            >
              <AccordionTrigger className="text-base md:text-xl font-normal hover:no-underline py-6 md:py-8">
                Can I Use HabeshLive for Free?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 text-sm md:text-base pb-6 md:pb-8 leading-relaxed">
                HabeshLive lets you access video chat features for free. Customizing who you meet by gender and region is available through our Gems. Don't miss out on bonus benefits!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-2"
              className="border border-gray-800 rounded-2xl px-6 md:px-8 bg-[#0f0f0f]"
            >
              <AccordionTrigger className="text-base md:text-xl font-normal hover:no-underline py-6 md:py-8">
                What Makes HabeshLive Stand Out?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 text-sm md:text-base pb-6 md:pb-8 leading-relaxed">
                HabeshLive makes meeting Habesha people feel real and exciting with face-to-face video chats that happen in the moment. Plus, with safety features and moderation tools, you can focus on having fun.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-3"
              className="border border-gray-800 rounded-2xl px-6 md:px-8 bg-[#0f0f0f]"
            >
              <AccordionTrigger className="text-base md:text-xl font-normal hover:no-underline py-6 md:py-8">
                Is HabeshLive a random video chat?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 text-sm md:text-base pb-6 md:pb-8 leading-relaxed">
                HabeshLive isn't just random - the more you use it, the more our recommendation algorithm learns the type of people you enjoyed chatting with and matches you with similar people.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-4"
              className="border border-gray-800 rounded-2xl px-6 md:px-8 bg-[#0f0f0f]"
            >
              <AccordionTrigger className="text-base md:text-xl font-normal hover:no-underline py-6 md:py-8">
                What safety features does HabeshLive offer?
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
                Can I practice Tigrinya, Amharic, or Oromo?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 text-sm md:text-base pb-6 md:pb-8 leading-relaxed">
                Absolutely! Select "Language Practice" as your intention to match with native speakers or fellow learners. Perfect for diaspora connecting with their roots!
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer - Azar Style */}
      <footer className="bg-black py-12 md:py-16 px-4 md:px-6 border-t border-gray-900">
        <div className="max-w-6xl mx-auto">
          {/* Company Name */}
          <div className="flex items-center justify-center gap-4 mb-8 md:mb-12">
            <div className="text-xl md:text-2xl font-bold tracking-wider">HABESHALIVE®</div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-center mb-6 md:mb-8 text-xs md:text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">About HabeshLive</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Safety Tips</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Community Guidelines</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors font-semibold">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Customer Service</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
          </div>

          {/* Company Info */}
          <div className="text-center text-xs md:text-sm text-gray-500 space-y-1 md:space-y-2 mb-6 md:mb-8">
            <p>Email: hello@habeshalive.com</p>
            <p className="pt-2 md:pt-4">© 2025 HabeshLive. All rights reserved.</p>
            <p className="flex items-center justify-center gap-2 pt-2">
              <span className="text-lg md:text-xl">🇪🇹</span>
              <span className="text-lg md:text-xl">🇪🇷</span>
              Built with ❤️ for the Habesha community
            </p>
          </div>

          {/* App Store Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-8 md:mb-12">
            <Button
              variant="outline"
              className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800 rounded-lg px-5 md:px-6 py-2.5 md:py-3 w-full sm:w-auto"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <span className="text-sm md:text-base">App Store</span>
            </Button>
            <Button
              variant="outline"
              className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800 rounded-lg px-5 md:px-6 py-2.5 md:py-3 w-full sm:w-auto"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
              <span className="text-sm md:text-base">Google Play</span>
            </Button>
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center justify-center gap-4 md:gap-6">
            <a
              href="#"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-900 hover:bg-gray-800 flex items-center justify-center transition-colors"
            >
              <Instagram className="w-5 h-5 md:w-6 md:h-6" />
            </a>
            <a
              href="#"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-900 hover:bg-gray-800 flex items-center justify-center transition-colors"
            >
              <Facebook className="w-5 h-5 md:w-6 md:h-6" />
            </a>
            <a
              href="#"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-900 hover:bg-gray-800 flex items-center justify-center transition-colors"
            >
              <Youtube className="w-5 h-5 md:w-6 md:h-6" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
