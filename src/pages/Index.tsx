import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Video, Shield, Users, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [liveCount] = useState("18,542");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/30 backdrop-blur-md border-b border-border/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--eritrean-blue))] via-[hsl(var(--eritrean-green))] to-[hsl(var(--gold))] bg-clip-text text-transparent">
            HabeshLive
          </div>
          <Button
            variant="outline"
            className="rounded-full px-6 border-primary/30 hover:bg-primary/10"
          >
            Login
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="relative pt-32 pb-20 px-6 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.85)), url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Live Counter */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-3 h-3 bg-secondary rounded-full animate-pulse shadow-[0_0_20px_hsl(var(--secondary))]" />
              <span className="text-3xl font-bold">{liveCount}</span>
              <span className="text-muted-foreground text-lg">people matching now!</span>
            </div>
          </div>

          {/* Profile Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
            {/* Card 1 - Eritrean */}
            <div className="relative rounded-2xl overflow-hidden h-96 bg-card shadow-[var(--shadow-card)] group hover:scale-[1.02] transition-transform">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30" />
              <div className="absolute top-6 left-6">
                <div className="bg-secondary/90 backdrop-blur-sm text-secondary-foreground px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  ONLINE
                </div>
              </div>
              <div className="absolute bottom-6 left-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl">🇪🇷</span>
                  <div>
                    <div className="text-2xl font-bold">Sara, 24</div>
                    <div className="text-sm text-white/80">Asmara, Eritrea</div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-6 right-6">
                <Button
                  variant="outline"
                  className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 rounded-full"
                >
                  🛡️ Safe Mode
                </Button>
              </div>
            </div>

            {/* Card 2 - Ethiopian */}
            <div className="relative rounded-2xl overflow-hidden h-96 bg-card shadow-[var(--shadow-card)] group hover:scale-[1.02] transition-transform">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-[hsl(var(--gold))]/30" />
              <div className="absolute top-6 left-6">
                <div className="bg-secondary/90 backdrop-blur-sm text-secondary-foreground px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  ONLINE
                </div>
              </div>
              <div className="absolute bottom-6 left-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl">🇪🇹</span>
                  <div>
                    <div className="text-2xl font-bold">Daniel, 26</div>
                    <div className="text-sm text-white/80">Addis Ababa, Ethiopia</div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-6 right-6">
                <Button
                  variant="outline"
                  className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 rounded-full"
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
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-12 py-7 text-xl font-bold shadow-[var(--shadow-glow)] hover:shadow-[0_0_60px_hsl(var(--primary)_/_0.5)] transition-all group"
            >
              <Video className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
              Start Video Chat
              <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-6 bg-gradient-to-b from-background to-card/30">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Connect with Habesha
            <br />
            <span className="bg-gradient-to-r from-[hsl(var(--eritrean-blue))] via-[hsl(var(--eritrean-green))] to-[hsl(var(--gold))] bg-clip-text text-transparent">
              Around the World
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Practice Amharic, Tigrinya, or Oromo. Share our culture. Make meaningful connections with fellow Ethiopians and Eritreans worldwide.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-colors group">
              <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--eritrean-blue))] to-[hsl(var(--eritrean-green))] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Video className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">HD Video Chat</h3>
              <p className="text-muted-foreground leading-relaxed">
                Crystal clear video quality to connect face-to-face with Habesha community members worldwide.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-colors group">
              <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--eritrean-blue))] to-[hsl(var(--eritrean-red))] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Safe & Secure</h3>
              <p className="text-muted-foreground leading-relaxed">
                Enhanced moderation, same-gender options, and cultural sensitivity built-in for respectful connections.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-colors group">
              <div className="w-16 h-16 bg-gradient-to-br from-[hsl(var(--eritrean-green))] to-[hsl(var(--gold))] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Cultural Connection</h3>
              <p className="text-muted-foreground leading-relaxed">
                Meet diaspora, practice languages, and celebrate our shared Ethiopian and Eritrean heritage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem
              value="item-1"
              className="border border-border rounded-2xl px-8 bg-card"
            >
              <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6">
                Is HabeshLive free to use?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                Yes! HabeshLive offers free video chat for the Habesha community. Premium features like gender filters and region selection are available through our optional subscription.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-2"
              className="border border-border rounded-2xl px-8 bg-card"
            >
              <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6">
                How does HabeshLive ensure cultural sensitivity?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                We have enhanced moderation specifically for our community, same-gender matching options, intention-based matching (language practice, cultural connection, etc.), and AI-powered safety features to maintain respectful interactions.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-3"
              className="border border-border rounded-2xl px-8 bg-card"
            >
              <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6">
                Can I choose to only match with the same gender?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                Absolutely! We understand cultural preferences. You can set your matching preferences to same-gender only, ensuring comfortable and respectful conversations aligned with our values.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-4"
              className="border border-border rounded-2xl px-8 bg-card"
            >
              <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6">
                What safety features does HabeshLive offer?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                We offer automatic content moderation, quick report buttons, AI chaperone monitoring for mixed-gender chats, auto-blur for inappropriate content, and 24/7 moderation team support.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-5"
              className="border border-border rounded-2xl px-8 bg-card"
            >
              <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6">
                Can I practice Amharic, Tigrinya, or Oromo?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                Yes! Select "Language Practice" as your intention, and we'll match you with native speakers or fellow learners. This is perfect for diaspora youth wanting to connect with their roots.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--eritrean-blue))] via-[hsl(var(--eritrean-green))] to-[hsl(var(--gold))] bg-clip-text text-transparent mb-2">
              HabeshLive
            </div>
            <p className="text-muted-foreground">Connecting Habesha People Worldwide</p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-8 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              About Us
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Safety Guidelines
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Community Rules
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Cultural Guidelines
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Support
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </div>

          {/* Social Media */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-muted hover:bg-primary transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-muted hover:bg-primary transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />
              </svg>
            </a>
            <a
              href="#"
              className="w-12 h-12 rounded-full bg-muted hover:bg-primary transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.70,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z" />
              </svg>
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 HabeshLive. All rights reserved.</p>
            <p className="mt-2">🇪🇹 🇪🇷 Built with love for the Habesha community</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
