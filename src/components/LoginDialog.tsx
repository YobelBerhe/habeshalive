import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, Apple, ArrowLeft } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: () => void;
}

export function LoginDialog({ open, onOpenChange, onLogin }: LoginDialogProps) {
  const [loginMethod, setLoginMethod] = useState<'main' | 'email' | 'phone'>('main');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [awaitingVerification, setAwaitingVerification] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async () => {
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        if (error) throw error;
        toast.success('Check your email for verification link!');
        onOpenChange(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        toast.success('Signed in successfully!');
        onLogin();
        onOpenChange(false);
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneAuth = async () => {
    setLoading(true);
    try {
      if (!awaitingVerification) {
        const { error } = await supabase.auth.signInWithOtp({
          phone: phone
        });
        if (error) throw error;
        setAwaitingVerification(true);
        toast.success('Verification code sent to your phone!');
      } else {
        const { error } = await supabase.auth.verifyOtp({
          phone: phone,
          token: verificationCode,
          type: 'sms'
        });
        if (error) throw error;
        toast.success('Phone verified successfully!');
        onLogin();
        onOpenChange(false);
      }
    } catch (error: any) {
      toast.error(error.message || 'Phone authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'facebook' | 'google') => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'Social login failed');
    } finally {
      setLoading(false);
    }
  };

  const resetDialog = () => {
    setLoginMethod('main');
    setEmail('');
    setPassword('');
    setPhone('');
    setVerificationCode('');
    setIsSignUp(false);
    setAwaitingVerification(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetDialog();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="bg-white text-black max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {loginMethod === 'main' && 'Welcome to HabeshaLive'}
            {loginMethod === 'email' && (isSignUp ? 'Create Account' : 'Sign In with Email')}
            {loginMethod === 'phone' && (awaitingVerification ? 'Enter Verification Code' : 'Sign In with Phone')}
          </DialogTitle>
        </DialogHeader>
        
        {loginMethod === 'main' && (
          <div className="space-y-3 py-4">
            <Button
              onClick={() => setLoginMethod('email')}
              className="w-full bg-white hover:bg-gray-100 text-black border-2 border-gray-300 py-6 text-lg font-medium"
            >
              <Mail className="w-5 h-5 mr-3" />
              Continue with Email
            </Button>
            
            <Button
              onClick={() => handleSocialLogin('facebook')}
              disabled={loading}
              className="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white py-6 text-lg font-medium"
            >
              <FaFacebook className="w-5 h-5 mr-3" />
              Continue with Facebook
            </Button>
            
            <Button
              onClick={() => setLoginMethod('phone')}
              className="w-full bg-white hover:bg-gray-100 text-black border-2 border-gray-300 py-6 text-lg font-medium"
            >
              <Phone className="w-5 h-5 mr-3" />
              Continue with Phone
            </Button>
            
            <Button
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
              className="w-full bg-black hover:bg-gray-900 text-white py-6 text-lg font-medium"
            >
              <Apple className="w-5 h-5 mr-3" />
              Continue with Google
            </Button>
          </div>
        )}

        {loginMethod === 'email' && (
          <div className="space-y-4 py-4">
            <Button
              onClick={() => setLoginMethod('main')}
              variant="ghost"
              className="mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
            
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
            
            <Button
              onClick={handleEmailAuth}
              disabled={loading || !email || !password}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-medium"
            >
              {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </Button>

            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full text-center text-sm text-gray-600 hover:text-gray-800"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        )}

        {loginMethod === 'phone' && (
          <div className="space-y-4 py-4">
            <Button
              onClick={() => {
                setLoginMethod('main');
                setAwaitingVerification(false);
              }}
              variant="ghost"
              className="mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            {!awaitingVerification ? (
              <>
                <Input
                  type="tel"
                  placeholder="Phone number (with country code)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full"
                />
                
                <Button
                  onClick={handlePhoneAuth}
                  disabled={loading || !phone}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-medium"
                >
                  {loading ? 'Sending...' : 'Send Verification Code'}
                </Button>
              </>
            ) : (
              <>
                <Input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  className="w-full"
                />
                
                <Button
                  onClick={handlePhoneAuth}
                  disabled={loading || verificationCode.length !== 6}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-medium"
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </Button>
              </>
            )}
          </div>
        )}
        
        <p className="text-xs text-gray-500 text-center mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </DialogContent>
    </Dialog>
  );
}
