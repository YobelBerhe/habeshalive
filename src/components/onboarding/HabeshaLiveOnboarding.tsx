// 🎯 HABESHALIVE COMPLETE ONBOARDING SYSTEM
// Combines: Hinge UI + Duolingo patterns + Ethiopian coffee mascot
// Clean white background with dark mode support

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Check, 
  ChevronRight, 
  Camera, 
  X,
  Eye,
  Droplet,
  Star,
  ShieldCheck,
  Shield
} from 'lucide-react';
import { ScrollableDatePicker } from "@/components/ScrollableDatePicker";
import { useNavigate } from 'react-router-dom';

// ☕ COFFEE CUP MASCOT
const CoffeeCupMascot = ({ size = 120, animated = true }: { size?: number; animated?: boolean }) => {
  return (
    <motion.div
      initial={animated ? { scale: 0, rotate: -180 } : false}
      animate={animated ? { scale: 1, rotate: 0 } : false}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="relative inline-block"
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={animated ? { y: [0, -8, 0] } : false}
        transition={animated ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : undefined}
      >
        {/* Coffee steam */}
        {animated && (
          <g opacity="0.6">
            <motion.path
              d="M 90 30 Q 85 20, 90 10"
              stroke="#8B4513"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              animate={{ opacity: [0.3, 0.7, 0.3], y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.path
              d="M 100 35 Q 105 25, 100 15"
              stroke="#8B4513"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              animate={{ opacity: [0.3, 0.7, 0.3], y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            />
          </g>
        )}
        
        {/* Cup body */}
        <path
          d="M 50 60 Q 45 100, 50 140 Q 50 165, 100 165 Q 150 165, 150 140 Q 155 100, 150 60 Q 150 50, 100 50 Q 50 50, 50 60 Z"
          fill="#F5F5DC"
          stroke="#D2B48C"
          strokeWidth="3"
        />
        
        {/* Coffee inside */}
        <ellipse cx="100" cy="60" rx="48" ry="15" fill="#6B4423" />
        
        {/* Red tulip (left) */}
        <g>
          <path d="M 65 100 Q 60 95, 65 90 L 65 110" fill="#DA121A" />
          <ellipse cx="63" cy="115" rx="6" ry="10" fill="#DA121A" />
        </g>
        
        {/* Green tulip (right) */}
        <g>
          <path d="M 135 100 Q 140 95, 135 90 L 135 110" fill="#078930" />
          <ellipse cx="137" cy="115" rx="6" ry="10" fill="#078930" />
        </g>
        
        {/* Eyes */}
        <motion.circle
          cx="80"
          cy="95"
          r="12"
          fill="white"
          animate={animated ? { scaleY: [1, 0.1, 1] } : false}
          transition={animated ? { duration: 0.3, repeat: Infinity, repeatDelay: 3 } : undefined}
        />
        <circle cx="82" cy="95" r="7" fill="#3B2414" />
        <circle cx="79" cy="92" r="3" fill="white" />
        
        <motion.circle
          cx="120"
          cy="95"
          r="12"
          fill="white"
          animate={animated ? { scaleY: [1, 0.1, 1] } : false}
          transition={animated ? { duration: 0.3, repeat: Infinity, repeatDelay: 3 } : undefined}
        />
        <circle cx="122" cy="95" r="7" fill="#3B2414" />
        <circle cx="119" cy="92" r="3" fill="white" />
        
        {/* Smile */}
        <path
          d="M 80 120 Q 100 135, 120 120"
          stroke="#3B2414"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Blush */}
        <ellipse cx="60" cy="110" rx="8" ry="6" fill="#FFB6C1" opacity="0.4" />
        <ellipse cx="140" cy="110" rx="8" ry="6" fill="#FFB6C1" opacity="0.4" />
      </motion.svg>
    </motion.div>
  );
};

// Types
type OnboardingStep = 
  | 'splash'
  | 'birthday' 
  | 'gender' 
  | 'ethnicity' 
  | 'name' 
  | 'purpose' 
  | 'safety' 
  | 'preferences' 
  | 'photos'
  | 'religion'
  | 'complete';

type MatchingMode = 'both' | 'same-gender-only' | 'opposite-only';

interface Purpose {
  id: string;
  icon: string;
  title: string;
  description: string;
}

const purposeOptions: Purpose[] = [
  { id: 'language-practice', icon: '📖', title: 'Language Practice', description: 'Learn or teach Tigrinya, Amharic, Oromo' },
  { id: 'friendship', icon: '❤️', title: 'Make Friends', description: 'Connect with Habesha people worldwide' },
  { id: 'cultural-exchange', icon: '🌍', title: 'Cultural Exchange', description: 'Share traditions, food, music, stories' },
  { id: 'diaspora-connect', icon: '☕', title: 'Diaspora Connect', description: 'Connect homeland with diaspora' },
  { id: 'business-networking', icon: '💼', title: 'Business Network', description: 'Professional connections & opportunities' },
  { id: 'just-chat', icon: '💬', title: 'Just Chat', description: 'Casual conversations, no pressure' }
];

const RELIGIONS = [
  'Orthodox Christian',
  'Muslim',
  'Protestant Christian',
  'Catholic',
  'Jewish',
  'Other',
  'Prefer not to say'
];

interface HabeshaLiveOnboardingProps {
  onComplete: (data: {
    birthday: { day: number; month: number; year: number };
    gender: 'male' | 'female';
    ethnicity: string;
    firstName: string;
    purpose: string;
    matchingMode: MatchingMode;
    religion: string;
    religionVisible: boolean;
  }) => void;
}

export const HabeshaLiveOnboarding: React.FC<HabeshaLiveOnboardingProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('splash');
  const [progress, setProgress] = useState(0);
  
  // Form state
  const [birthday, setBirthday] = useState({ day: 15, month: 6, year: 1995 });
  const [userGender, setUserGender] = useState<'male' | 'female' | null>(null);
  const [ethnicity, setEthnicity] = useState<string>('');
  const [userName, setUserName] = useState('');
  const [userPurpose, setUserPurpose] = useState<string>('');
  const [matchingMode, setMatchingMode] = useState<MatchingMode>('both');
  const [religion, setReligion] = useState<string>('');
  const [religionVisible, setReligionVisible] = useState(true);

  // Calculate age
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

  // Auto-navigate from splash
  useEffect(() => {
    if (currentStep === 'splash') {
      const timer = setTimeout(() => {
        setCurrentStep('birthday');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // Update progress
  useEffect(() => {
    const steps: OnboardingStep[] = [
      'splash', 'birthday', 'gender', 'ethnicity', 'name', 'purpose', 
      'safety', 'preferences', 'photos', 'religion', 'complete'
    ];
    const currentIndex = steps.indexOf(currentStep);
    const newProgress = (currentIndex / (steps.length - 1)) * 100;
    setProgress(newProgress);
  }, [currentStep]);

  const goBack = () => {
    const stepMap: Record<OnboardingStep, OnboardingStep> = {
      splash: 'splash',
      birthday: 'splash',
      gender: 'birthday',
      ethnicity: 'gender',
      name: 'ethnicity',
      purpose: 'name',
      safety: 'purpose',
      preferences: 'safety',
      photos: 'preferences',
      religion: 'photos',
      complete: 'religion'
    };
    setCurrentStep(stepMap[currentStep]);
  };

  const handleComplete = () => {
    if (!userGender) return;
    
    onComplete({
      birthday,
      gender: userGender,
      ethnicity,
      firstName: userName,
      purpose: userPurpose,
      matchingMode,
      religion,
      religionVisible
    });
  };

  return (
    <div className="fixed inset-0 z-50 min-h-screen w-full bg-white dark:bg-gray-900 font-sans overflow-hidden">
      {/* Progress Bar (Hinge-style dots) */}
      {currentStep !== 'splash' && currentStep !== 'complete' && (
        <div className="fixed top-0 left-0 right-0 z-50 px-6 pt-6 pb-2 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-4 max-w-2xl mx-auto">
            <button 
              onClick={goBack}
              className="w-10 h-10 border-2 border-black dark:border-white rounded-full flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft size={20} strokeWidth={2.5} className="text-black dark:text-white" />
            </button>
            
            {/* Progress dots */}
            <div className="flex gap-1.5">
              {[0,1,2,3,4,5,6,7,8].map((i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i <= Math.floor(progress / 11)
                      ? 'bg-black dark:bg-white'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>
            
            {/* Close button */}
            <button 
              onClick={() => navigate('/')}
              className="ml-auto w-10 h-10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X size={20} strokeWidth={2.5} className="text-black dark:text-white" />
            </button>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* STEP 1: SPLASH */}
        {currentStep === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1a0f0a] via-[#3d2817] to-[#1a0f0a]"
          >
            <CoffeeCupMascot size={200} animated={true} />
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-center"
            >
              <h1 className="text-5xl font-bold mb-2 text-[#D4AF37]">ሰላም!</h1>
              <p className="text-2xl font-semibold text-white">Welcome to HabeshaLive</p>
              <p className="text-gray-300 mt-2">Connect with Habesha people worldwide</p>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-8 flex gap-1"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-[#D4AF37] rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* STEP 2: BIRTHDAY */}
        {currentStep === 'birthday' && (
          <motion.div
            key="birthday"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="pt-24 pb-32 px-6 h-full overflow-auto"
          >
            <div className="max-w-md mx-auto">
              <h1 className="text-[32px] font-serif font-bold leading-tight tracking-tight mb-2 text-black dark:text-white">
                My birthday is
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-12">
                Tell us your age and we'll help you meet people you'd vibe with.
              </p>
              
              <div className="flex items-center justify-center mb-12">
                <ScrollableDatePicker
                  selectedDay={birthday.day}
                  selectedMonth={birthday.month}
                  selectedYear={birthday.year}
                  onDateChange={(day, month, year) => setBirthday({ day, month, year })}
                />
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white dark:bg-gray-900">
              <div className="max-w-md mx-auto flex justify-end">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentStep('gender')}
                  className="w-14 h-14 rounded-full bg-[#D4AF37] flex items-center justify-center shadow-lg hover:bg-[#C4A02F] transition-colors"
                >
                  <ChevronRight size={28} strokeWidth={2.5} className="text-white" />
                </motion.button>
              </div>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                You're {calculateAge()} years old - Double-check! You won't be able to edit this.
              </p>
            </div>
          </motion.div>
        )}

        {/* STEP 3: GENDER */}
        {currentStep === 'gender' && (
          <motion.div
            key="gender"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="pt-24 pb-32 px-6"
          >
            <div className="max-w-md mx-auto">
              <h1 className="text-[32px] font-serif font-bold leading-tight tracking-tight mb-8 text-black dark:text-white">
                I am a
              </h1>
              
              <div className="space-y-0">
                {['Male', 'Female'].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setUserGender(option.toLowerCase() as 'male' | 'female');
                      setTimeout(() => setCurrentStep('ethnicity'), 300);
                    }}
                    className="w-full flex items-center justify-between py-5 border-b border-gray-100 dark:border-gray-800 group outline-none focus-visible:bg-gray-50 dark:focus-visible:bg-gray-800 transition-colors"
                  >
                    <span className="text-[17px] font-normal text-black dark:text-white">
                      {option}
                    </span>
                    <div className="w-6 h-6 rounded bg-gray-100 dark:bg-gray-800" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 4: ETHNICITY */}
        {currentStep === 'ethnicity' && (
          <motion.div
            key="ethnicity"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="pt-24 pb-32 px-6"
          >
            <div className="max-w-md mx-auto">
              <h1 className="text-[32px] font-serif font-bold leading-tight tracking-tight mb-2 text-black dark:text-white">
                What's your ethnicity?
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Ethnicity is not displayed on the profile.
              </p>
              
              <div className="space-y-0">
                {[
                  { id: 'eritrean-habesha', label: 'Eritrean Habesha', flag: '🇪🇷' },
                  { id: 'ethiopian-habesha', label: 'Ethiopian Habesha', flag: '🇪🇹' },
                  { id: 'mixed-habesha', label: 'Mixed Habesha', flag: '🌍' }
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setEthnicity(option.id);
                      setTimeout(() => setCurrentStep('name'), 300);
                    }}
                    className="w-full flex items-center justify-between py-5 border-b border-gray-100 dark:border-gray-800 group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.flag}</span>
                      <span className="text-[17px] font-normal text-black dark:text-white">
                        {option.label}
                      </span>
                    </div>
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${
                      ethnicity === option.id ? 'bg-[#D4AF37]' : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      {ethnicity === option.id && <Check size={14} strokeWidth={4} className="text-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 5: NAME */}
        {currentStep === 'name' && (
          <motion.div
            key="name"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="pt-24 pb-32 px-6"
          >
            <div className="max-w-md mx-auto">
              <h1 className="text-[32px] font-serif font-bold leading-tight tracking-tight mb-2 text-black dark:text-white">
                My name is
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                This is how it will appear in HabeshaLive and you will not be able to change it.
              </p>
              
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="First name"
                className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-medium focus:border-[#D4AF37] outline-none bg-white dark:bg-gray-800 text-black dark:text-white"
                autoFocus
              />
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white dark:bg-gray-900">
              <div className="max-w-md mx-auto flex justify-end">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentStep('purpose')}
                  disabled={!userName.trim()}
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                    userName.trim()
                      ? 'bg-[#D4AF37] hover:bg-[#C4A02F]'
                      : 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed'
                  }`}
                >
                  <ChevronRight size={28} strokeWidth={2.5} className="text-white" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 6: PURPOSE (With mascot) */}
        {currentStep === 'purpose' && (
          <motion.div
            key="purpose"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="pt-24 pb-32 px-6 h-full overflow-auto"
          >
            <div className="max-w-2xl mx-auto">
              {/* Mascot with speech bubble */}
              <div className="flex items-start mb-8">
                <div className="flex-shrink-0">
                  <CoffeeCupMascot size={100} animated={true} />
                </div>
                
                <div className="ml-4 mt-4 relative">
                  <div className="bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-sm relative">
                    <div className="absolute top-6 -left-2.5 w-4 h-4 bg-gray-50 dark:bg-gray-800 border-l-2 border-b-2 border-gray-200 dark:border-gray-700 rotate-45" />
                    <p className="text-xl font-bold text-black dark:text-white leading-tight">
                      Why are you here today?
                    </p>
                  </div>
                </div>
              </div>

              {/* Purpose options */}
              <div className="space-y-3">
                {purposeOptions.map((purpose) => {
                  const isSelected = userPurpose === purpose.id;
                  return (
                    <motion.button
                      key={purpose.id}
                      onClick={() => setUserPurpose(purpose.id)}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center p-4 rounded-2xl border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-[#D4AF37] bg-[#FFF9E6] dark:bg-[#2a2416] shadow-md'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750'
                      }`}
                    >
                      <div className="text-4xl mr-4">{purpose.icon}</div>
                      <div className="flex-1 text-left">
                        <div className={`text-lg font-bold ${
                          isSelected ? 'text-[#8B6914]' : 'text-black dark:text-white'
                        }`}>
                          {purpose.title}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {purpose.description}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white dark:bg-gray-900">
              <div className="max-w-2xl mx-auto flex justify-end">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentStep('safety')}
                  disabled={!userPurpose}
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors ${
                    userPurpose
                      ? 'bg-[#D4AF37] hover:bg-[#C4A02F]'
                      : 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed'
                  }`}
                >
                  <ChevronRight size={28} strokeWidth={2.5} className="text-white" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 7: SAFETY */}
        {currentStep === 'safety' && (
          <motion.div
            key="safety"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="pt-24 pb-32 px-6 h-full overflow-auto"
          >
            <div className="max-w-2xl mx-auto">
              <h1 className="text-[32px] font-serif font-bold mb-2 text-black dark:text-white">
                Your Safety is Our Priority! 🛡️
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                HabeshaLive uses cutting-edge AI technology to keep you safe
              </p>
              
              <div className="space-y-4 mb-8">
                {/* AI Content Moderation */}
                <div className="flex items-start gap-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-100 dark:border-blue-800 rounded-xl p-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center flex-shrink-0">
                    <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1 flex items-center gap-2 text-black dark:text-white">
                      AI Content Moderation
                      <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">REAL-TIME</span>
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      Automatically detects and blurs inappropriate content
                    </p>
                  </div>
                </div>

                {/* Screenshot Protection */}
                <div className="flex items-start gap-4 bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-100 dark:border-purple-800 rounded-xl p-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-800 flex items-center justify-center flex-shrink-0">
                    <Droplet className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1 flex items-center gap-2 text-black dark:text-white">
                      Screenshot Protection
                      <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">FORENSIC</span>
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      Every frame has an invisible watermark
                    </p>
                  </div>
                </div>

                {/* Respect Score */}
                <div className="flex items-start gap-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-100 dark:border-yellow-800 rounded-xl p-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-800 flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1 flex items-center gap-2 text-black dark:text-white">
                      Respect Score System
                      <span className="text-xs bg-yellow-600 text-black px-2 py-0.5 rounded-full">COMMUNITY</span>
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      Only high-respect users get matched (85+ score)
                    </p>
                  </div>
                </div>

                {/* Modesty Filter */}
                <div className="flex items-start gap-4 bg-pink-50 dark:bg-pink-900/20 border-2 border-pink-100 dark:border-pink-800 rounded-xl p-4">
                  <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-800 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1 flex items-center gap-2 text-black dark:text-white">
                      Modesty AI Filter
                      <span className="text-xs bg-pink-600 text-white px-2 py-0.5 rounded-full">CULTURAL</span>
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      Respects cultural and religious values
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-100 dark:border-green-800 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold text-black dark:text-white">Why HabeshaLive is the Safest:</span>{' '}
                    We combine AI technology + human moderation + community accountability.
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                By continuing, I acknowledge that HabeshaLive uses facial geometry data for filters, but does not collect or store this information.
              </p>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white dark:bg-gray-900">
              <div className="max-w-2xl mx-auto flex justify-end">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentStep('preferences')}
                  className="w-14 h-14 rounded-full bg-[#D4AF37] hover:bg-[#C4A02F] flex items-center justify-center shadow-lg"
                >
                  <ChevronRight size={28} strokeWidth={2.5} className="text-white" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 8: PREFERENCES */}
        {currentStep === 'preferences' && (
          <motion.div
            key="preferences"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="pt-24 pb-32 px-6"
          >
            <div className="max-w-md mx-auto">
              <h1 className="text-[32px] font-serif font-bold mb-2 text-black dark:text-white">
                Show me
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Choose who you'd like to match with
              </p>
              
              <div className="space-y-0">
                {[
                  { id: 'both', label: 'Everyone', desc: 'See all available matches' },
                  { id: 'same-gender-only', label: 'Same gender only', desc: 'For language practice & friendship' },
                  { id: 'opposite-only', label: 'Opposite gender only', desc: 'For dating & relationships' }
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setMatchingMode(option.id as MatchingMode)}
                    className="w-full flex items-center justify-between py-5 border-b border-gray-100 dark:border-gray-800 group"
                  >
                    <div>
                      <div className="text-[17px] font-semibold text-black dark:text-white text-left">
                        {option.label}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 text-left">
                        {option.desc}
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${
                      matchingMode === option.id ? 'bg-[#D4AF37]' : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      {matchingMode === option.id && <Check size={14} strokeWidth={4} className="text-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white dark:bg-gray-900">
              <div className="max-w-md mx-auto flex justify-end">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentStep('photos')}
                  className="w-14 h-14 rounded-full bg-[#D4AF37] hover:bg-[#C4A02F] flex items-center justify-center shadow-lg"
                >
                  <ChevronRight size={28} strokeWidth={2.5} className="text-white" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 9: PHOTOS */}
        {currentStep === 'photos' && (
          <motion.div
            key="photos"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="pt-24 pb-32 px-6"
          >
            <div className="max-w-md mx-auto">
              <h1 className="text-[32px] font-serif font-bold mb-2 text-black dark:text-white">
                Add photos
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Add at least 2 photos to continue
              </p>
              
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[0,1,2,3,4,5].map((i) => (
                  <button
                    key={i}
                    className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center border-2 border-gray-200 dark:border-gray-700 hover:border-[#D4AF37] transition-colors"
                  >
                    <Camera size={32} className="text-gray-400" />
                  </button>
                ))}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-100 dark:border-blue-800 rounded-xl p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong className="text-black dark:text-white">Tip:</strong> Use clear photos where your face is visible. Profiles with photos get 10x more matches!
                </p>
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white dark:bg-gray-900">
              <div className="max-w-md mx-auto flex justify-end">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentStep('religion')}
                  className="w-14 h-14 rounded-full bg-[#D4AF37] hover:bg-[#C4A02F] flex items-center justify-center shadow-lg"
                >
                  <ChevronRight size={28} strokeWidth={2.5} className="text-white" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 10: RELIGION */}
        {currentStep === 'religion' && (
          <motion.div
            key="religion"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="pt-24 pb-32 px-6 h-full overflow-auto"
          >
            <div className="max-w-md mx-auto">
              <h1 className="text-[32px] font-serif font-bold leading-tight tracking-tight mb-2 text-black dark:text-white">
                What are your religious<br />beliefs?
              </h1>
              
              <div className="space-y-0 mb-8">
                {RELIGIONS.map((rel) => (
                  <button
                    key={rel}
                    onClick={() => setReligion(rel)}
                    className="w-full flex items-center justify-between py-5 border-b border-gray-100 dark:border-gray-800 group"
                  >
                    <span className={`text-[17px] ${
                      religion === rel ? 'font-semibold' : 'font-normal'
                    } text-black dark:text-white`}>
                      {rel}
                    </span>
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${
                      religion === rel ? 'bg-[#D4AF37]' : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      {religion === rel && <Check size={14} strokeWidth={4} className="text-white" />}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setReligionVisible(!religionVisible)}
                className="flex items-center gap-3 mb-8"
              >
                <div className={`w-6 h-6 rounded flex items-center justify-center ${
                  religionVisible ? 'bg-[#D4AF37]' : 'bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'
                }`}>
                  {religionVisible && <Check size={14} strokeWidth={4} className="text-white" />}
                </div>
                <span className="text-[15px] font-medium text-black dark:text-white">
                  Visible on profile
                </span>
              </button>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white dark:bg-gray-900 border-t-2 border-gray-100 dark:border-gray-800">
              <div className="max-w-md mx-auto">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleComplete}
                  disabled={!religion}
                  className={`w-full py-4 rounded-full text-lg font-bold transition-all ${
                    religion
                      ? 'bg-[#D4AF37] hover:bg-[#C4A02F] text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Complete Profile 🎉
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 11: COMPLETE */}
        {currentStep === 'complete' && (
          <motion.div
            key="complete"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="h-screen flex flex-col items-center justify-center px-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CoffeeCupMascot size={150} animated={true} />
            </motion.div>
            
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-4xl font-bold text-black dark:text-white mt-8 mb-4"
            >
              You're all set, {userName}!
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-600 dark:text-gray-400 text-center mb-12 max-w-md"
            >
              Ready to connect with amazing Habesha people worldwide
            </motion.p>
            
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/video-chat')}
              className="bg-[#D4AF37] hover:bg-[#C4A02F] text-white px-12 py-4 rounded-full font-bold text-lg shadow-lg"
            >
              Start Matching
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom indicator (Hinge-style) */}
      {currentStep !== 'splash' && currentStep !== 'complete' && (
        <div className="fixed bottom-0 left-0 right-0 h-8 w-full flex justify-center items-center pb-2 pointer-events-none">
          <div className="w-32 h-1 bg-black/10 dark:bg-white/10 rounded-full" />
        </div>
      )}
    </div>
  );
};

export default HabeshaLiveOnboarding;
