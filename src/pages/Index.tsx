"use client";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Video, ChevronDown, Users, Shield, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [matchingCount] = useState("18,542");
  const [currentImageSet, setCurrentImageSet] = useState(0);

  // Auto-scroll profile images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageSet((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Mock profile data (will be replaced with real users)
  const profileSets = [
    [
      { 
        name: "Sara", 
        age: 24, 
        status: "online",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop"
      },
      { 
        name: "Daniel", 
        age: 26, 
        status: "online",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop"
      }
    ],
    [
      { 
        name: "Meron", 
        age: 23, 
        status: "online",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop"
      },
      { 
        name: "Samuel", 
        age: 27, 
        status: "online",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop"
      }
    ],
    [
      { 
        name: "Tsinat", 
        age: 25, 
        status: "online",
        image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=600&fit=crop"
      },
      { 
        name: "Yonas", 
        age: 28, 
        status: "online",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop"
      }
    ]
  ];

  return (
    <div className="min-h-screen bg-[#181818] text-white">
      {/* Header - Azar Style */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-sm px-6 py-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-3xl font-bold tracking-tight">
            habeshalive
          </div>
          <Button
            variant="outline"
            className="bg-white text-black hover:bg-gray-100 rounded-full px-6 border-0 font-medium"
          >
            Log in
          </Button>
        </div>
      </header>

      {/* Hero Section with Sliding Video Cards - Azar Style */}
      <section className="relative pt-24 pb-16 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Matching Count - Azar Style */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 text-sm text-gray-400">
              <div className="relative">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping" />
              </div>
              <span className="text-3xl font-bold text-white">
                {matchingCount}
              </span>
              <span className="text-lg">are matching now!</span>
            </div>
          </div>

          {/* Video Chat Cards Grid - Azar Style with Slide Animation */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-4xl mx-auto h-[800px] md:h-[400px]">
            {profileSets.map((set, setIndex) => (
              <div
                key={setIndex}
                className={`absolute inset-0 grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-700 ${
                  setIndex === currentImageSet
                    ? "opacity-100 translate-y-0"
                    : setIndex < currentImageSet
                    ? "opacity-0 -translate-y-full"
                    : "opacity-0 translate-y-full"
                }`}
              >
                {set.map((profile, index) => (
                  <div
                    key={index}
                    className="relative rounded-2xl overflow-hidden h-[380px] bg-gray-800 shadow-2xl group hover:scale-[1.02] transition-transform duration-300"
                  >
                    {/* Profile Image */}
                    <img
                      src={profile.image}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Online Badge - Top Left */}
                    {profile.status === "online" && (
                      <div className="absolute top-6 left-6 z-10">
                        <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          ONLINE
                        </div>
                      </div>
                    )}

                    {/* Profile Info - Bottom Left */}
                    <div className="absolute bottom-6 left-6 text-white z-10">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold">
                          {profile.name}, {profile.age}
                        </span>
                      </div>
                    </div>

                    {/* Filter Button - Bottom Right */}
                    <div className="absolute bottom-6 right-6 z-10">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 rounded-full px-4 py-2"
                      >
                        <span className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          {index === 0 ? "Gender" : "Country"}
                          <ChevronDown className="w-4 h-4" />
                        </span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Start Video Chat Button - Azar Style */}
          <div className="text-center">
            <Button
              onClick={() => navigate("/video-chat")}
              size="lg"
              className="bg-white text-black hover:bg-gray-100 rounded-full px-12 py-7 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all group"
            >
              <Video className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
              Start Video Chat
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content Section - Azar Style */}
      <section className="py-24 px-6 bg-[#181818]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            HabeshLive Video Chat & Talk to Strangers
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Connect with Habesha Worldwide!
          </h2>
          <p className="text-xl text-gray-300 mb-4">
            Meet friends and practice language now!
          </p>
          <p className="text-xl text-gray-300 leading-relaxed">
            HabeshLive is a global video chat platform for meeting Habesha people.
            <br />
            Connect with Ethiopians and Eritreans around the world.
          </p>
        </div>
      </section>

      {/* Features Section - Azar Style */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="border border-gray-800 rounded-3xl p-8 bg-[#1a1a1a] hover:border-gray-700 transition-colors">
            <div className="bg-white rounded-2xl p-4 w-16 h-16 flex items-center justify-center mb-6">
              <Video className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-2xl font-bold mb-4">HD Video Chat</h3>
            <p className="text-gray-400 text-base leading-relaxed">
              Experience instant connection with Habesha people nearby and around the world. Crystal clear quality!
            </p>
          </div>

          {/* Feature 2 */}
          <div className="border border-gray-800 rounded-3xl p-8 bg-[#1a1a1a] hover:border-gray-700 transition-colors">
            <div className="bg-white rounded-2xl p-4 w-16 h-16 flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Safe & Secure</h3>
            <p className="text-gray-400 text-base leading-relaxed">
              AI moderation, same-gender options, and cultural sensitivity. Built for our community values.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="border border-gray-800 rounded-3xl p-8 bg-[#1a1a1a] hover:border-gray-700 transition-colors">
            <div className="bg-white rounded-2xl p-4 w-16 h-16 flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-black" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Cultural Connection</h3>
            <p className="text-gray-400 text-base leading-relaxed">
              Practice Tigrinya, Amharic, or Oromo. Share culture and celebrate our heritage together.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs Section - Azar Style */}
      <section className="py-24 px-6 bg-[#181818]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-6xl font-bold text-center mb-16">FAQs</h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem
              value="item-1"
              className="border border-gray-800 rounded-2xl px-8 bg-[#1a1a1a]"
            >
              <AccordionTrigger className="text-xl font-normal hover:no-underline py-8">
                Can I Use HabeshLive for Free?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 text-base pb-8 leading-relaxed">
                HabeshLive lets you access video chat features for free. Customizing who you meet by gender and region is available through our premium features. Start matching for free today!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-2"
              className="border border-gray-800 rounded-2xl px-8 bg-[#1a1a1a]"
            >
              <AccordionTrigger className="text-xl font-normal hover:no-underline py-8">
                What Makes HabeshLive Stand Out?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 text-base pb-8 leading-relaxed">
                HabeshLive is built specifically for the Habesha community. Meet fellow Ethiopians and Eritreans worldwide, practice your language skills, and connect with people who share your culture and values. It's like coming home!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-3"
              className="border border-gray-800 rounded-2xl px-8 bg-[#1a1a1a]"
            >
              <AccordionTrigger className="text-xl font-normal hover:no-underline py-8">
                Is HabeshLive a random video chat?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 text-base pb-8 leading-relaxed">
                HabeshLive isn't just random - the more you use it, the more our algorithm learns your preferences and matches you with similar people. Find language practice partners, make friends, or just chat with fellow Habesha!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-4"
              className="border border-gray-800 rounded-2xl px-8 bg-[#1a1a1a]"
            >
              <AccordionTrigger className="text-xl font-normal hover:no-underline py-8">
                What safety features does HabeshLive offer?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 text-base pb-8 leading-relaxed">
                We offer same-gender matching, AI content moderation, quick report buttons, auto-blur for inappropriate content, and 24/7 moderation team. Your safety and comfort are our priorities.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-5"
              className="border border-gray-800 rounded-2xl px-8 bg-[#1a1a1a]"
            >
              <AccordionTrigger className="text-xl font-normal hover:no-underline py-8">
                Can I practice Tigrinya, Amharic, or Oromo?
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 text-base pb-8 leading-relaxed">
                Absolutely! Select "Language Practice" as your intention to match with native speakers or fellow learners. Perfect for diaspora connecting with their roots or anyone learning Habesha languages.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer - Azar Style */}
      <footer className="bg-black py-16 px-6 border-t border-gray-900">
        <div className="max-w-6xl mx-auto">
          {/* Company Name */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="text-2xl font-bold tracking-wider">HABESHALIVE®</div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-8 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              About HabeshLive
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Blog
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Safety Tips
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Community Guidelines
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors font-semibold">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Cultural Guidelines
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Support
            </a>
          </div>

          {/* Company Info */}
          <div className="text-center text-sm text-gray-500 space-y-2 mb-8">
            <p>Email: hello@habeshalive.com</p>
            <p className="pt-4">© 2025 HabeshLive. All rights reserved.</p>
            <p className="flex items-center justify-center gap-2 pt-2">
              <span className="text-xl">🇪🇹</span>
              <span className="text-xl">🇪🇷</span>
              Built with ❤️ for the Habesha community
            </p>
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center justify-center gap-6">
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-gray-900 hover:bg-gray-800 flex items-center justify-center transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-white"
              >
                <path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-gray-900 hover:bg-gray-800 flex items-center justify-center transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-white"
              >
                <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-gray-900 hover:bg-gray-800 flex items-center justify-center transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-white"
              >
                <path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.70,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
