import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, MessageCircle, Shield, Camera, Mic, Video as VideoIcon, User } from "lucide-react";
import { RotatingGlobe } from "@/components/RotatingGlobe";
import { ReportDialog } from "@/components/ReportDialog";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { SettingsDialog } from "@/components/SettingsDialog";
import { ManageAccountDialog } from "@/components/ManageAccountDialog";

export default function VideoChat() {
  const navigate = useNavigate();
  const [isMatching, setIsMatching] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showManageAccountDialog, setShowManageAccountDialog] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<Array<{text: string, sender: 'me' | 'other'}>>([]);
  const [matchedUser] = useState({
    name: "Tal",
    flag: "🇹🇭",
    country: "Thailand",
    online: true
  });

  useEffect(() => {
    // Simulate finding a match
    if (isMatching) {
      const timer = setTimeout(() => {
        setIsMatching(false);
        setIsConnected(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isMatching]);

  const handleNext = () => {
    setIsConnected(false);
    setIsMatching(true);
    setShowChat(false);
    setMessages([]);
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      setMessages([...messages, { text: chatMessage, sender: 'me' }]);
      setChatMessage("");
      // Simulate other user response
      setTimeout(() => {
        setMessages(prev => [...prev, { text: "Thanks for your message!", sender: 'other' }]);
      }, 1000);
    }
  };

  const handleEndChat = () => {
    navigate('/');
  };

  const handleOpenManageAccount = () => {
    setShowSettingsDialog(false);
    setShowManageAccountDialog(true);
  };

  const handleBackToSettings = () => {
    setShowManageAccountDialog(false);
    setShowSettingsDialog(true);
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Header - Desktop */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="text-2xl font-bold">habesha</div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="bg-[#00D9B4] hover:bg-[#00c9a4] text-black border-0">
              Join Azar Creators 🎨
            </Button>
            <Button variant="outline" className="bg-gray-800 hover:bg-gray-700 text-white border-0">
              💎 Shop
            </Button>
            <Button variant="outline" className="bg-gray-800 hover:bg-gray-700 text-white border-0">
              🕐 History
            </Button>
            <button 
              onClick={() => setShowSettingsDialog(true)}
              className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-screen pt-0 md:pt-20">
        {/* Left Sidebar - Desktop Only */}
        <div className="hidden md:flex flex-col items-center gap-4 p-4 bg-[#0a0a0a]">
          <button className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center">
            <Camera className="w-6 h-6" />
          </button>
          <button className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center relative">
            <span className="text-2xl">✨</span>
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          <button className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center">
            <span className="text-2xl">😊</span>
          </button>
        </div>

        {/* Video Chat Area */}
        <div className="flex-1 relative">
          {/* Desktop: Side by Side */}
          <div className="hidden md:grid md:grid-cols-2 gap-0 h-full">
            {/* Left Video - My Camera */}
            <div className="relative bg-black h-full flex items-center justify-center">
              <div className="text-gray-600 text-center">
                <Camera className="w-16 h-16 mx-auto mb-2" />
                <p>Your Camera</p>
              </div>
            </div>

            {/* Right Video - Matched User */}
            <div className="relative bg-black h-full flex items-center justify-center">
              {isMatching ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Blurred profile background */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
                      alt="Profile"
                      className="w-64 h-64 rounded-full blur-3xl opacity-20"
                    />
                  </div>
                  {/* Rotating globe */}
                  <div className="relative z-10 text-center">
                    <RotatingGlobe />
                    <p className="text-xl font-bold mt-6">Finding your next match...</p>
                  </div>
                </div>
              ) : isConnected ? (
                <>
                  {/* User Info - Top Left */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full z-10">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                      alt="User"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{matchedUser.name}</span>
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      </div>
                      <div className="text-sm text-gray-300 flex items-center gap-1">
                        <span>{matchedUser.flag}</span>
                        <span>{matchedUser.country}</span>
                      </div>
                    </div>
                  </div>

                  {/* Report Button - Top Right */}
                  <button
                    onClick={() => setShowReportDialog(true)}
                    className="absolute top-4 right-4 w-12 h-12 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/80 z-10"
                  >
                    <Shield className="w-6 h-6" />
                  </button>

                  {/* Video Placeholder */}
                  <div className="text-gray-600 text-center">
                    <VideoIcon className="w-16 h-16 mx-auto mb-2" />
                    <p>Matched User Video</p>
                  </div>
                </>
              ) : null}
            </div>

            {/* Small Self View - Desktop (when connected) */}
            {isConnected && (
              <div className="absolute top-4 right-4 w-48 h-32 bg-black rounded-xl overflow-hidden border-2 border-gray-700 z-10">
                <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
                  Your Camera
                </div>
              </div>
            )}
          </div>

          {/* Mobile: Stacked with Toggle */}
          <div className="md:hidden h-full flex flex-col relative">
            {isMatching ? (
              <>
                {/* Matched User Area - with blurred background and globe */}
                <div className="flex-1 relative bg-black flex items-center justify-center">
                  {/* Blurred profile background */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
                      alt="Profile"
                      className="w-48 h-48 rounded-full blur-3xl opacity-20"
                    />
                  </div>
                  {/* Rotating globe */}
                  <div className="relative z-10 text-center">
                    <RotatingGlobe />
                    <p className="text-xl font-bold mt-6">Finding your next match...</p>
                  </div>
                </div>
                
                {/* My Camera - stays visible */}
                <div className="flex-1 relative bg-black flex items-center justify-center border-t border-gray-800">
                  <div className="text-gray-600 text-center">
                    <Camera className="w-16 h-16 mx-auto mb-2" />
                    <p>Your Camera</p>
                  </div>
                </div>
              </>
            ) : isConnected ? (
              <>
                {!isFullScreen ? (
                  /* Split View: Matched User Top, My Camera Bottom */
                  <>
                    {/* Matched User Video - Top Half */}
                    <div className="flex-1 relative bg-black flex items-center justify-center">
                      {/* User Info - Top Left */}
                      <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full z-10">
                        <img
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                          alt="User"
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-sm">{matchedUser.name}</span>
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          </div>
                          <div className="text-xs text-gray-300 flex items-center gap-1">
                            <span>{matchedUser.flag}</span>
                            <span>{matchedUser.country}</span>
                          </div>
                        </div>
                      </div>

                      {/* Report Button - Top Right */}
                      <button
                        onClick={() => setShowReportDialog(true)}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center z-10"
                      >
                        <div className="relative">
                          <Shield className="w-5 h-5 text-black" />
                          <span className="absolute inset-0 flex items-center justify-center text-black text-xs font-bold">!</span>
                        </div>
                      </button>

                      {/* Close Button */}
                      <button
                        onClick={handleEndChat}
                        className="absolute top-4 right-16 w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center z-10"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      {/* Video Placeholder */}
                      <div className="text-gray-600 text-center">
                        <VideoIcon className="w-16 h-16 mx-auto mb-2" />
                        <p>Matched User Video</p>
                      </div>
                    </div>

                    {/* My Camera - Bottom Half */}
                    <div className="flex-1 relative bg-black flex items-center justify-center border-t border-gray-800">
                      <div className="text-gray-600 text-center">
                        <Camera className="w-16 h-16 mx-auto mb-2" />
                        <p>Your Camera</p>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Full Screen: Matched User Full, My Camera PIP */
                  <>
                    {/* Matched User Video - Full Screen */}
                    <div className="flex-1 relative bg-black flex items-center justify-center">
                      {/* User Info - Top Left */}
                      <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full z-10">
                        <img
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                          alt="User"
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-sm">{matchedUser.name}</span>
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          </div>
                          <div className="text-xs text-gray-300 flex items-center gap-1">
                            <span>{matchedUser.flag}</span>
                            <span>{matchedUser.country}</span>
                          </div>
                        </div>
                      </div>

                      {/* Report Button - Top Right */}
                      <button
                        onClick={() => setShowReportDialog(true)}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center z-10"
                      >
                        <div className="relative">
                          <Shield className="w-5 h-5 text-black" />
                          <span className="absolute inset-0 flex items-center justify-center text-black text-xs font-bold">!</span>
                        </div>
                      </button>

                      {/* Close Button */}
                      <button
                        onClick={handleEndChat}
                        className="absolute top-4 right-16 w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center z-10"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      {/* Video Placeholder */}
                      <div className="text-gray-600 text-center">
                        <VideoIcon className="w-16 h-16 mx-auto mb-2" />
                        <p>Matched User Video</p>
                      </div>

                      {/* My Camera - PIP (Picture in Picture) - Top Right */}
                      <div className="absolute top-16 right-4 w-24 h-32 bg-black rounded-lg overflow-hidden border-2 border-gray-700 z-10">
                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                          You
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-8 z-20">
        <div className="max-w-4xl mx-auto">
          {/* Mobile Controls */}
          <div className="md:hidden">
            {/* Safety Message - Small */}
            <p className="text-center text-xs mb-3 text-gray-400 px-4">
              HabeshaLive cares about your safety. Check out our{" "}
              <a href="#" className="text-[#00D9B4] hover:underline">
                Community Guidelines
              </a>{" "}
              and have fun!
            </p>

            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-3 mb-4">
              {/* Message Button */}
              <button 
                onClick={() => setShowChat(!showChat)}
                className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 hover:bg-black/80 flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </button>

              {/* Toggle View Button */}
              <button 
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 hover:bg-black/80 flex items-center justify-center"
              >
                {isFullScreen ? (
                  <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
                    <div className="bg-white rounded-sm"></div>
                    <div className="bg-white rounded-sm"></div>
                    <div className="bg-white rounded-sm"></div>
                    <div className="bg-white rounded-sm"></div>
                  </div>
                ) : (
                  <div className="relative w-5 h-5">
                    <div className="absolute inset-0 bg-white rounded-sm opacity-50"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-sm"></div>
                  </div>
                )}
              </button>

              {/* Next Button */}
              <Button
                onClick={handleNext}
                className="bg-white hover:bg-gray-200 text-black font-bold px-6 py-5 rounded-full text-base"
              >
                Next →
              </Button>
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:block">
            {/* Safety Message */}
            <p className="text-center text-sm mb-4 text-gray-400">
              HabeshaLive cares about your safety. Check out our{" "}
              <a href="#" className="text-[#00D9B4] hover:underline">
                Community Guidelines
              </a>{" "}
              and have fun!
            </p>

            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-4 mb-4">
              {/* Message Button */}
              <button className="w-14 h-14 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </button>

              {/* Next Button */}
              <Button
                onClick={handleNext}
                className="bg-white hover:bg-gray-200 text-black font-bold px-8 py-6 rounded-full text-lg"
              >
                Next →
              </Button>

              {/* Filter Button */}
              <button className="w-14 h-14 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center">
                <span className="text-2xl">🎭</span>
              </button>
            </div>

            {/* ESC hint */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-gray-800 rounded">esc</kbd>
                <span>End Video Chat</span>
                <span className="text-gray-600">Press esc key to end video chat</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Next Video Chat</span>
                <span className="text-gray-600">Press right key to meet others</span>
                <kbd className="px-2 py-1 bg-gray-800 rounded">→</kbd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface - Mobile */}
      {showChat && isConnected && (
        <div className="md:hidden fixed bottom-20 left-4 right-4 bg-black/90 backdrop-blur-lg rounded-2xl p-4 z-30 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Chat</h3>
            <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Messages */}
          <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`text-sm px-3 py-2 rounded-lg ${
                  msg.sender === 'me'
                    ? 'bg-[#00D9B4] text-black ml-8'
                    : 'bg-white/10 text-white mr-8'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-white/10 text-white placeholder-gray-400 rounded-full px-4 py-2 text-sm border border-white/10 focus:outline-none focus:border-[#00D9B4]"
            />
            <button
              onClick={handleSendMessage}
              className="bg-[#00D9B4] text-black rounded-full px-4 py-2 text-sm font-medium hover:bg-[#00c9a4]"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <ReportDialog open={showReportDialog} onOpenChange={setShowReportDialog} />
      <EditProfileDialog open={showProfileDialog} onOpenChange={setShowProfileDialog} />
      <SettingsDialog 
        open={showSettingsDialog} 
        onOpenChange={setShowSettingsDialog}
        onManageAccount={handleOpenManageAccount}
      />
      <ManageAccountDialog
        open={showManageAccountDialog}
        onOpenChange={setShowManageAccountDialog}
        onBack={handleBackToSettings}
      />
    </div>
  );
}
