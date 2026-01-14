import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  X, 
  MessageCircle, 
  Shield, 
  Camera, 
  Video as VideoIcon, 
  User as UserIcon,
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
  Flag,
  Loader2,
  Settings
} from "lucide-react";
import { RotatingGlobe } from "@/components/RotatingGlobe";
import { ReportDialog } from "@/components/ReportDialog";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { SettingsDialog } from "@/components/SettingsDialog";
import { ManageAccountDialog } from "@/components/ManageAccountDialog";
import { ContactUsDialog } from "@/components/ContactUsDialog";
import { ProfileViewDialog } from "@/components/ProfileViewDialog";
import { ScrollableDatePicker } from "@/components/ScrollableDatePicker";
import { HabeshaLiveOnboarding } from "@/components/onboarding/HabeshaLiveOnboarding";
import { AIContentModeration } from "@/lib/ai-moderation-system";
import { VideoWatermarkingSystem, ScreenshotDetectionSystem } from "@/lib/watermarking-system";
import RespectScoreEngine, { type UserScore } from "@/lib/respect-score-system";
import { webrtcService } from "@/lib/webrtc-service";
import { mockWebRTCService } from "@/lib/mock-webrtc-service";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

// Toggle for development/production
const USE_MOCK_WEBRTC = true;

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
  
  // Authentication state
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<{ avatar_url?: string; first_name?: string } | null>(null);

  // Check authentication
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setAuthLoading(false);
        
        // Redirect to home if signed out
        if (!session && event === 'SIGNED_OUT') {
          navigate('/');
          toast.error('Please sign in to access video chat');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setAuthLoading(false);
      
      // Redirect to home if not authenticated
      if (!session) {
        navigate('/');
        toast.error('Please sign in to access video chat');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url, first_name')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
      } else if (data) {
        setUserProfile(data);
      }
    };

    fetchProfile();
  }, [user?.id]);

  // Refresh profile when returning from edit dialog
  const handleProfileDialogClose = (open: boolean) => {
    setShowProfileDialog(open);
    if (!open && user?.id) {
      // Refresh profile data when dialog closes
      supabase
        .from('profiles')
        .select('avatar_url, first_name')
        .eq('id', user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            setUserProfile(data);
          }
        });
    }
  };
  
  // Connection & Onboarding
  const [connectionState, setConnectionState] = useState<ConnectionState>('onboarding');
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('birthday');
  const [partner, setPartner] = useState<Partner | null>(null);
  
  // User Info
  const [birthday, setBirthday] = useState({ month: 11, day: 26, year: 1995 });
  const [userGender, setUserGender] = useState<'male' | 'female'>('female');
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
  
  // 🤖 AI SYSTEMS INSTANCES
  const aiModerationRef = useRef<AIContentModeration | null>(null);
  const watermarkingRef = useRef<VideoWatermarkingSystem | null>(null);
  const screenshotDetectionRef = useRef<ScreenshotDetectionSystem | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [aiInitialized, setAiInitialized] = useState(false);
  const [aiInitializing, setAiInitializing] = useState(false);
  const [aiLoadProgress, setAiLoadProgress] = useState(0);
  const [aiLoadError, setAiLoadError] = useState<string | null>(null);
  const [aiLoadStage, setAiLoadStage] = useState<string>('');
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [videoPosition, setVideoPosition] = useState<'half' | 'corner'>('half');
  const callStartTimeRef = useRef<number | null>(null);
  
  // WebRTC video refs - single refs for consistent video display
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localVideoCornerRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoCornerRef = useRef<HTMLVideoElement | null>(null);
  const [webrtcConnected, setWebrtcConnected] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  
  // Video Controls
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // Chat
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<Array<{text: string, sender: 'me' | 'other'}>>([]);
  
  // Dialogs
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showProfileViewDialog, setShowProfileViewDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showManageAccountDialog, setShowManageAccountDialog] = useState(false);
  const [showContactUsDialog, setShowContactUsDialog] = useState(false);

  // 🤖 AI SYSTEM INITIALIZATION with progress tracking
  useEffect(() => {
    const initializeAI = async () => {
      if (aiInitializing || aiInitialized) return;
      
      setAiInitializing(true);
      setAiLoadProgress(0);
      setAiLoadError(null);
      setAiLoadStage('Starting AI systems...');
      console.log('🤖 Initializing AI systems...');
      
      try {
        // Stage 1: Initialize moderation
        setAiLoadStage('Loading content moderation...');
        setAiLoadProgress(20);
        
        aiModerationRef.current = new AIContentModeration();
        
        setAiLoadProgress(40);
        setAiLoadStage('Loading TensorFlow models...');
        
        await aiModerationRef.current.initialize();
        
        setAiLoadProgress(80);
        setAiLoadStage('Finalizing...');
        
        // Small delay for smooth UX
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setAiLoadProgress(100);
        setAiInitialized(true);
        console.log('✅ AI systems ready!');
        toast.success('AI Safety Systems Active', {
          description: 'Real-time content moderation enabled'
        });
      } catch (error: any) {
        console.error('❌ Failed to initialize AI:', error);
        setAiLoadError(error.message || 'Failed to load AI systems');
        toast.warning('AI systems unavailable', {
          description: 'App will continue without AI moderation'
        });
        // Allow app to continue without AI
        setAiInitialized(false);
      } finally {
        setAiInitializing(false);
      }
    };
    
    initializeAI();
  }, []);

  // Sync streams to all video elements when they change or position changes
  useEffect(() => {
    if (localStream) {
      // Sync local stream to all local video elements
      if (localVideoRef.current && localVideoRef.current.srcObject !== localStream) {
        localVideoRef.current.srcObject = localStream;
      }
      if (localVideoCornerRef.current && localVideoCornerRef.current.srcObject !== localStream) {
        localVideoCornerRef.current.srcObject = localStream;
      }
      // Set AI monitoring ref to local stream video (ONLY monitor local camera, not remote)
      if (localVideoRef.current) {
        videoRef.current = localVideoRef.current;
      } else if (localVideoCornerRef.current) {
        // Use corner ref if half ref not available (for corner mode)
        videoRef.current = localVideoCornerRef.current;
      }
    }
    if (remoteStream) {
      // Sync remote stream to all remote video elements
      if (remoteVideoRef.current && remoteVideoRef.current.srcObject !== remoteStream) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
      if (remoteVideoCornerRef.current && remoteVideoCornerRef.current.srcObject !== remoteStream) {
        remoteVideoCornerRef.current.srcObject = remoteStream;
      }
    }
  }, [localStream, remoteStream, videoPosition, connectionState]);

  // 🤖 AI CONTENT MODERATION (Real Implementation)
  // IMPORTANT: Only monitors LOCAL camera - not remote partner video
  useEffect(() => {
    // Skip if AI not initialized (graceful degradation)
    if (!aiInitialized || connectionState !== 'connected' || !safetyFeatures.aiBlur) {
      return;
    }
    if (!aiModerationRef.current || !videoRef.current) return;
    
    const interval = setInterval(async () => {
      try {
        const result = await aiModerationRef.current!.analyzeFrame(videoRef.current!);
        
        if (!result.safe) {
          console.warn('⚠️ AI detected violations:', result.violations);
          setAiDetectedIssue(true);
          setBlurLevel(result.blurLevel);
          
          // Handle based on severity
          switch (result.action) {
            case 'warn':
              toast.warning('Content Warning', {
                description: result.violations[0]?.details || 'Please review your video'
              });
              break;
              
            case 'blur':
              // Clear any existing timeout first
              if (blurTimeoutRef.current) {
                clearTimeout(blurTimeoutRef.current);
              }
              
              // Set new timeout
              blurTimeoutRef.current = setTimeout(() => {
                setAiDetectedIssue(false);
                setBlurLevel(0);
                blurTimeoutRef.current = null;
              }, 3000);
              break;
              
            case 'disconnect':
              toast.error('Safety Violation Detected', {
                description: 'Call ended for safety reasons'
              });
              
              // Update respect score
              const mockUserScore: UserScore = {
                userId: 'current-user',
                currentScore: userRespectScore,
                history: [],
                totalCalls: 0,
                completedCalls: 0,
                skippedCalls: 0,
                reportsReceived: 0,
                reportsConfirmed: 0,
                complimentsReceived: 0,
                averageCallDuration: 0,
                accountAge: 1,
                verified: false,
                badges: [],
                tier: 'perfect'
              };
              
              let updatedScore = mockUserScore;
              result.violations.forEach(v => {
                updatedScore = RespectScoreEngine.processAIViolation(
                  updatedScore,
                  v.type as any,
                  v.severity
                );
              });
              
              setUserRespectScore(updatedScore.currentScore);
              
              // End call after 1 second
              setTimeout(() => {
                endCall();
              }, 1000);
              break;
          }
        } else if (aiDetectedIssue) {
          setAiDetectedIssue(false);
          setBlurLevel(0);
        }
      } catch (error) {
        console.error('AI moderation error:', error);
      }
    }, 200); // Check every 200ms (5 FPS)
    
    return () => clearInterval(interval);
  }, [connectionState, safetyFeatures.aiBlur, aiInitialized, aiDetectedIssue, userRespectScore]);

  // 🛡️ WATERMARKING SYSTEM
  useEffect(() => {
    if (connectionState !== 'connected' || !safetyFeatures.screenshotWatermark) return;
    
    const userId = 'current-user-' + Math.random().toString(36).substr(2, 9);
    const partnerId = partner?.name || 'partner';
    const sessionId = watermarkId;
    
    // Initialize watermarking
    watermarkingRef.current = new VideoWatermarkingSystem(userId, partnerId, sessionId);
    watermarkingRef.current.start();
    
    // Initialize screenshot detection
    screenshotDetectionRef.current = new ScreenshotDetectionSystem(
      userId,
      partnerId,
      sessionId,
      {
        onAttempt: (attempt) => {
          console.warn('⚠️ Screenshot attempt detected!', attempt);
          toast.warning('Screenshot Detected', {
            description: 'All frames are watermarked for security'
          });
          
          // Clear existing timeout
          if (blurTimeoutRef.current) {
            clearTimeout(blurTimeoutRef.current);
          }
          
          // Temporary blur with proper timeout management
          setBlurLevel(60);
          blurTimeoutRef.current = setTimeout(() => {
            setBlurLevel(0);
            blurTimeoutRef.current = null;
          }, 3000);
        },
        onMultipleAttempts: (count) => {
          console.error('🚨 Multiple screenshot attempts:', count);
          toast.error('Multiple Screenshot Attempts', {
            description: 'This is being reported. Your respect score may be affected.'
          });
          
          // Reduce respect score
          setUserRespectScore(prev => Math.max(0, prev - 10));
        }
      }
    );
    screenshotDetectionRef.current.start();
    
    return () => {
      watermarkingRef.current?.stop();
      screenshotDetectionRef.current?.stop();
    };
  }, [connectionState, safetyFeatures.screenshotWatermark, partner, watermarkId]);

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

  const startMatching = async () => {
    setConnectionState('searching');
    callStartTimeRef.current = Date.now();
    
    setTimeout(async () => {
      const matchedPartner = findMatch();
      setPartner(matchedPartner);
      // Don't set connected yet - wait for WebRTC
      
      // Initialize WebRTC for video connection
      if (user && matchedPartner) {
        try {
          if (USE_MOCK_WEBRTC) {
            // Use mock WebRTC for development
            await mockWebRTCService.initialize(
              // On remote stream received
              (stream) => {
                console.log('🎥 Mock remote stream received!');
                setRemoteStream(stream);
                setConnectionState('connected');
                setWebrtcConnected(true);
                toast.success('Video Connected!', {
                  description: 'You can now see each other'
                });
              },
              // On connection state change
              (state) => {
                console.log('🔄 Mock WebRTC state:', state);
                if (state === 'connected') {
                  setWebrtcConnected(true);
                }
              },
              // On error
              (error) => {
                console.error('Mock WebRTC error:', error);
                toast.error('Connection Error', {
                  description: error.message
                });
              }
            );
            
            // Store local stream in state for consistent display
            const stream = mockWebRTCService.getLocalStream();
            if (stream) {
              setLocalStream(stream);
            }
          } else {
            // Use real WebRTC for production
            const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const isInitiator = Math.random() > 0.5;
            
            await webrtcService.initialize(
              sessionId,
              user.id,
              matchedPartner.name,
              isInitiator,
              (stream) => {
                console.log('🎥 Remote stream received!');
                setRemoteStream(stream);
                setConnectionState('connected');
                setWebrtcConnected(true);
                toast.success('Video Connected!', {
                  description: 'You can now see each other'
                });
              },
              (state) => {
                console.log('🔄 WebRTC connection state:', state);
                if (state === 'connected') {
                  setWebrtcConnected(true);
                } else if (state === 'failed' || state === 'disconnected') {
                  setWebrtcConnected(false);
                  toast.error('Connection Lost', {
                    description: 'Video connection was interrupted'
                  });
                }
              },
              (error) => {
                console.error('WebRTC error:', error);
                toast.error('Connection Error', {
                  description: error.message
                });
              }
            );
            
            const stream = webrtcService.getLocalStream();
            if (stream) {
              setLocalStream(stream);
            }
          }
          
        } catch (error: any) {
          console.error('Error initializing WebRTC:', error);
          toast.error('Video Setup Failed', {
            description: 'Could not access camera/microphone'
          });
          // Still show connected state even if WebRTC fails
          setConnectionState('connected');
        }
      } else {
        setConnectionState('connected');
      }
    }, 2500);
  };

  const handleNext = () => {
    // Update respect score for completed call
    if (callStartTimeRef.current) {
      const callDuration = Math.floor((Date.now() - callStartTimeRef.current) / 1000);
      
      // Simulate respect score update
      if (callDuration >= 30) {
        // Only count if call was longer than 30 seconds
        setUserRespectScore(prev => Math.min(100, prev + 2));
        toast.success('Call completed!', {
          description: `+2 Respect Score (${callDuration}s call)`
        });
      }
    }
    
    // Cleanup only the peer connection, keep local stream active
    if (USE_MOCK_WEBRTC) {
      mockWebRTCService.closePeerConnection();
    } else {
      webrtcService.closePeerConnection();
    }
    
    // Reset AI states
    setAiDetectedIssue(false);
    setBlurLevel(0);
    
    setConnectionState('searching');
    setShowChat(false);
    setMessages([]);
    setPartner(null);
    setWebrtcConnected(false);
    
    setTimeout(async () => {
      const matchedPartner = findMatch();
      setPartner(matchedPartner);
      callStartTimeRef.current = Date.now();
      
      // Reinitialize WebRTC for new call
      if (user && matchedPartner) {
        try {
          if (USE_MOCK_WEBRTC) {
            // Reinitialize mock remote stream
            await mockWebRTCService.reinitializeRemote(
              (stream) => {
                setRemoteStream(stream);
                setConnectionState('connected');
                setWebrtcConnected(true);
              },
              (state) => {
                if (state === 'connected') {
                  setWebrtcConnected(true);
                }
              }
            );
            
            // Ensure local stream is still available
            const stream = mockWebRTCService.getLocalStream();
            if (stream) {
              setLocalStream(stream);
            }
          } else {
            const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const isInitiator = Math.random() > 0.5;
            
            await webrtcService.initialize(
              sessionId,
              user.id,
              matchedPartner.name,
              isInitiator,
              (stream) => {
                setRemoteStream(stream);
                setConnectionState('connected');
                setWebrtcConnected(true);
              },
              (state) => {
                if (state === 'connected') {
                  setWebrtcConnected(true);
                }
              },
              (error) => {
                console.error('WebRTC error:', error);
              }
            );
            
            const stream = webrtcService.getLocalStream();
            if (stream) {
              setLocalStream(stream);
            }
          }
        } catch (error) {
          console.error('Error restarting WebRTC:', error);
          setConnectionState('connected');
        }
      } else {
        setConnectionState('connected');
      }
    }, 2500);
  };
  
  const endCall = () => {
    // Same as handleNext but can be called internally
    handleNext();
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      setMessages([...messages, { text: chatMessage, sender: 'me' }]);
      setChatMessage("");
    }
  };

  const handleEndChat = () => {
    // Cleanup WebRTC based on mode
    if (USE_MOCK_WEBRTC) {
      mockWebRTCService.cleanup();
    } else {
      webrtcService.cleanup();
    }
    setWebrtcConnected(false);
    
    // Cleanup AI systems
    aiModerationRef.current?.reset();
    watermarkingRef.current?.stop();
    screenshotDetectionRef.current?.stop();
    
    // Clear any blur timeouts
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    
    // Sign out and return to home
    supabase.auth.signOut().then(() => {
      navigate('/');
      toast.success('Signed out successfully');
    });
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-400" />
          <p className="text-white text-lg">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user || !session) {
    return null;
  }

  const handleOpenManageAccount = () => {
    setShowSettingsDialog(false);
    setShowManageAccountDialog(true);
  };

  const handleBackToSettings = () => {
    setShowManageAccountDialog(false);
    setShowSettingsDialog(true);
  };

  const handleOpenContactUs = () => {
    setShowSettingsDialog(false);
    setShowContactUsDialog(true);
  };

  const handleOpenEditProfile = () => {
    setShowProfileViewDialog(false);
    setShowProfileDialog(true);
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

  // Calculate age from birthday
  const calculateAge = () => {
    const today = new Date();
    const birthDate = new Date(birthday.year, birthday.month - 1, birthday.day);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // AI Loading Overlay
  const renderAILoadingOverlay = () => {
    if (!aiInitializing) return null;
    
    return (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center">
        <div className="max-w-md w-full mx-4 bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl border border-gray-800 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-400 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Loading AI Safety</h2>
            <p className="text-gray-400 text-sm">{aiLoadStage || 'Initializing...'}</p>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300 ease-out"
                style={{ width: `${aiLoadProgress}%` }}
              />
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">{aiLoadProgress}%</p>
          </div>
          
          {/* Features Being Loaded */}
          <div className="space-y-2 mb-6">
            <div className={`flex items-center gap-2 text-sm ${aiLoadProgress >= 20 ? 'text-green-400' : 'text-gray-500'}`}>
              <CheckCircle2 className="w-4 h-4" />
              <span>Content moderation</span>
            </div>
            <div className={`flex items-center gap-2 text-sm ${aiLoadProgress >= 40 ? 'text-green-400' : 'text-gray-500'}`}>
              <CheckCircle2 className="w-4 h-4" />
              <span>TensorFlow models</span>
            </div>
            <div className={`flex items-center gap-2 text-sm ${aiLoadProgress >= 80 ? 'text-green-400' : 'text-gray-500'}`}>
              <CheckCircle2 className="w-4 h-4" />
              <span>Safety systems</span>
            </div>
          </div>
          
          {/* Skip Option */}
          <button
            onClick={() => {
              setAiInitializing(false);
              setAiLoadError('Skipped by user');
              toast.warning('AI Safety Skipped', {
                description: 'Some safety features may be unavailable'
              });
            }}
            className="w-full text-center text-sm text-gray-500 hover:text-gray-400 underline"
          >
            Skip (not recommended)
          </button>
        </div>
      </div>
    );
  };

  // Onboarding Handler - uses new HabeshaLiveOnboarding component
  const handleOnboardingComplete = (data: {
    birthday: { day: number; month: number; year: number };
    gender: 'male' | 'female';
    ethnicity: string;
    firstName: string;
    purpose: string;
    matchingMode: MatchingMode;
    religion: string;
    religionVisible: boolean;
  }) => {
    // Update state with onboarding data
    setBirthday(data.birthday);
    setUserGender(data.gender);
    setEthnicity(data.ethnicity);
    setFirstName(data.firstName);
    setUserPurpose(data.purpose as Purpose);
    setMatchingMode(data.matchingMode);
    
    // Complete onboarding
    completeOnboarding();
  };

  const renderOnboarding = () => {
    if (connectionState !== 'onboarding') return null;
    return <HabeshaLiveOnboarding onComplete={handleOnboardingComplete} />;
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* AI Loading Overlay */}
      {renderAILoadingOverlay()}
      
      {/* AI Error Banner */}
      {aiLoadError && !aiInitializing && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 max-w-md w-full mx-4">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-yellow-300 font-medium">AI Safety Limited</p>
                <p className="text-xs text-gray-400">Some moderation features may be unavailable</p>
              </div>
              <button
                onClick={() => setAiLoadError(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      
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
                  onClick={() => setShowProfileViewDialog(true)}
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors border border-white/10 overflow-hidden"
                  title="Profile Menu"
                >
                  {userProfile?.avatar_url ? (
                    <img 
                      src={userProfile.avatar_url} 
                      alt={userProfile.first_name || 'Profile'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </header>

          {/* Ready State */}
          {connectionState === 'ready' && (
            <div className="min-h-screen flex items-center justify-center p-4 pt-20 md:pt-24">
              <div className="text-center space-y-4 md:space-y-6 max-w-xl w-full">
                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl">
                  <VideoIcon className="w-10 h-10 md:w-12 md:h-12 text-black" />
                </div>
                
                <div className="space-y-2 md:space-y-3">
                  <h2 className="text-2xl md:text-4xl font-bold">Ready to Connect?</h2>
                  <p className="text-base md:text-lg text-gray-400 px-4">
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
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 md:p-4 mt-4 mx-4 md:mx-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                      <span className="text-blue-300 font-semibold text-xs md:text-sm">Advanced Safety Active</span>
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
                  className="bg-white text-black hover:bg-gray-100 rounded-full px-8 md:px-12 py-5 md:py-7 text-lg md:text-xl font-semibold shadow-xl"
                >
                  <VideoIcon className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
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
              <div className="flex min-h-screen h-screen pt-0 md:pt-20">
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
                      <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      {!webrtcConnected && (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-center bg-black/70">
                          <div>
                            <Camera className="w-16 h-16 mx-auto mb-2" />
                            <p>Your Camera</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Video - Matched User */}
                    <div className="relative bg-black h-full flex items-center justify-center">
                      {connectionState === 'searching' ? (
                         <div className="relative w-full h-full flex items-center justify-center">
                          {/* Blurred profile photo background */}
                          <div className="absolute inset-0">
                            <img 
                              src={mockPartners[Math.floor(Math.random() * mockPartners.length)].image}
                              alt=""
                              className="w-full h-full object-cover blur-2xl opacity-40"
                            />
                          </div>
                          {/* Centered profile circle with blur */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div className="w-48 h-48 rounded-full overflow-hidden mb-6">
                              <img 
                                src={mockPartners[Math.floor(Math.random() * mockPartners.length)].image}
                                alt=""
                                className="w-full h-full object-cover blur-sm"
                              />
                            </div>
                            <p className="text-xl font-bold">Connecting...</p>
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
                          <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                            style={{ filter: blurLevel > 0 ? `blur(${blurLevel}px)` : 'none' }}
                          />
                          
                          {/* Hidden video element for AI analysis */}
                          <video
                            ref={videoRef}
                            className="hidden"
                            autoPlay
                            playsInline
                            muted
                          />
                          {/* Hidden canvas for watermarking */}
                          <canvas
                            ref={canvasRef}
                            className="hidden"
                          />
                          
                          {!webrtcConnected && (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-center bg-black/70">
                              <div>
                                <VideoIcon className="w-16 h-16 mx-auto mb-2 animate-pulse" />
                                <p>Connecting video...</p>
                                {aiInitializing && (
                                  <div className="mt-4 text-sm text-blue-400 animate-pulse">
                                    🤖 Loading AI Safety Systems...
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* AI Blur Overlay */}
                          {blurLevel > 0 && (
                            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-500/90 text-white px-4 py-2 rounded-full z-20">
                              ⚠️ Content Warning Detected
                            </div>
                          )}
                        </>
                      ) : null}
                    </div>
                  </div>

                  {/* Mobile: Stacked with Toggle */}
                  <div className="md:hidden h-full flex flex-col relative">
                    {connectionState === 'searching' ? (
                      <>
                        {videoPosition === 'half' ? (
                          <>
                            {/* Matched User Area - with blurred profile photo */}
                            <div className="flex-1 relative bg-black flex items-center justify-center">
                              {/* Blurred background */}
                              <div className="absolute inset-0">
                                <img 
                                  src={mockPartners[Math.floor(Math.random() * mockPartners.length)].image}
                                  alt=""
                                  className="w-full h-full object-cover blur-2xl opacity-40"
                                />
                              </div>
                              {/* Centered circular profile with blur */}
                              <div className="relative z-10 flex flex-col items-center">
                                <div className="w-40 h-40 rounded-full overflow-hidden mb-4">
                                  <img 
                                    src={mockPartners[Math.floor(Math.random() * mockPartners.length)].image}
                                    alt=""
                                    className="w-full h-full object-cover blur-sm"
                                  />
                                </div>
                                <p className="text-lg font-bold">Connecting...</p>
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
                            
                            {/* My Camera - clean without any overlays */}
                            <div className="flex-1 relative bg-black flex items-center justify-center border-t border-gray-800">
                              <video
                                ref={localVideoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Full Screen: Searching with My Camera PIP in corner */}
                            <div className="flex-1 relative bg-black flex items-center justify-center">
                              {/* Blurred background */}
                              <div className="absolute inset-0">
                                <img 
                                  src={mockPartners[Math.floor(Math.random() * mockPartners.length)].image}
                                  alt=""
                                  className="w-full h-full object-cover blur-2xl opacity-40"
                                />
                              </div>
                              {/* Centered circular profile with blur */}
                              <div className="relative z-10 flex flex-col items-center">
                                <div className="w-40 h-40 rounded-full overflow-hidden mb-4">
                                  <img 
                                    src={mockPartners[Math.floor(Math.random() * mockPartners.length)].image}
                                    alt=""
                                    className="w-full h-full object-cover blur-sm"
                                  />
                                </div>
                                <p className="text-lg font-bold">Connecting...</p>
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

                              {/* My Camera - Top Right Corner during searching */}
                              <div className="absolute top-20 right-4 w-32 h-44 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl z-10">
                                <video
                                  ref={localVideoCornerRef}
                                  autoPlay
                                  playsInline
                                  muted
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    ) : connectionState === 'connected' && partner ? (
                      <>
                        {videoPosition === 'half' ? (
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
                              <video
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                                style={{ filter: blurLevel > 0 ? `blur(${blurLevel}px)` : 'none' }}
                              />
                              {!webrtcConnected && (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-center bg-black/70">
                                  <div>
                                    <VideoIcon className="w-16 h-16 mx-auto mb-2 animate-pulse" />
                                    <p>Connecting...</p>
                                  </div>
                                </div>
                              )}
                              {blurLevel > 0 && (
                                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-500/90 text-white px-3 py-1.5 rounded-full z-20 text-sm">
                                  ⚠️ Warning
                                </div>
                              )}
                            </div>

                            {/* My Camera - Bottom Half - Clean without text or icons */}
                            <div className="flex-1 relative bg-black flex items-center justify-center border-t border-gray-800">
                              <video
                                ref={localVideoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                              />
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
                              <video
                                ref={remoteVideoCornerRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                                style={{ filter: blurLevel > 0 ? `blur(${blurLevel}px)` : 'none' }}
                              />
                              {!webrtcConnected && (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-center bg-black/70">
                                  <div>
                                    <VideoIcon className="w-16 h-16 mx-auto mb-2 animate-pulse" />
                                    <p>Connecting...</p>
                                  </div>
                                </div>
                              )}

                              {/* My Camera - Top Right Corner - Lowered to avoid overlap */}
                              <div className="absolute top-20 right-4 w-32 h-44 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl z-10">
                                <video
                                  ref={localVideoCornerRef}
                                  autoPlay
                                  playsInline
                                  muted
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Bottom Controls - Azar Style */}
              <div className="fixed bottom-0 left-0 right-0 z-20 pb-safe">
                <div className="max-w-4xl mx-auto">
                  {/* Mobile Controls - Clean without dark overlay */}
                  <div className="md:hidden">
                    <div className="absolute bottom-0 left-0 right-0 p-4 pb-safe">
                      {/* Safety Guidelines Link */}
                      <p className="text-center text-xs mb-3 text-white/60">
                        HabeshaLive cares about your safety. Check out our{" "}
                        <button className="text-green-400 font-medium">
                          Community Guidelines
                        </button>
                      </p>

                      {/* Control Buttons Row */}
                      <div className="flex items-center justify-center gap-3">
                        {/* Chat Button */}
                        <button 
                          onClick={() => setShowChat(!showChat)}
                          className="w-12 h-12 rounded-full bg-gray-800/80 backdrop-blur-sm flex items-center justify-center"
                        >
                          <MessageCircle className="w-5 h-5" />
                        </button>

                        {/* Video Position Toggle Button */}
                        <button 
                          onClick={() => setVideoPosition(videoPosition === 'half' ? 'corner' : 'half')}
                          className="w-12 h-12 rounded-full bg-gray-800/80 backdrop-blur-sm flex items-center justify-center"
                        >
                          <div className="flex flex-col gap-0.5">
                            <div className="w-3.5 h-2 bg-white rounded-sm"></div>
                            <div className="w-3.5 h-2 bg-white rounded-sm"></div>
                          </div>
                        </button>

                        {/* Next Button */}
                        <Button
                          onClick={handleNext}
                          className="bg-white hover:bg-gray-100 text-black font-bold px-10 py-3.5 rounded-full text-base"
                        >
                          Next →
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Controls - Small Right-Positioned */}
                  <div className="hidden md:block">
                    <div className="absolute bottom-6 right-6 flex items-center gap-3 z-30">
                      {/* Message Button */}
                      <button className="w-12 h-12 rounded-full bg-gray-800/70 backdrop-blur-sm flex items-center justify-center hover:bg-gray-700/70">
                        <MessageCircle className="w-5 h-5" />
                      </button>

                      {/* Next Button */}
                      <Button
                        onClick={handleNext}
                        className="bg-white hover:bg-gray-100 text-black font-bold px-8 py-3 rounded-full text-base"
                      >
                        Next →
                      </Button>

                      {/* Filter Button */}
                      <button className="w-12 h-12 rounded-full bg-gray-800/70 backdrop-blur-sm flex items-center justify-center hover:bg-gray-700/70">
                        <span className="text-xl">✨</span>
                      </button>
                    </div>

                    {/* ESC hint */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
                      <p className="text-xs text-white/40">Press ESC to exit</p>
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
          <EditProfileDialog open={showProfileDialog} onOpenChange={handleProfileDialogClose} />
        <ProfileViewDialog
          open={showProfileViewDialog}
          onOpenChange={setShowProfileViewDialog}
          onEditProfile={handleOpenEditProfile}
          onOpenSettings={() => {
            setShowProfileViewDialog(false);
            setShowSettingsDialog(true);
          }}
          onOpenContactUs={() => {
            setShowProfileViewDialog(false);
            setShowContactUsDialog(true);
          }}
        />
          <SettingsDialog 
            open={showSettingsDialog} 
            onOpenChange={setShowSettingsDialog}
            onManageAccount={handleOpenManageAccount}
            onContactUs={handleOpenContactUs}
          />
          <ManageAccountDialog
            open={showManageAccountDialog}
            onOpenChange={setShowManageAccountDialog}
            onBack={handleBackToSettings}
          />
          <ContactUsDialog
            open={showContactUsDialog}
            onOpenChange={setShowContactUsDialog}
          />
        </>
      )}
    </div>
  );
}
