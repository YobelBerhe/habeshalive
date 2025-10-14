import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  MessageCircle, 
  SkipForward, 
  Phone,
  Settings,
  X,
  Send,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type ConnectionState = 'ready' | 'searching' | 'connected';

interface Partner {
  name: string;
  age: number;
  country: string;
  flag: string;
  city: string;
}

const mockPartners: Partner[] = [
  { name: "Sara", age: 24, country: "Eritrea", flag: "🇪🇷", city: "Asmara" },
  { name: "Daniel", age: 26, country: "Ethiopia", flag: "🇪🇹", city: "Addis Ababa" },
  { name: "Meron", age: 23, country: "Eritrea", flag: "🇪🇷", city: "Keren" },
  { name: "Samuel", age: 27, country: "Ethiopia", flag: "🇪🇹", city: "Bahir Dar" },
  { name: "Tsinat", age: 25, country: "Eritrea", flag: "🇪🇷", city: "Massawa" },
  { name: "Yonas", age: 28, country: "Ethiopia", flag: "🇪🇹", city: "Gondar" },
];

const VideoChat = () => {
  const navigate = useNavigate();
  const [connectionState, setConnectionState] = useState<ConnectionState>('ready');
  const [partner, setPartner] = useState<Partner | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: string; text: string }>>([]);
  const [messageInput, setMessageInput] = useState("");

  const startMatching = () => {
    setConnectionState('searching');
    setTimeout(() => {
      const randomPartner = mockPartners[Math.floor(Math.random() * mockPartners.length)];
      setPartner(randomPartner);
      setConnectionState('connected');
    }, 2000);
  };

  const skipPartner = () => {
    setConnectionState('searching');
    setMessages([]);
    setTimeout(() => {
      const randomPartner = mockPartners[Math.floor(Math.random() * mockPartners.length)];
      setPartner(randomPartner);
      setConnectionState('connected');
    }, 2000);
  };

  const endCall = () => {
    setConnectionState('ready');
    setPartner(null);
    setMessages([]);
    setShowChat(false);
  };

  const sendMessage = () => {
    if (messageInput.trim()) {
      setMessages([...messages, { sender: 'You', text: messageInput }]);
      setMessageInput("");
      
      // Simulate partner response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          sender: partner?.name || 'Partner', 
          text: "Thanks for your message!" 
        }]);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            className="text-2xl font-bold bg-gradient-to-r from-[hsl(var(--eritrean-blue))] via-[hsl(var(--eritrean-green))] to-[hsl(var(--gold))] bg-clip-text text-transparent cursor-pointer"
            onClick={() => navigate('/')}
          >
            HabeshLive
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="rounded-full"
            >
              <X className="w-4 h-4 mr-2" />
              Exit
            </Button>
          </div>
        </div>
      </header>

      {/* Main Video Area */}
      <main className="pt-20 min-h-screen p-6">
        <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)]">
          {connectionState === 'ready' && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Video className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-4xl font-bold">Ready to Connect?</h2>
                <p className="text-muted-foreground text-lg max-w-md">
                  Meet fellow Habesha from around the world. Practice language, share culture, make friends.
                </p>
                <Button 
                  size="lg" 
                  onClick={startMatching}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-lg font-semibold shadow-[var(--shadow-glow)]"
                >
                  Start Matching
                </Button>
              </div>
            </div>
          )}

          {connectionState === 'searching' && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-6">
                <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin" />
                <h2 className="text-3xl font-bold">Finding someone for you...</h2>
                <p className="text-muted-foreground">Connecting you with Habesha community</p>
              </div>
            </div>
          )}

          {connectionState === 'connected' && (
            <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Remote Video (larger) */}
              <div className="md:col-span-2 relative bg-muted rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                
                {/* Partner Info Overlay */}
                <div className="absolute top-6 left-6 bg-black/50 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                      <span className="text-secondary font-semibold text-sm">CONNECTED</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-3xl">{partner?.flag}</span>
                    <div>
                      <div className="text-xl font-bold">{partner?.name}, {partner?.age}</div>
                      <div className="text-sm text-muted-foreground">{partner?.city}, {partner?.country}</div>
                    </div>
                  </div>
                </div>

                {/* Safety Badge */}
                <div className="absolute top-6 right-6 bg-secondary/20 backdrop-blur-md rounded-full px-4 py-2 border border-secondary/30">
                  <span className="text-secondary text-sm font-semibold">🛡️ Safe Mode</span>
                </div>
              </div>

              {/* Local Video (smaller, mirrored) */}
              <div className="relative bg-muted rounded-2xl overflow-hidden aspect-video md:aspect-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-gold/20 scale-x-[-1]" />
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md rounded-full px-4 py-2">
                  <span className="text-sm font-semibold">You</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Control Bar */}
        {connectionState !== 'ready' && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-card/90 backdrop-blur-md border border-border rounded-full px-6 py-4 shadow-2xl">
            <Button
              variant={isCameraOn ? "secondary" : "destructive"}
              size="icon"
              onClick={() => setIsCameraOn(!isCameraOn)}
              className="rounded-full w-12 h-12"
            >
              {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </Button>

            <Button
              variant={isMicOn ? "secondary" : "destructive"}
              size="icon"
              onClick={() => setIsMicOn(!isMicOn)}
              className="rounded-full w-12 h-12"
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>

            <Button
              variant={isSpeakerOn ? "secondary" : "outline"}
              size="icon"
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              className="rounded-full w-12 h-12"
            >
              {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>

            <div className="w-px h-8 bg-border mx-2" />

            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowChat(!showChat)}
              className="rounded-full w-12 h-12 relative"
            >
              <MessageCircle className="w-5 h-5" />
              {messages.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full text-xs flex items-center justify-center">
                  {messages.length}
                </span>
              )}
            </Button>

            {connectionState === 'connected' && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={skipPartner}
                  className="rounded-full w-12 h-12 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <SkipForward className="w-5 h-5" />
                </Button>

                <Button
                  variant="destructive"
                  size="icon"
                  onClick={endCall}
                  className="rounded-full w-12 h-12"
                >
                  <Phone className="w-5 h-5 rotate-[135deg]" />
                </Button>
              </>
            )}
          </div>
        )}

        {/* Chat Sidebar */}
        {showChat && connectionState === 'connected' && (
          <div className="fixed right-0 top-20 bottom-0 w-full md:w-96 bg-card border-l border-border p-6 flex flex-col z-40">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Chat</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowChat(false)}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {messages.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-2xl max-w-[80%] ${
                    msg.sender === 'You' 
                      ? 'bg-primary text-primary-foreground ml-auto' 
                      : 'bg-muted'
                  }`}
                >
                  <div className="text-xs opacity-70 mb-1">{msg.sender}</div>
                  <div>{msg.text}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-muted border border-border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button 
                onClick={sendMessage}
                size="icon"
                className="rounded-full"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default VideoChat;
