import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Video, Shield, Users, ChevronRight, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [liveCount] = useState("18,542");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0072BC] via-[#12AD2B] to-[#E4002B] rounded-xl flex items-center justify-center">
              <span className="text-2xl">🇪🇷</span>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#0072BC] via-[#12AD2B] to-[#FFC72C] bg-clip-text text-transparent">
              HabeshLive
            </div>
          </div>
          <Button
            variant="outline"
            className="rounded-full px-6 border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm"
          >
            Login
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0072BC]/20 via-[#12AD2B]/20 to-[#E4002B]/20 opacity-50" />
        <div className="absolute inset-0" 
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0,114,188,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(18,173,43,0.3) 0%, transparent 50%)',
          }}
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Live Counter */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#12AD2B]/20 to-[#12AD2B]/10 backdrop-blur-sm border border-[#12AD2B]/30 rounded-full px-8 py-4 mb-6">
              <div className="relative">
                <div className="w-3 h-3 bg-[#12AD2B] rounded-full animate-pulse" />
                <div className="absolute inset-0 w-3 h-3 bg-[#12AD2B] rounded-full animate-ping" />
              </div>
              <span className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {liveCount}
              </span>
              <span className="text-gray-400 text-lg">people online</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Connect with Habesha
              <br />
              <span className="bg-gradient-to-r from-[#0072BC] via-[#12AD2B] to-[#FFC72C] bg-clip-text text-transparent">
                Around the World
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
              ሰላም! Practice Tigrinya, Amharic, or Oromo. Share culture. Make meaningful connections.
            </p>
          </div>

          {/* Profile Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
            {/* Eritrean Card */}
            <div className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0072BC]/30 to-[#12AD2B]/30 backdrop-blur-sm border border-white/10 hover:border-[#0072BC]/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#0072BC]/20">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0072BC]/20 to-transparent" />
              
              {/* Online Badge */}
              <div className="absolute top-6 left-6 z-10">
                <div className="bg-[#12AD2B] text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  ONLINE
                </div>
              </div>

              {/* Content */}
              <div className="relative h-96 flex flex-col justify-end p-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-6xl">🇪🇷</span>
                  <div>
                    <div className="text-3xl font-bold">Sara, 24</div>
                    <div className="text-gray-300 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Asmara, Eritrea
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-fit bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 rounded-full"
                >
                  🛡️ Safe Mode
                </Button>
              </div>
            </div>

            {/* Ethiopian Card */}
            <div className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#FFC72C]/30 to-[#E4002B]/30 backdrop-blur-sm border border-white/10 hover:border-[#FFC72C]/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-[#FFC72C]/20">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFC72C]/20 to-transparent" />
              
              {/* Online Badge */}
              <div className="absolute top-6 left-6 z-10">
                <div className="bg-[#12AD2B] text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  ONLINE
                </div>
              </div>

              {/* Content */}
              <div className="relative h-96 flex flex-col justify-end p-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-6xl">🇪🇹</span>
                  <div>
                    <div className="text-3xl font-bold">Daniel, 26</div>
                    <div className="text-gray-300 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Addis Ababa, Ethiopia
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-fit bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 rounded-full"
                >
                  📚 Language Practice
                </Button>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Button 
              onClick={() => navigate('/video-chat')}
              size="lg"
              className="group relative bg-gradient-to-r from-[#0072BC] via-[#12AD2B] to-[#0072BC] hover:from-[#0072BC] hover:via-[#12AD2B] hover:to-[#E4002B] text-white rounded-full px-12 py-8 text-xl font-bold shadow-2xl hover:shadow-[#0072BC]/50 transition-all duration-300 hover:scale-110 border-2 border-white/20"
            >
              <Video className="w-7 h-7 mr-3 group-hover:scale-125 transition-transform" />
              Start Video Chat
              <ChevronRight className="w-7 h-7 ml-3 group-hover:translate-x-2 transition-transform" />
            </Button>
            <p className="text-gray-500 mt-4 text-sm">No registration required • 100% Free</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent to-black/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Why Choose <span className="bg-gradient-to-r from-[#0072BC] to-[#12AD2B] bg-clip-text text-transparent">HabeshLive?</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:border-[#0072BC]/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#0072BC]/20">
              <div className="w-20 h-20 bg-gradient-to-br from-[#0072BC] to-[#12AD2B] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <Video className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">HD Video Chat</h3>
              <p className="text-gray-400 leading-relaxed">
                Crystal clear video quality. Connect face-to-face with Habesha worldwide in stunning HD.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:border-[#12AD2B]/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#12AD2B]/20">
              <div className="w-20 h-20 bg-gradient-to-br from-[#12AD2B] to-[#FFC72C] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Safe & Respectful</h3>
              <p className="text-gray-400 leading-relaxed">
                Same-gender options, AI moderation, and cultural sensitivity. Built for our community values.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:border-[#FFC72C]/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#FFC72C]/20">
              <div className="w-20 h-20 bg-gradient-to-br from-[#FFC72C] to-[#E4002B] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Cultural Connection</h3>
              <p className="text-gray-400 leading-relaxed">
                Meet diaspora, practice languages, celebrate our Ethiopian and Eritrean heritage together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-black/30 to-transparent">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                q: "Is HabeshLive free to use?",
                a: "Yes! HabeshLive offers free video chat. Premium features like gender filters and location selection are available through optional subscription."
              },
              {
                q: "How does HabeshLive ensure cultural sensitivity?",
                a: "We have enhanced moderation for our community, same-gender matching options, intention-based matching (language practice, cultural connection), and AI-powered safety features."
              },
              {
                q: "Can I choose same-gender only matching?",
                a: "Absolutely! We understand cultural preferences. Set your matching preferences to same-gender only for comfortable, respectful conversations."
              },
              {
                q: "What safety features are included?",
                a: "Automatic content moderation, quick report buttons, AI monitoring, auto-blur for inappropriate content, and 24/7 moderation team support."
              },
              {
                q: "Can I practice Tigrinya, Amharic, or Oromo?",
                a: "Yes! Select 'Language Practice' as your intention to match with native speakers or fellow learners. Perfect for diaspora youth connecting with roots."
              }
            ].map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="border border-white/10 rounded-2xl px-6 bg-white/5 backdrop-blur-sm hover:border-[#0072BC]/30 transition-colors"
              >
                <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6 text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 leading-relaxed pb-6">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-white/10 backdrop-blur-sm py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0072BC] via-[#12AD2B] to-[#E4002B] rounded-xl flex items-center justify-center">
                <span className="text-2xl">🇪🇷</span>
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-[#0072BC] via-[#12AD2B] to-[#FFC72C] bg-clip-text text-transparent">
                HabeshLive
              </div>
            </div>
            <p className="text-gray-500">Connecting Habesha People Worldwide</p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-8 text-sm">
            {["About Us", "Safety Guidelines", "Community Rules", "Privacy Policy", "Terms of Service", "Cultural Guidelines", "Support", "Contact"].map(link => (
              <a key={link} href="#" className="text-gray-400 hover:text-[#0072BC] transition-colors">
                {link}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-gray-500 pt-8 border-t border-white/10">
            <p>© 2025 HabeshLive. All rights reserved.</p>
            <p className="mt-2 flex items-center justify-center gap-2">
              <span className="text-2xl">🇪🇷</span>
              <span className="text-2xl">🇪🇹</span>
              Built with ❤️ for the Habesha community
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
