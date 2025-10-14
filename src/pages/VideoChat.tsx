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
  AlertCircle,
  BookOpen,
  Heart,
  Globe,
  Briefcase,
  GraduationCap,
  Coffee,
  Eye,
  Droplet,
  Star,
  AlertTriangle,
  Flag
} from "lucide-react";
import { RotatingGlobe } from "@/components/RotatingGlobe";
import { ReportDialog } from "@/components/ReportDialog";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { SettingsDialog } from "@/components/SettingsDialog";
import { ManageAccountDialog } from "@/components/ManageAccountDialog";

type OnboardingStep = 'birthday' | 'gender' | 'ethnicity' | 'name' | 'purpose' | 'safety' | 'preferences' | 'complete';
type ConnectionState = 'onboarding' | 'ready' | 'searching' | 'connected';
type MatchingMode = 'both' | 'same-gender-only' | 'opposite-only';
type Purpose = 'language-practice' | 'friendship' | 'cultural-exchange' | 'diaspora-connect' | 'business-networking' | 'just-chat';

interface Partner {
  name: string;
  age: number;
  city: string;
  image: string;
  gender: 'male' | 'female';
  flag: string;
  country: string;
  online: boolean;
  purpose: Purpose;
  languages: string[];
  interests: string[];
  respectScore: number; // 0-100
  verified: boolean;
  totalCalls: number;
}

interface SafetyFeatures {
  aiBlur: boolean;
  screenshotWatermark: boolean;
  modestyFilter: boolean;
  respectScoreVisible: boolean;
}

