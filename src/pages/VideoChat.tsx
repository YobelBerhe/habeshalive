import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  X, 
  MessageCircle, 
  Shield, 
  Camera, 
  Video as VideoIcon, 
  User,
  ChevronLeft,
  CheckCircle2,
  ShieldCheck,
  Ban,
  Users,
  Lock,
  AlertCircle
} from "lucide-react";
import { RotatingGlobe } from "@/components/RotatingGlobe";
import { ReportDialog } from "@/components/ReportDialog";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { SettingsDialog } from "@/components/SettingsDialog";
import { ManageAccountDialog } from "@/components/ManageAccountDialog";

type OnboardingStep = 'birthday' | 'gender' | 'ethnicity' | 'name' | 'safety' | 'preferences' | 'complete';
type ConnectionState = 'onboarding' | 'ready' | 'searching' | 'connected';
type MatchingMode = 'both' | 'same-gender-only' | 'opposite-only';

interface Partner {
  name: string;
  age: number;
  city: string;
  image: string;
  gender: 'male' | 'female';
  flag: string;
  country: string;
  online: boolean;
}

const mockPartners: Partner[] = [
  { name: "Sara", age: 24, city: "Los Angeles", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop", gender: 'female', flag: "🇺🇸", country: "USA", online: true },
  { name: "Daniel", age: 26, city: "London", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop", gender: 'male', flag: "🇬🇧", country: "UK", online: true },
  { name: "Meron", age: 23, city: "Toronto", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop", gender: 'female', flag: "🇨🇦", country: "Canada", online: true },
  { name: "Samuel", age: 27, city: "Dubai", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop", gender: 'male', flag: "🇦🇪", country: "UAE", online: true },
  { name: "Rahel", age: 25, city: "Addis Ababa", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop", gender: 'female', flag: "🇪🇹", country: "Ethiopia", online: true },
  { name: "Yonas", age: 28, city: "Asmara", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop", gender: 'male', flag: "🇪🇷", country: "Eritrea", online: true },
  { name: "Selam", age: 22, city: "Seattle", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop", gender: 'female', flag: "🇺🇸", country: "USA", online: true },
  { name: "Dawit", age: 29, city: "Stockholm", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop", gender: 'male', flag: "🇸🇪", country: "Sweden", online: true },
];

export default function VideoChat() {
  const navigate = useNavigate();
  
  // Connection & Onboarding
  const [connectionState, setConnectionState] = useState<ConnectionState>('onboarding');
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('birthday');
  const [partner, setPartner] = useState<Partner | null>(null);
  
  // User Info
  const [birthday, setBirthday] = useState({ month: 10, day: 14, year: 2007 });
  const [userGender, setUserGender] = useState<'male' | 'female' | 'non-binary'>('female');
  const [ethnicity, setEthnicity] = useState('');
  const [firstName, setFirstName] = useState('');
  
  // Matching Preferences - THE STAR FEATURE! 🌟
  const [matchingMode, setMatchingMode] = useState<MatchingMode>('same-gender-only');
  const [showSafetyExplanation, setShowSafetyExplanation] = useState(false);
  const [matchingCount] = useState("321,283");
  
  // Video Controls
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // Chat
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<Array<{text: string, sender: 'me' | 'other'}>>([]);
  
  // Dialogs
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showManageAccountDialog, setShowManageAccountDialog] = useState(false);

  // Smart Matching Algorithm - Filters based on gender preference
  const findMatch = () => {
    let availablePartners = [...mockPartners];
    
    if (matchingMode === 'same-gender-only') {
      availablePartners = availablePartners.filter(p => p.gender === userGender);
    } else if (matchingMode === 'opposite-only') {
      availablePartners = availablePartners.filter(p => p.gender !== userGender);
    }
    
    return availablePartners[Math.floor(Math.random() * availablePartners.length)];
  };

  const completeOnboarding = () => {
    setConnectionState('ready');
  };

  const startMatching = () => {
    setConnectionState('searching');
    setTimeout(() => {
      const matchedPartner = findMatch();
      setPartner(matchedPartner);
      setConnectionState('connected');
    }, 2500);
  };

  const handleNext = () => {
    setConnectionState('searching');
    setShowChat(false);
    setMessages([]);
    setPartner(null);
    setTimeout(() => {
      const matchedPartner = findMatch();
      setPartner(matchedPartner);
      setConnectionState('connected');
    }, 2500);
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      setMessages([...messages, { text: chatMessage, sender: 'me' }]);
      setChatMessage("");
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

  // Onboarding Modals Render
  const renderOnboarding = () => {
    if (connectionState !== 'onboarding') return null;

    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        {/* Birthday Modal */}
        {onboardingStep === 'birthday' && (
          <div className="bg-[#2a2a2a] rounded-3xl p-8 max-w-md w-full relative">
            <button 
              onClick={() => navigate('/')}
              className="absolute top-6 right-6 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-3xl font-bold text-white mb-3">My birthday is</h2>
            <p className="text-gray-400 mb-8">Tell us your age and we'll help you meet people you'd vibe with.</p>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <div className="text-gray-500 text-sm mb-2">Month</div>
                <div className="text-white text-2xl font-bold">{birthday.month}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-500 text-sm mb-2">Day</div>
                <div className="text-white text-2xl font-bold">{birthday.day}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-500 text-sm mb-2">Year</div>
                <div className="text-white text-2xl font-bold">{birthday.year}</div>
              </div>
            </div>
            
            <Button 
              onClick={() => setOnboardingStep('gender')}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-full py-6 text-lg"
            >
              Enter your birthday
            </Button>
          </div>
        )}

        {/* Gender Modal */}
        {onboardingStep === 'gender' && (
          <div className="bg-[#2a2a2a] rounded-3xl p-8 max-w-md w-full relative">
            <button 
              onClick={() => setOnboardingStep('birthday')}
              className="absolute top-6 left-6 text-white hover:text-gray-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => navigate('/')}
              className="absolute top-6 right-6 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-3xl font-bold text-white mb-8">I am a</h2>
            
            <div className="space-y-4 mb-8">
              <button
                onClick={() => setUserGender('male')}
                className={`w-full p-6 rounded-2xl text-lg font-semibold transition-all ${
                  userGender === 'male' 
                    ? 'bg-gray-700 text-white border-2 border-blue-500' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl">♂️</span>
                  Male
                </div>
              </button>
              <button
                onClick={() => setUserGender('female')}
                className={`w-full p-6 rounded-2xl text-lg font-semibold transition-all ${
                  userGender === 'female' 
                    ? 'bg-gray-700 text-white border-2 border-pink-500' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl">♀️</span>
                  Female
                </div>
              </button>
              <button
                onClick={() => setUserGender('non-binary')}
                className={`w-full p-6 rounded-2xl text-lg font-semibold transition-all ${
                  userGender === 'non-binary' 
                    ? 'bg-gray-700 text-white border-2 border-purple-500' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl">⚧️</span>
                  Non-binary
                </div>
              </button>
            </div>
            
            <Button 
              onClick={() => setOnboardingStep('ethnicity')}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-full py-6 text-lg"
            >
              Next
            </Button>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              *This information helps us improve your match experience.
            </p>
          </div>
        )}

        {/* Ethnicity Modal */}
        {onboardingStep === 'ethnicity' && (
          <div className="bg-[#2a2a2a] rounded-3xl p-8 max-w-md w-full relative">
            <button 
              onClick={() => setOnboardingStep('gender')}
              className="absolute top-6 left-6 text-white hover:text-gray-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => navigate('/')}
              className="absolute top-6 right-6 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-3xl font-bold text-white mb-3">What's your ethnicity?</h2>
            <p className="text-gray-400 mb-8 text-sm">Ethnicity is not displayed on the profile.</p>
            
            <div className="space-y-4 mb-8 max-h-96 overflow-y-auto">
              <button
                onClick={() => setEthnicity('habesha')}
                className={`w-full p-6 rounded-2xl text-lg font-semibold transition-all ${
                  ethnicity === 'habesha' 
                    ? 'bg-gradient-to-r from-green-600 to-yellow-600 text-white border-2 border-red-500' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl">🇪🇹🇪🇷</span>
                  Habesha (Ethiopian/Eritrean)
                </div>
              </button>
              <button
                onClick={() => setEthnicity('black-african')}
                className={`w-full p-6 rounded-2xl text-lg font-semibold transition-all ${
                  ethnicity === 'black-african' 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
                }`}
              >
                Black/African American
              </button>
              <button
                onClick={() => setEthnicity('hispanic')}
                className={`w-full p-6 rounded-2xl text-lg font-semibold transition-all ${
                  ethnicity === 'hispanic' 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
                }`}
              >
                Hispanic/Latino
              </button>
              <button
                onClick={() => setEthnicity('middle-eastern')}
                className={`w-full p-6 rounded-2xl text-lg font-semibold transition-all ${
                  ethnicity === 'middle-eastern' 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
                }`}
              >
                Middle Eastern/North African
              </button>
            </div>
            
            <Button 
              onClick={() => setOnboardingStep('name')}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-full py-6 text-lg"
            >
              Next
            </Button>
          </div>
        )}

        {/* Name Modal */}
        {onboardingStep === 'name' && (
          <div className="bg-[#2a2a2a] rounded-3xl p-8 max-w-md w-full relative">
            <button 
              onClick={() => setOnboardingStep('ethnicity')}
              className="absolute top-6 left-6 text-white hover:text-gray-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => navigate('/')}
              className="absolute top-6 right-6 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-3xl font-bold text-white mb-3">My first name is</h2>
            <p className="text-gray-400 mb-8">Your name will be shown in video chats. You can change it later!</p>
            
            <div className="mb-8">
              <div className="relative">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  maxLength={20}
                  className="w-full bg-transparent border-2 border-green-500 rounded-2xl px-6 py-4 text-white text-lg focus:outline-none focus:border-green-400"
                />
                <div className="absolute right-4 bottom-4 text-green-400 text-sm">
                  {firstName.length}/20
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => setOnboardingStep('safety')}
              disabled={!firstName}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-full py-6 text-lg disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        )}

        {/* Safety Modal */}
        {onboardingStep === 'safety' && (
          <div className="bg-[#2a2a2a] rounded-3xl p-8 max-w-md w-full relative">
            <button 
              onClick={() => setOnboardingStep('name')}
              className="absolute top-6 left-6 text-white hover:text-gray-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <h2 className="text-3xl font-bold text-white mb-3">Stay safe and have fun!</h2>
            <p className="text-gray-400 mb-8">
              <span className="underline font-semibold">HabeshLive</span> Community Guidelines
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">Keeping it clean</h3>
                  <p className="text-gray-400 text-sm">Real-time automatic moderation</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <Ban className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">Screen recordings</h3>
                  <p className="text-gray-400 text-sm">No recording without consent</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">24/7 Support</h3>
                  <p className="text-gray-400 text-sm">Reports are reviewed around the clock</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <Ban className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">18+ Only</h3>
                  <p className="text-gray-400 text-sm">Minors are not allowed to use HabeshLive</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-6">
              By tapping the button below, I acknowledge that HabeshLive's beauty filters use facial geometry data, but HabeshLive does not collect or store this information.
            </p>
            
            <Button 
              onClick={() => setOnboardingStep('preferences')}
              className="w-full bg-green-500 hover:bg-green-600 text-black rounded-full py-6 text-lg font-bold"
            >
              Got it
            </Button>
          </div>
        )}

        {/* 🌟 SAME-GENDER MATCHING PREFERENCE MODAL - THE STAR! 🌟 */}
        {onboardingStep === 'preferences' && (
          <div className="bg-[#2a2a2a] rounded-3xl p-8 max-w-md w-full relative">
            <h2 className="text-3xl font-bold text-white mb-3">Who would you like to match with?</h2>
            <p className="text-gray-400 mb-2">Select your preference for safety and comfort</p>
            
            {/* Safety Info Banner */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-blue-300 font-semibold mb-1">Cultural Respect Mode</p>
                  <p className="text-gray-400">
                    Many Habesha families prefer same-gender interactions for cultural and safety reasons.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              {/* SAME-GENDER ONLY - RECOMMENDED! */}
              <button
                onClick={() => setMatchingMode('same-gender-only')}
                className={`w-full p-6 rounded-2xl transition-all relative ${
                  matchingMode === 'same-gender-only' 
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white border-2 border-green-400' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
                }`}
              >
                {matchingMode === 'same-gender-only' && (
                  <div className="absolute top-3 right-3 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                    RECOMMENDED
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-bold text-lg mb-1">Same Gender Only</div>
                    <div className="text-sm opacity-90">
                      Only match with {userGender === 'male' ? 'men' : userGender === 'female' ? 'women' : 'non-binary people'} (Safest)
                    </div>
                  </div>
                  {matchingMode === 'same-gender-only' && (
                    <CheckCircle2 className="w-6 h-6 text-green-300" />
                  )}
                </div>
              </button>

              {/* BOTH GENDERS */}
              <button
                onClick={() => setMatchingMode('both')}
                className={`w-full p-6 rounded-2xl transition-all ${
                  matchingMode === 'both' 
                    ? 'bg-gray-700 text-white border-2 border-purple-500' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-bold text-lg mb-1">Everyone</div>
                    <div className="text-sm opacity-90">Match with all genders</div>
                  </div>
                  {matchingMode === 'both' && (
                    <CheckCircle2 className="w-6 h-6 text-purple-400" />
                  )}
                </div>
              </button>

              {/* OPPOSITE GENDER ONLY */}
              <button
                onClick={() => setMatchingMode('opposite-only')}
                className={`w-full p-6 rounded-2xl transition-all ${
                  matchingMode === 'opposite-only' 
                    ? 'bg-gray-700 text-white border-2 border-pink-500' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">⚤</span>
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-bold text-lg mb-1">Opposite Gender Only</div>
                    <div className="text-sm opacity-90">
                      Only match with {userGender === 'male' ? 'women' : 'men'}
                    </div>
                  </div>
                  {matchingMode === 'opposite-only' && (
                    <CheckCircle2 className="w-6 h-6 text-pink-400" />
                  )}
                </div>
              </button>
            </div>

            {/* Why Same-Gender? Explanation */}
            <button
              onClick={() => setShowSafetyExplanation(!showSafetyExplanation)}
              className="w-full text-left mb-6"
            >
              <div className="flex items-center gap-2 text-blue-400 text-sm hover:text-blue-300">
                <AlertCircle className="w-4 h-4" />
                <span className="underline">Why do we recommend same-gender matching?</span>
              </div>
            </button>

            {showSafetyExplanation && (
              <div className="bg-gray-800/50 rounded-xl p-4 mb-6 text-sm text-gray-300 space-y-2">
                <p>• <strong>Cultural Respect:</strong> Many Habesha families prefer same-gender interactions</p>
                <p>• <strong>Safer Environment:</strong> Reduces inappropriate behavior</p>
                <p>• <strong>Comfortable Learning:</strong> Better for language practice</p>
                <p>• <strong>Family Approved:</strong> Parents trust same-gender chats more</p>
                <p>• <strong>Your Choice:</strong> Change anytime in settings</p>
              </div>
            )}
            
            <Button 
              onClick={completeOnboarding}
              className="w-full bg-green-500 hover:bg-green-600 text-black rounded-full py-6 text-lg font-bold mb-3"
            >
              Start Video Chat
            </Button>
            
            <p className="text-xs text-gray-500 text-center">
              You can change your preference anytime in Settings
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      {renderOnboarding()}

      {/* Only show main UI if not in onboarding */}
      {connectionState !== 'onboarding' && (
        <>
          {/* Header - Desktop */}
          <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/80 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
              <div className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>habeshalive</div>
              <div className="flex items-center gap-4">
                <Button variant="outline" className="bg-[#00D9B4] hover:bg-[#00c9a4] text-black border-0">
                  Join HabeshLive Creators 🎨
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

          {/* Ready State */}
          {connectionState === 'ready' && (
            <div className="h-screen flex items-center justify-center p-4">
              <div className="text-center space-y-6 max-w-xl">
                <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl">
                  <VideoIcon className="w-12 h-12 text-black" />
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-4xl font-bold">Ready to Connect?</h2>
                  <p className="text-lg text-gray-400">
                    Meet Habesha people worldwide. Practice language, share culture, make friends.
                  </p>
                  
                  {/* Show Current Matching Preference */}
                  <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2 mt-4">
                    <Lock className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-semibold text-green-300">
                      {matchingMode === 'same-gender-only' 
                        ? `Same Gender Only (${userGender === 'male' ? 'Men' : userGender === 'female' ? 'Women' : 'Non-binary'})`
                        : matchingMode === 'opposite-only'
                        ? 'Opposite Gender Only'
                        : 'All Genders'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <div className="relative">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping" />
                    </div>
                    <span>{matchingCount} are matching now!</span>
                  </div>
                </div>

                <Button 
                  onClick={startMatching}
                  className="bg-white text-black hover:bg-gray-100 rounded-full px-12 py-7 text-xl font-semibold shadow-xl"
                >
                  <VideoIcon className="w-6 h-6 mr-3" />
                  Start Matching
                </Button>

                <button
                  onClick={() => {
                    setConnectionState('onboarding');
                    setOnboardingStep('preferences');
                  }}
                  className="text-sm text-blue-400 hover:text-blue-300 underline"
                >
                  Change matching preference
                </button>
              </div>
            </div>
          )}

          {/* Searching/Connected States */}
          {(connectionState === 'searching' || connectionState === 'connected') && (
            <>
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
                      {connectionState === 'searching' ? (
                        <div className="relative w-full h-full flex items-center justify-center bg-gradient-radial from-white/10 via-transparent to-transparent">
                          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                            <div className="w-96 h-96 rounded-full bg-white/30 blur-[100px]"></div>
                          </div>
                          <div className="relative z-10 text-center">
                            <RotatingGlobe />
                            <p className="text-xl font-bold mt-6">Finding your next match...</p>
                            <p className="text-sm text-gray-400 mt-2">
                              Matching with {matchingMode === 'same-gender-only' 
                                ? `${userGender === 'male' ? 'men' : userGender === 'female' ? 'women' : 'non-binary people'} only`
                                : matchingMode === 'opposite-only'
                                ? `${userGender === 'male' ? 'women' : 'men'} only`
                                : 'all genders'}
                            </p>
                          </div>
                        </div>
                      ) : connectionState === 'connected' && partner ? (
                        <>
                          {/* User Info - Top Left */}
                          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full z-10">
                            <img
                              src={partner.image}
                              alt={partner.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{partner.name}</span>
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                              </div>
                              <div className="text-sm text-gray-300 flex items-center gap-1">
                                <span>{partner.flag}</span>
                                <span>{partner.country}</span>
                              </div>
                            </div>
                          </div>

                          {/* Same-Gender Badge (if applicable) */}
                          {matchingMode === 'same-gender-only' && (
                            <div className="absolute top-4 right-20 flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1.5 z-10">
                              <Lock className="w-4 h-4 text-green-400" />
                              <span className="text-xs font-semibold text-green-300">SAME GENDER</span>
                            </div>
                          )}

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
                  </div>

                  {/* Mobile: Stacked with Toggle */}
                  <div className="md:hidden h-full flex flex-col relative">
                    {connectionState === 'searching' ? (
                      <>
                        {/* Matched User Area - with blurred background and globe */}
                        <div className="flex-1 relative bg-black flex items-center justify-center">
                          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                            <div className="w-64 h-64 rounded-full bg-white/30 blur-[80px]"></div>
                          </div>
                          <div className="relative z-10 text-center">
                            <RotatingGlobe />
                            <p className="text-xl font-bold mt-6">Finding your next match...</p>
                            <p className="text-sm text-gray-400 mt-2">
                              {matchingMode === 'same-gender-only' 
                                ? `Matching ${userGender}s only`
                                : matchingMode === 'opposite-only'
                                ? 'Opposite gender only'
                                : 'All genders'}
                            </p>
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
                    ) : connectionState === 'connected' && partner ? (
                      <>
                        {!isFullScreen ? (
                          <>
                            {/* Matched User Video - Top Half */}
                            <div className="flex-1 relative bg-black flex items-center justify-center">
                              {/* User Info - Top Left */}
                              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full z-10">
                                <img
                                  src={partner.image}
                                  alt={partner.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-medium text-sm">{partner.name}</span>
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                  </div>
                                  <div className="text-xs text-gray-300 flex items-center gap-1">
                                    <span>{partner.flag}</span>
                                    <span>{partner.country}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Same-Gender Badge */}
                              {matchingMode === 'same-gender-only' && (
                                <div className="absolute top-16 left-4 flex items-center gap-1.5 bg-green-500/20 border border-green-500/30 rounded-full px-2 py-1 z-10">
                                  <Lock className="w-3 h-3 text-green-400" />
                                  <span className="text-xs font-semibold text-green-300">SAME GENDER</span>
                                </div>
                              )}

                              {/* Report Button */}
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
                          <>
                            {/* Full Screen: Matched User Full, My Camera PIP */}
                            <div className="flex-1 relative bg-black flex items-center justify-center">
                              {/* User Info */}
                              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full z-10">
                                <img
                                  src={partner.image}
                                  alt={partner.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-medium text-sm">{partner.name}</span>
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                  </div>
                                  <div className="text-xs text-gray-300 flex items-center gap-1">
                                    <span>{partner.flag}</span>
                                    <span>{partner.country}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Same-Gender Badge */}
                              {matchingMode === 'same-gender-only' && (
                                <div className="absolute top-16 left-4 flex items-center gap-1.5 bg-green-500/20 border border-green-500/30 rounded-full px-2 py-1 z-10">
                                  <Lock className="w-3 h-3 text-green-400" />
                                  <span className="text-xs font-semibold text-green-300">SAME GENDER</span>
                                </div>
                              )}

                              {/* Report Button */}
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

                              {/* My Camera - PIP */}
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
                    <p className="text-center text-xs mb-3 text-gray-400 px-4">
                      HabeshaLive cares about your safety. Check out our{" "}
                      <a href="#" className="text-[#00D9B4] hover:underline">
                        Community Guidelines
                      </a>
                    </p>

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
                    <p className="text-center text-sm mb-4 text-gray-400">
                      HabeshaLive cares about your safety. Check out our{" "}
                      <a href="#" className="text-[#00D9B4] hover:underline">
                        Community Guidelines
                      </a>
                    </p>

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
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Next Video Chat</span>
                        <kbd className="px-2 py-1 bg-gray-800 rounded">→</kbd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Interface - Mobile */}
              {showChat && connectionState === 'connected' && (
                <div className="md:hidden fixed top-0 right-0 bottom-0 w-64 bg-black/95 backdrop-blur-lg p-4 z-30 border-l border-white/10 animate-slide-in-right flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white">Chat</h3>
                    <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Messages */}
                  <div className="flex-1 space-y-2 mb-3 overflow-y-auto">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <span className="text-sm text-white px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm inline-block max-w-[80%]">
                          {msg.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="w-full bg-white/10 text-white placeholder-gray-400 rounded-full px-4 py-2 text-sm border border-white/10 focus:outline-none focus:border-[#00D9B4]"
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
            </>
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
        </>
      )}
    </div>
  );
}
