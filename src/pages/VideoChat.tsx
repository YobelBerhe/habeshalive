"use client";

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
  Flag,
  ChevronDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type ConnectionState = 'ready' | 'searching' | 'connected';

interface Partner {
  name: string;
  age: number;
  city: string;
  image: string;
}

const mockPartners: Partner[] = [
  { name: "Sara", age: 24, city: "Los Angeles, USA", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop" },
  { name: "Daniel", age: 26, city: "London, UK", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop" },
  { name: "Meron", age: 23, city: "Toronto, Canada", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop" },
  { name: "Samuel", age: 27, city: "Dubai, UAE", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop" },
];

export default function VideoChat() {
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
      
      setTimeout(() => {
        setMessages([{ 
          sender: randomPartner.name, 
          text: `Hi! I'm ${randomPartner.name}. Nice to meet you!`
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
          text: "Hello! 👋"
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
      setMessages([...messages, { sender: 'You', text: messageInput }]);
      setMessageInput("");
      
      setTimeout(() => {
        const responses = ["That's cool!", "I agree!", "Nice! 😊", "Tell me more"];
        setMessages(prev => [...prev, { 
          sender: partner.name, 
          text: responses[Math.floor(Math.random() * responses.length)]
        }]);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#181818] text-white">
      {/* Header - Azar Style */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-sm px-6 py-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            className="text-2xl font-bold tracking-tight cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            habeshalive
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
              className="bg-white/10 border-white/20 hover:bg-white/20 rounded-full"
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
          
          {/* Ready State - Azar Style */}
          {connectionState === 'ready' && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-8 max-w-xl">
                <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl">
                  <Video className="w-16 h-16 text-black" />
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-5xl font-bold">Ready to Connect?</h2>
                  <p className="text-xl text-gray-400 leading-relaxed">
                    Meet Habesha people worldwide. Practice language, share culture, make friends.
                  </p>
                </div>

                <Button 
                  size="lg" 
                  onClick={startMatching}
                  className="bg-white text-black hover:bg-gray-100 rounded-full px-12 py-7 text-xl font-semibold shadow-xl hover:shadow-2xl transition-all"
                >
                  <Video className="w-6 h-6 mr-3" />
                  Start Matching
                </Button>

                {/* Filters */}
                <div className="flex items-center justify-center gap-4 pt-8">
                  <Button
                    variant="outline"
                    className="bg-white/10 border-white/20 hover:bg-white/20 rounded-full px-6"
                  >
                    <span className="flex items-center gap-2">
                      Gender
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white/10 border-white/20 hover:bg-white/20 rounded-full px-6"
                  >
                    <span className="flex items-center gap-2">
                      Country
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Searching State - Azar Style */}
          {connectionState === 'searching' && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-8">
                <Loader2 className="w-24 h-24 mx-auto text-white animate-spin" />
                <div className="space-y-3">
                  <h2 className="text-4xl font-bold">Finding someone for you...</h2>
                  <p className="text-gray-400 text-lg">Connecting with Habesha community</p>
                </div>
              </div>
            </div>
          )}

          {/* Connected State - Azar Style */}
          {connectionState === 'connected' && (
            <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Remote Video (Partner) - Azar Style */}
              <div className="lg:col-span-2 relative bg-black rounded-3xl overflow-hidden border-2 border-gray-800 shadow-2xl">
                {/* Partner Video Background */}
                <img 
                  src={partner?.image}
                  alt={partner?.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                
                {/* Online Badge - Top Left */}
                <div className="absolute top-6 left-6 z-10">
                  <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    ONLINE
                  </div>
                </div>

                {/* Partner Info - Bottom Left */}
                <div className="absolute bottom-6 left-6 z-10 text-white">
                  <div className="text-3xl font-bold mb-1">
                    {partner?.name}, {partner?.age}
                  </div>
                  <div className="text-sm text-gray-300">
                    {partner?.city}
                  </div>
                </div>

                {/* Report Button - Bottom Right */}
                <div className="absolute bottom-6 right-6 z-10">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-black/50 backdrop-blur-md border-white/20 text-white hover:bg-red-500/20 hover:border-red-500/50 rounded-full"
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    Report
                  </Button>
                </div>
              </div>

              {/* Local Video (You) - Azar Style */}
              <div className="relative bg-black rounded-3xl overflow-hidden border-2 border-gray-800 shadow-2xl aspect-video lg:aspect-auto">
                {/* Placeholder for local video */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
                
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
                  <span className="font-semibold">You</span>
                </div>
                
                {/* Camera Off Indicator */}
                {!isCameraOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/90">
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

        {/* Control Bar - Azar Style */}
        {connectionState !== 'ready' && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
            <div className="flex items-center gap-3 bg-black/90 backdrop-blur-xl border border-white/10 rounded-full px-6 py-4 shadow-2xl">
              {/* Camera */}
              <Button
                variant={isCameraOn ? "ghost" : "destructive"}
                size="icon"
                onClick={() => setIsCameraOn(!isCameraOn)}
                className="rounded-full w-12 h-12 hover:scale-110 transition-all"
              >
                {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </Button>

              {/* Mic */}
              <Button
                variant={isMicOn ? "ghost" : "destructive"}
                size="icon"
                onClick={() => setIsMicOn(!isMicOn)}
                className="rounded-full w-12 h-12 hover:scale-110 transition-all"
              >
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </Button>

              {/* Speaker */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                className="rounded-full w-12 h-12 hover:scale-110 transition-all"
              >
                {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </Button>

              <div className="w-px h-8 bg-white/20 mx-1" />

              {/* Chat */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowChat(!showChat)}
                className="rounded-full w-12 h-12 hover:scale-110 transition-all relative"
              >
                <MessageCircle className="w-5 h-5" />
                {messages.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
                    {messages.length}
                  </span>
                )}
              </Button>

              {connectionState === 'connected' && (
                <>
                  {/* Skip */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={skipPartner}
                    className="rounded-full w-12 h-12 hover:scale-110 transition-all bg-white text-black hover:bg-gray-200"
                  >
                    <SkipForward className="w-5 h-5" />
                  </Button>

                  {/* End Call */}
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={endCall}
                    className="rounded-full w-12 h-12 hover:scale-110 transition-all"
                  >
                    <Phone className="w-5 h-5 rotate-[135deg]" />
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Chat Sidebar - Azar Style */}
        {showChat && connectionState === 'connected' && (
          <div className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-[#1a1a1a] border-l border-gray-800 flex flex-col z-50 animate-in slide-in-from-right duration-300">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold">Messages</h3>
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
                          ? 'bg-white text-black' 
                          : 'bg-gray-800 text-white'
                      }`}
                    >
                      <div className="text-sm">{msg.text}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-gray-800">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-white text-white placeholder:text-gray-500"
                />
                <Button 
                  onClick={sendMessage}
                  disabled={!messageInput.trim()}
                  className="rounded-full w-12 h-12 bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
}