const mockPartners: Partner[] = [
  { name: "Sara", age: 24, city: "Los Angeles", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop", gender: 'female', flag: "🇺🇸", country: "USA", online: true, purpose: 'language-practice', languages: ['Tigrinya', 'English'], interests: ['Teaching', 'Culture'], respectScore: 98, verified: true, totalCalls: 247 },
  { name: "Daniel", age: 26, city: "London", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop", gender: 'male', flag: "🇬🇧", country: "UK", online: true, purpose: 'business-networking', languages: ['Amharic', 'English'], interests: ['Tech', 'Startups'], respectScore: 95, verified: true, totalCalls: 183 },
  { name: "Meron", age: 23, city: "Toronto", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop", gender: 'female', flag: "🇨🇦", country: "Canada", online: true, purpose: 'cultural-exchange', languages: ['Tigrinya', 'French'], interests: ['Music', 'Coffee Ceremony'], respectScore: 99, verified: true, totalCalls: 312 },
  { name: "Samuel", age: 27, city: "Dubai", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop", gender: 'male', flag: "🇦🇪", country: "UAE", online: true, purpose: 'friendship', languages: ['Amharic', 'Arabic'], interests: ['Sports', 'Travel'], respectScore: 92, verified: true, totalCalls: 156 },
  { name: "Rahel", age: 25, city: "Addis Ababa", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop", gender: 'female', flag: "🇪🇹", country: "Ethiopia", online: true, purpose: 'diaspora-connect', languages: ['Amharic', 'English'], interests: ['Culture', 'History'], respectScore: 97, verified: true, totalCalls: 203 },
  { name: "Yonas", age: 28, city: "Asmara", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop", gender: 'male', flag: "🇪🇷", country: "Eritrea", online: true, purpose: 'just-chat', languages: ['Tigrinya'], interests: ['Photography', 'Art'], respectScore: 94, verified: true, totalCalls: 178 },
  { name: "Selam", age: 22, city: "Seattle", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop", gender: 'female', flag: "🇺🇸", country: "USA", online: true, purpose: 'language-practice', languages: ['Tigrinya', 'English'], interests: ['Learning', 'Travel'], respectScore: 96, verified: true, totalCalls: 189 },
  { name: "Dawit", age: 29, city: "Stockholm", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop", gender: 'male', flag: "🇸🇪", country: "Sweden", online: true, purpose: 'friendship', languages: ['Amharic', 'Swedish'], interests: ['Music', 'Tech'], respectScore: 91, verified: true, totalCalls: 134 },
];

const purposeOptions = [
  {
    id: 'language-practice',
    icon: BookOpen,
    title: 'Language Practice',
    description: 'Learn or teach Tigrinya, Amharic, Oromo',
    color: 'from-blue-600 to-cyan-600',
    benefits: ['Native speakers', 'Patient teachers', 'Real conversations']
  },
  {
    id: 'friendship',
    icon: Heart,
    title: 'Make Friends',
    description: 'Connect with Habesha people worldwide',
    color: 'from-pink-600 to-rose-600',
    benefits: ['Long-term connections', 'Similar interests', 'Community building']
  },
  {
    id: 'cultural-exchange',
    icon: Globe,
    title: 'Cultural Exchange',
    description: 'Share traditions, food, music, stories',
    color: 'from-green-600 to-emerald-600',
    benefits: ['Learn customs', 'Share traditions', 'Coffee ceremony']
  },
  {
    id: 'diaspora-connect',
    icon: Coffee,
    title: 'Diaspora Connect',
    description: 'Connect homeland with diaspora',
    color: 'from-yellow-600 to-orange-600',
    benefits: ['Bridge cultures', 'Stay connected', 'Learn roots']
  },
  {
    id: 'business-networking',
    icon: Briefcase,
    title: 'Business Network',
    description: 'Professional connections & opportunities',
    color: 'from-purple-600 to-indigo-600',
    benefits: ['Career growth', 'Find partners', 'Share knowledge']
  },
  {
    id: 'just-chat',
    icon: MessageCircle,
    title: 'Just Chat',
    description: 'Casual conversations, no pressure',
    color: 'from-gray-600 to-slate-600',
    benefits: ['Relaxed vibe', 'Random topics', 'Fun times']
  }
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
  const [userPurpose, setUserPurpose] = useState<Purpose>('language-practice');
  const [showPurposeInfo, setShowPurposeInfo] = useState(false);
  
  // Matching Preferences - THE STAR FEATURE! 🌟
  const [matchingMode, setMatchingMode] = useState<MatchingMode>('same-gender-only');
  const [showSafetyExplanation, setShowSafetyExplanation] = useState(false);
  const [matchingCount] = useState("321,283");
  
  // 🛡️ SAFETY FEATURES STATE
  const [safetyFeatures, setSafetyFeatures] = useState<SafetyFeatures>({
    aiBlur: true,
    screenshotWatermark: true,
    modestyFilter: true,
    respectScoreVisible: true
  });
  const [aiDetectedIssue, setAiDetectedIssue] = useState(false);
  const [blurLevel, setBlurLevel] = useState(0); // 0-100
  const [watermarkId] = useState(`W-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const [userRespectScore, setUserRespectScore] = useState(100); // Start at 100
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  
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

  // 🤖 AI CONTENT MODERATION (Simulated)
  useEffect(() => {
    if (connectionState === 'connected' && safetyFeatures.aiBlur) {
      const interval = setInterval(() => {
        // Simulate AI detection (in production, this would be real AI)
        const randomCheck = Math.random();
        
        if (randomCheck < 0.05) { // 5% chance of detecting something
          setAiDetectedIssue(true);
          setBlurLevel(80);
          
          // Auto-recover after 3 seconds
          setTimeout(() => {
            setAiDetectedIssue(false);
            setBlurLevel(0);
          }, 3000);
        }
      }, 5000); // Check every 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [connectionState, safetyFeatures.aiBlur]);

  // 🛡️ SCREENSHOT DETECTION (Simulated)
  useEffect(() => {
    if (!safetyFeatures.screenshotWatermark) return;

    const detectScreenshot = () => {
      console.log('⚠️ Screenshot attempt detected!');
      console.log('🔒 Watermark ID:', watermarkId);
      
      // In production:
      // - Send alert to backend
      // - Log the incident
      // - Reduce respect score if repeated
      // - Notify partner
    };

    // Listen for screenshot events
    const handleVisibility = () => {
      if (document.hidden && connectionState === 'connected') {
        detectScreenshot();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [connectionState, safetyFeatures.screenshotWatermark, watermarkId]);

  // Smart Matching Algorithm - Filters based on gender preference AND purpose
  const findMatch = () => {
    let availablePartners = [...mockPartners];
    
    // Filter by gender preference
    if (matchingMode === 'same-gender-only') {
      availablePartners = availablePartners.filter(p => p.gender === userGender);
    } else if (matchingMode === 'opposite-only') {
      availablePartners = availablePartners.filter(p => p.gender !== userGender);
    }
    
    // PRIORITIZE same purpose, but allow others if no exact match
    const samePurposePartners = availablePartners.filter(p => p.purpose === userPurpose);
    
    if (samePurposePartners.length > 0) {
      return samePurposePartners[Math.floor(Math.random() * samePurposePartners.length)];
    }
    
    // Fallback to any available partner
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

  const getCurrentPurposeInfo = () => {
    return purposeOptions.find(p => p.id === userPurpose);
  };

  const getRespectScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-400';
    if (score >= 85) return 'text-blue-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRespectScoreStars = (score: number) => {
    if (score >= 95) return 5;
    if (score >= 85) return 4;
    if (score >= 70) return 3;
    if (score >= 50) return 2;
    return 1;
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
              onClick={() => setOnboardingStep('purpose')}
              disabled={!firstName}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-full py-6 text-lg disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        )}

        {/* 🌟 PURPOSE SELECTION MODAL - THE GAME CHANGER! 🌟 */}
        {onboardingStep === 'purpose' && (
          <div className="bg-[#2a2a2a] rounded-3xl p-8 max-w-2xl w-full relative my-8">
            <button 
              onClick={() => setOnboardingStep('purpose')}
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
            
            <h2 className="text-3xl font-bold text-white mb-3">What brings you here?</h2>
            <p className="text-gray-400 mb-6">Choose your main purpose - we'll match you with like-minded people</p>
            
            {/* Info Banner */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-blue-300 font-semibold mb-1">Smart Matching</p>
                  <p className="text-gray-400">
                    We'll connect you with people who share your purpose for better conversations!
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-h-96 overflow-y-auto">
              {purposeOptions.map((purpose) => {
                const Icon = purpose.icon;
                const isSelected = userPurpose === purpose.id;
                
                return (
                  <button
                    key={purpose.id}
                    onClick={() => setUserPurpose(purpose.id as Purpose)}
                    className={`p-5 rounded-2xl text-left transition-all ${
                      isSelected
                        ? `bg-gradient-to-br ${purpose.color} text-white border-2 border-white/30 scale-105`
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-750 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-white/20' : 'bg-gray-700'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-base mb-1">{purpose.title}</div>
                        <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                          {purpose.description}
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                      )}
                    </div>
                    
                    {isSelected && (
                      <div className="space-y-1 mt-3 pt-3 border-t border-white/10">
                        {purpose.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-white/90">
                            <div className="w-1 h-1 rounded-full bg-white/60" />
                            {benefit}
                          </div>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowPurposeInfo(!showPurposeInfo)}
              className="w-full text-left mb-4"
            >
              <div className="flex items-center gap-2 text-blue-400 text-sm hover:text-blue-300">
                <AlertCircle className="w-4 h-4" />
                <span className="underline">How does purpose matching work?</span>
              </div>
            </button>

            {showPurposeInfo && (
              <div className="bg-gray-800/50 rounded-xl p-4 mb-6 text-sm text-gray-300 space-y-2">
                <p>• <strong>Better Conversations:</strong> Match with people who want the same thing</p>
                <p>• <strong>Clear Expectations:</strong> Everyone knows why they're here</p>
                <p>• <strong>Higher Quality:</strong> More meaningful connections, less time wasted</p>
                <p>• <strong>Flexible:</strong> You can change your purpose anytime in settings</p>
              </div>
            )}
            
            <Button 
              onClick={() => setOnboardingStep('safety')}
              className="w-full bg-green-500 hover:bg-green-600 text-black rounded-full py-6 text-lg font-bold"
            >
              Continue with {getCurrentPurposeInfo()?.title}
            </Button>
          </div>
        )}

        {/* 🛡️ ENHANCED SAFETY MODAL - WITH ALL 4 FEATURES! */}
        {onboardingStep === 'safety' && (
          <div className="bg-[#2a2a2a] rounded-3xl p-8 max-w-2xl w-full relative my-8">
            <button 
              onClick={() => setOnboardingStep('purpose')}
              className="absolute top-6 left-6 text-white hover:text-gray-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <h2 className="text-3xl font-bold text-white mb-3">Your Safety is Our Priority! 🛡️</h2>
            <p className="text-gray-400 mb-8">
              HabeshLive uses <span className="text-green-400 font-bold">cutting-edge AI technology</span> to keep you safe
            </p>
            
            <div className="space-y-6 mb-8">
              {/* 1. AI Blur Inappropriate Content */}
              <div className="flex items-start gap-4 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Eye className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-1 flex items-center gap-2">
                    ⚡ AI Content Moderation
                    <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">REAL-TIME</span>
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    Our AI automatically detects and blurs inappropriate content in <strong>real-time</strong>
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• Nudity detection & instant blur</li>
                    <li>• Inappropriate gesture recognition</li>
                    <li>• Automatic disconnect on violations</li>
                  </ul>
                </div>
              </div>

              {/* 2. Screenshot Watermarking */}
              <div className="flex items-start gap-4 bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Droplet className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-1 flex items-center gap-2">
                    🛡️ Screenshot Protection
                    <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">FORENSIC</span>
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    Every frame has an <strong>invisible watermark</strong> to trace bad actors
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• Unique ID embedded in every frame</li>
                    <li>• Screenshot detection alerts</li>
                    <li>• Traceable if shared online</li>
                  </ul>
                </div>
              </div>

              {/* 3. Respect Score System */}
              <div className="flex items-start gap-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-1 flex items-center gap-2">
                    ⭐ Respect Score System
                    <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded-full">COMMUNITY</span>
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    Rate partners after each call - only <strong>high-respect users</strong> get matched
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• Start at 100/100 respect score</li>
                    <li>• Bad behavior = score drops</li>
                    <li>• Only match with 85+ score users</li>
                  </ul>
                </div>
              </div>

              {/* 4. Modesty Filters */}
              <div className="flex items-start gap-4 bg-pink-500/10 border border-pink-500/30 rounded-xl p-4">
                <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6 text-pink-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg mb-1 flex items-center gap-2">
                    📸 Modesty AI Filter
                    <span className="text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full">CULTURAL</span>
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    AI detects immodest clothing and <strong>warns users</strong> respectfully
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• Respects cultural/religious values</li>
                    <li>• Polite warnings before disconnect</li>
                    <li>• Family-friendly environment</li>
                  </ul>
                </div>
              </div>

              {/* Traditional Safety Features */}
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
                  <h3 className="text-white font-semibold text-lg mb-1">No Screen Recording</h3>
                  <p className="text-gray-400 text-sm">Recording without consent is prohibited</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-1">24/7 Human Support</h3>
                  <p className="text-gray-400 text-sm">Real moderators review reports instantly</p>
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

            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div className="text-sm text-gray-300">
                  <p className="font-semibold text-white mb-2">Why HabeshLive is the Safest:</p>
                  <p>We combine <strong>AI technology + human moderation + community accountability</strong> to create the safest video chat platform for the Habesha community. Your safety and comfort are guaranteed.</p>
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
              I Understand - Continue
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
                {/* User Respect Score */}
                {safetyFeatures.respectScoreVisible && (
                  <div className="bg-white/10 border border-white/20 rounded-full px-3 py-1.5 flex items-center gap-2">
                    <Star className={`w-4 h-4 ${getRespectScoreColor(userRespectScore)}`} />
                    <span className={`text-sm font-bold ${getRespectScoreColor(userRespectScore)}`}>
                      {userRespectScore}
                    </span>
                  </div>
                )}
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
                  
                  {/* Show Current Purpose */}
                  {getCurrentPurposeInfo() && (
                    <div className={`inline-flex items-center gap-2 bg-gradient-to-br ${getCurrentPurposeInfo()!.color} rounded-full px-4 py-2 mt-4`}>
                      {(() => {
                        const Icon = getCurrentPurposeInfo()!.icon;
                        return <Icon className="w-4 h-4 text-white" />;
                      })()}
                      <span className="text-sm font-semibold text-white">
                        {getCurrentPurposeInfo()!.title}
                      </span>
                    </div>
                  )}
                  
                  {/* Show Current Matching Preference */}
                  <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2">
                    <Lock className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-semibold text-green-300">
                      {matchingMode === 'same-gender-only' 
                        ? `Same Gender Only (${userGender === 'male' ? 'Men' : userGender === 'female' ? 'Women' : 'Non-binary'})`
                        : matchingMode === 'opposite-only'
                        ? 'Opposite Gender Only'
                        : 'All Genders'}
                    </span>
                  </div>

                  {/* Safety Features Active */}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-blue-400" />
                      <span className="text-blue-300 font-semibold text-sm">Advanced Safety Active</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-green-400" />
                        AI Blur
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-green-400" />
                        Watermark
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-green-400" />
                        Respect Score
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-green-400" />
                        Modesty Filter
                      </div>
                    </div>
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
                            {getCurrentPurposeInfo() && (
                              <p className="text-sm text-gray-400 mt-1">
                                Purpose: {getCurrentPurposeInfo()!.title}
                              </p>
                            )}
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

                          {/* Purpose Badge */}
                          {partner.purpose && purposeOptions.find(p => p.id === partner.purpose) && (
                            <div className={`absolute ${matchingMode === 'same-gender-only' ? 'top-16' : 'top-4'} right-20 flex items-center gap-2 bg-gradient-to-r ${purposeOptions.find(p => p.id === partner.purpose)!.color} rounded-full px-3 py-1.5 z-10`}>
                              {(() => {
                                const Icon = purposeOptions.find(p => p.id === partner.purpose)!.icon;
                                return <Icon className="w-3.5 h-3.5 text-white" />;
                              })()}
                              <span className="text-xs font-semibold text-white">{purposeOptions.find(p => p.id === partner.purpose)!.title.toUpperCase()}</span>
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
                            {getCurrentPurposeInfo() && (
                              <p className="text-sm text-gray-400 mt-1">
                                Purpose: {getCurrentPurposeInfo()!.title}
                              </p>
                            )}
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

                              {/* Purpose Badge */}
                              {partner.purpose && purposeOptions.find(p => p.id === partner.purpose) && (
                                <div className={`absolute ${matchingMode === 'same-gender-only' ? 'top-24' : 'top-16'} left-4 flex items-center gap-1.5 bg-gradient-to-r ${purposeOptions.find(p => p.id === partner.purpose)!.color} rounded-full px-2 py-1 z-10`}>
                                  {(() => {
                                    const Icon = purposeOptions.find(p => p.id === partner.purpose)!.icon;
                                    return <Icon className="w-3 h-3 text-white" />;
                                  })()}
                                  <span className="text-xs font-semibold text-white">{purposeOptions.find(p => p.id === partner.purpose)!.title.toUpperCase()}</span>
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
