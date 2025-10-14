import { useState } from "react";
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
  Loader2,
  Shield,
  Flag
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
  { name: "Meron", age: 23, country: "Eritrea", flag: "🇪🇷", city: "Keren" },
  { name: "Tsinat", age: 25, country: "Eritrea", flag: "🇪🇷", city: "Massawa" },
  { name: "Daniel", age: 26, country: "Ethiopia", flag: "🇪🇹", city: "Addis Ababa" },
  { name: "Samuel", age: 27, country: "Ethiopia", flag: "🇪🇹", city: "Bahir Dar" },
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
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string }>>([]);
  const [messageInput, setMessageInput] = useState("");

  const startMatching = () => {
    setConnectionState('searching');
    setTimeout(() => {
      const randomPartner = mockPartners[Math.floor(Math.random() * mockPartners.length)];
      setPartner(randomPartner);
      setConnectionState('connected');
      
      // Add welcome message
      setTimeout(() => {
        setMessages([{ 
          sender: randomPartner.name, 
          text: `ሰላም! (Selam!) Hi, I'm ${randomPartner.name} from ${randomPartner.city}!`, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1000);
    }, 2500);
  };

  const skipPartner = () => {
    setConnectionState('searching');
    setMessages([]);
    setShowChat(false);
    setTimeout(() => {
      const randomPartner = mockPartners[Math.floor(Math.random() * mockPartners.length)];
      setPartner(randomPartner);
      setConnectionState('connected');
      
      setTimeout(() => {
        setMessages([{ 
          sender: randomPartner.name, 
          text: `Hi! I'm ${randomPartner.name}. Nice to meet you!`, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1000);
    }, 2000);
  };

  const endCall = () => {
    setConnectionState('ready');
    setPartner(null);
    setMessages([]);
    setShowChat(false);
  };

  const sendMessage = () => {
    if (messageInput.trim() && partner) {
      const newMessage = { 
        sender: 'You', 
        text: messageInput,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessageInput("");
      
      // Simulate partner response
      setTimeout(() => {
        const responses = [
          "That's interesting!",
          "I agree with you!",
          "Tell me more about that",
          "Nice! 😊",
          "ከመይ ኣለኻ? (How are you?)"
        ];
        setMessages(prev => [...prev, { 
          sender: partner.name, 
          text: responses[Math.floor(Math.random() * responses.length)],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#0072BC] via-[#12AD2B] to-[#E4002B] rounded-xl flex items-center justify-center">
              <span className="text-2xl">🇪🇷</span>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#0072BC] via-[#12AD2B] to-[#FFC72C] bg-clip-text text-transparent">
              HabeshLive
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-white/10"
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="rounded-full border-white/20 bg-white/5 hover:bg-white/10"
            >
              <X className="w-4 h-4 mr-2" />
              Exit
            </Button>
          </div>
        </div>
      </header>

      {/* Main Video Area */}
      <main className="pt-24 pb-32 min-h-screen p-6">
        <div className="max-w-7xl mx-auto h-[calc(100vh-14rem)]">
          
          {/* Ready State */}
          {connectionState === 'ready' && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-8 max-w-2xl">
                <div className="relative">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#0072BC] to-[#12AD2B] rounded-full flex items-center justify-center shadow-2xl shadow-[#0072BC]/30">
                    <Video className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute -inset-4 bg-gradient-to-br from-[#0072BC]/20 to-[#12AD2B]/20 rounded-full blur-2xl -z-10" />
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-5xl font-bold">Ready to Connect?</h2>
                  <p className="text-xl text-gray-400 max-w-lg mx-auto leading-relaxed">
                    Meet fellow Habesha from around the world. Practice language, share culture, make friends.
                  </p>
                </div>

                <div className="space-y-4">
                  <Button 
                    size="lg" 
                    onClick={startMatching}
                    className="group bg-gradient-to-r from-[#0072BC] via-[#12AD2B] to-[#0072BC] hover:from-[#0072BC] hover:via-[#12AD2B] hover:to-[#E4002B] text-white rounded-full px-12 py-8 text-xl font-bold shadow-2xl hover:shadow-[#0072BC]/50 transition-all duration-300 hover:scale-110"
                  >
                    <Video className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                    Start Matching
                  </Button>
                  
                  <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Safe & Moderated
                    </div>
                    <div className="w-1 h-1 bg-gray-600 rounded-full" />
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      HD Quality
                    </div>
                    <div className="w-1 h-1 bg-gray-600 rounded-full" />
                    <div>100% Free</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Searching State */}
          {connectionState === 'searching' && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-8">
                <div className="relative">
                  <Loader2 className="w-24 h-24 mx-auto text-[#0072BC] animate-spin" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0072BC]/20 to-[#12AD2B]/20 rounded-full blur-3xl animate-pulse" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-4xl font-bold">Finding someone for you...</h2>
                  <p className="text-gray-400 text-lg">Connecting you with the Habesha community</p>
                </div>
              </div>
            </div>
          )}

          {/* Connected State */}
          {connectionState === 'connected' && (
            <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Remote Video (Partner) */}
              <div className="lg:col-span-2 relative bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0072BC]/10 via-transparent to-[#12AD2B]/10" />
                
                {/* Partner Info Overlay */}
                <div className="absolute top-6 left-6 bg-black/70 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/20 shadow-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 bg-[#12AD2B] rounded-full animate-pulse shadow-lg shadow-[#12AD2B]" />
                    <span className="text-[#12AD2B] font-bold text-sm uppercase tracking-wider">Connected</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{partner?.flag}</span>
                    <div>
                      <div className="text-2xl font-bold">{partner?.name}, {partner?.age}</div>
                      <div className="text-sm text-gray-400 flex items-center gap-1">
                        <span>{partner?.city}, {partner?.country}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Safety Badge */}
                <div className="absolute top-6 right-6 bg-[#12AD2B]/20 backdrop-blur-xl rounded-full px-5 py-2.5 border border-[#12AD2B]/40 shadow-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#12AD2B]" />
                    <span className="text-[#12AD2B] text-sm font-bold">Safe Mode</span>
                  </div>
                </div>

                {/* Report Button */}
                <div className="absolute bottom-6 right-6">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full bg-black/50 backdrop-blur-xl border-white/20 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400"
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    Report
                  </Button>
                </div>
              </div>

              {/* Local Video (You) */}
              <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl aspect-video lg:aspect-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFC72C]/10 via-transparent to-[#E4002B]/10 scale-x-[-1]" />
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-xl rounded-full px-5 py-2.5 border border-white/20">
                  <span className="font-bold">You</span>
                </div>
                
                {/* Camera Off Indicator */}
                {!isCameraOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="text-center space-y-3">
                      <VideoOff className="w-16 h-16 mx-auto text-gray-600" />
                      <p className="text-gray-400">Camera is off</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Control Bar */}
        {connectionState !== 'ready' && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
            <div className="flex items-center gap-4 bg-black/80 backdrop-blur-xl border border-white/20 rounded-full px-8 py-5 shadow-2xl">
              {/* Camera Toggle */}
              <Button
                variant={isCameraOn ? "ghost" : "destructive"}
                size="icon"
                onClick={() => setIsCameraOn(!isCameraOn)}
                className="rounded-full w-14 h-14 hover:scale-110 transition-transform"
              >
                {isCameraOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
              </Button>

              {/* Mic Toggle */}
              <Button
                variant={isMicOn ? "ghost" : "destructive"}
                size="icon"
                onClick={() => setIsMicOn(!isMicOn)}
                className="rounded-full w-14 h-14 hover:scale-110 transition-transform"
              >
                {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              </Button>

              {/* Speaker Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                className="rounded-full w-14 h-14 hover:scale-110 transition-transform"
              >
                {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
              </Button>

              <div className="w-px h-10 bg-white/20 mx-2" />

              {/* Chat Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowChat(!showChat)}
                className="rounded-full w-14 h-14 hover:scale-110 transition-transform relative"
              >
                <MessageCircle className="w-6 h-6" />
                {messages.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-[#E4002B] rounded-full text-xs flex items-center justify-center font-bold border-2 border-black">
                    {messages.length}
                  </span>
                )}
              </Button>

              {connectionState === 'connected' && (
                <>
                  {/* Skip Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={skipPartner}
                    className="rounded-full w-14 h-14 border-2 border-[#0072BC] text-[#0072BC] hover:bg-[#0072BC] hover:text-white hover:scale-110 transition-all"
                  >
                    <SkipForward className="w-6 h-6" />
                  </Button>

                  {/* End Call Button */}
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={endCall}
                    className="rounded-full w-14 h-14 hover:scale-110 transition-transform"
                  >
                    <Phone className="w-6 h-6 rotate-[135deg]" />
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Chat Sidebar */}
        {showChat && connectionState === 'connected' && (
          <div className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-black/95 backdrop-blur-xl border-l border-white/20 flex flex-col z-50 animate-in slide-in-from-right duration-300">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-[#0072BC]" />
                <h3 className="text-xl font-bold">Chat</h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowChat(false)}
                className="rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No messages yet</p>
                  <p className="text-sm">Say hi to {partner?.name}!</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div 
                    key={idx}
                    className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                        msg.sender === 'You' 
                          ? 'bg-gradient-to-r from-[#0072BC] to-[#12AD2B] text-white' 
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      <div className="text-xs opacity-70 mb-1">{msg.sender} • {msg.time}</div>
                      <div className="text-sm leading-relaxed">{msg.text}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-white/10">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-[#0072BC] text-white placeholder:text-gray-500"
                />
                <Button 
                  onClick={sendMessage}
                  size="icon"
                  disabled={!messageInput.trim()}
                  className="rounded-full w-12 h-12 bg-gradient-to-r from-[#0072BC] to-[#12AD2B] hover:from-[#0072BC] hover:to-[#E4002B] disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default VideoChat;
