import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, Phone, Facebook, Apple, Loader2 } from "lucide-react";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'email' | 'phone' | 'verify-email' | 'verify-phone'>('signin');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState<string>("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Welcome back!");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username: email.split('@')[0],
            first_name: fullName || 'User',
            birthday: { month: 1, day: 1, year: 2000 },
            age: 24,
            gender: 'non-binary',
            ethnicity: 'habesha',
            purpose: 'friendship',
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      toast.success("Verification email sent! Please check your inbox.");
      setMode('verify-email');
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    if (resendTimer > 0) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) throw error;

      toast.success("Verification email resent!");
      setResendTimer(45);
    } catch (error: any) {
      toast.error(error.message || "Failed to resend email");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });

      if (error) throw error;

      toast.success("OTP sent to your phone!");
      setMode('verify-phone');
      setResendTimer(45);
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms',
      });

      if (error) throw error;

      toast.success("Phone verified successfully!");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const resendPhoneOTP = async () => {
    if (resendTimer > 0) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });

      if (error) throw error;

      toast.success("New OTP sent!");
      setResendTimer(45);
    } catch (error: any) {
      toast.error(error.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: 'facebook' | 'apple' | 'google') => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || `Failed to sign in with ${provider}`);
      setLoading(false);
    }
  };

  const renderEmailAuth = () => (
    <div className="space-y-4">
      <form onSubmit={mode === 'signup' ? handleEmailSignUp : handleEmailSignIn} className="space-y-4">
        {mode === 'signup' && (
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="bg-black/40 border-white/20"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-black/40 border-white/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="bg-black/40 border-white/20"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {mode === 'signup' ? 'Creating Account...' : 'Signing In...'}
            </>
          ) : (
            mode === 'signup' ? 'Create Account' : 'Sign In'
          )}
        </Button>
      </form>

      <div className="text-center text-sm">
        {mode === 'signup' ? (
          <button
            onClick={() => setMode('signin')}
            className="text-blue-400 hover:text-blue-300"
          >
            Already have an account? Sign in
          </button>
        ) : (
          <button
            onClick={() => setMode('signup')}
            className="text-blue-400 hover:text-blue-300"
          >
            Don't have an account? Sign up
          </button>
        )}
      </div>

      <button
        onClick={() => setMode('signin')}
        className="w-full text-sm text-gray-400 hover:text-gray-300 mt-4"
      >
        ← Back to all options
      </button>
    </div>
  );

  const renderPhoneAuth = () => (
    <div className="space-y-4">
      <form onSubmit={handlePhoneSignIn} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <PhoneInput
            international
            defaultCountry="US"
            value={phone}
            onChange={(value) => setPhone(value || "")}
            className="flex h-10 w-full rounded-md border border-white/20 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-gray-400"
            placeholder="Enter phone number"
          />
          <p className="text-xs text-gray-400">
            Select your country and enter your phone number
          </p>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending OTP...
            </>
          ) : (
            'Send OTP Code'
          )}
        </Button>
      </form>

      <button
        onClick={() => setMode('signin')}
        className="w-full text-sm text-gray-400 hover:text-gray-300 mt-4"
      >
        ← Back to all options
      </button>
    </div>
  );

  const renderVerifyEmail = () => (
    <div className="space-y-4 text-center">
      <div className="space-y-2">
        <Mail className="w-16 h-16 mx-auto text-blue-400" />
        <h3 className="text-lg font-semibold">Check Your Email</h3>
        <p className="text-sm text-gray-400">
          We sent a verification link to <span className="text-white font-medium">{email}</span>
        </p>
        <p className="text-xs text-gray-500">
          Click the link in the email to verify your account
        </p>
      </div>

      <Button
        onClick={resendVerificationEmail}
        variant="outline"
        className="w-full"
        disabled={loading || resendTimer > 0}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : resendTimer > 0 ? (
          `Resend in ${resendTimer}s`
        ) : (
          'Resend Verification Email'
        )}
      </Button>

      <button
        onClick={() => setMode('signin')}
        className="w-full text-sm text-gray-400 hover:text-gray-300 mt-4"
      >
        ← Back to sign in
      </button>
    </div>
  );

  const renderVerifyPhone = () => (
    <div className="space-y-4">
      <form onSubmit={handleVerifyOTP} className="space-y-4">
        <div className="space-y-2 text-center">
          <Phone className="w-16 h-16 mx-auto text-green-400" />
          <h3 className="text-lg font-semibold">Enter Verification Code</h3>
          <p className="text-sm text-gray-400">
            We sent a 6-digit code to <span className="text-white font-medium">{phone}</span>
          </p>
        </div>

        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="bg-black/40 border-white/20" />
              <InputOTPSlot index={1} className="bg-black/40 border-white/20" />
              <InputOTPSlot index={2} className="bg-black/40 border-white/20" />
              <InputOTPSlot index={3} className="bg-black/40 border-white/20" />
              <InputOTPSlot index={4} className="bg-black/40 border-white/20" />
              <InputOTPSlot index={5} className="bg-black/40 border-white/20" />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button type="submit" className="w-full" disabled={loading || otp.length !== 6}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify Code'
          )}
        </Button>
      </form>

      <Button
        onClick={resendPhoneOTP}
        variant="outline"
        className="w-full"
        disabled={loading || resendTimer > 0}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : resendTimer > 0 ? (
          `Resend in ${resendTimer}s`
        ) : (
          'Resend Code'
        )}
      </Button>

      <button
        onClick={() => setMode('phone')}
        className="w-full text-sm text-gray-400 hover:text-gray-300 mt-4"
      >
        ← Change phone number
      </button>
    </div>
  );

  const renderMainOptions = () => (
    <div className="space-y-3">
      <Button
        onClick={() => setMode('email')}
        className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
        disabled={loading}
      >
        <Mail className="w-5 h-5 mr-2" />
        Continue with Email
      </Button>

      <Button
        onClick={() => setMode('phone')}
        className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        disabled={loading}
      >
        <Phone className="w-5 h-5 mr-2" />
        Continue with Phone
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/20" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        onClick={() => handleSocialSignIn('facebook')}
        variant="outline"
        className="w-full h-12 bg-[#1877F2] hover:bg-[#166FE5] border-none text-white"
        disabled={loading}
      >
        <Facebook className="w-5 h-5 mr-2 fill-current" />
        Continue with Facebook
      </Button>

      <Button
        onClick={() => handleSocialSignIn('apple')}
        variant="outline"
        className="w-full h-12 bg-black hover:bg-gray-900 border-white/20 text-white"
        disabled={loading}
      >
        <Apple className="w-5 h-5 mr-2 fill-current" />
        Continue with Apple
      </Button>

      <div className="text-center text-xs text-gray-400 mt-6">
        By continuing, you agree to HabeshLive's Terms of Service and Privacy Policy
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-gray-900 to-black border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-green-400 to-yellow-500 bg-clip-text text-transparent">
            {mode === 'verify-email' 
              ? 'Verify Your Email'
              : mode === 'verify-phone'
              ? 'Verify Your Phone'
              : mode === 'email' || mode === 'signup' 
              ? 'Sign In with Email' 
              : mode === 'phone' 
              ? 'Sign In with Phone' 
              : 'Welcome to HabeshLive'}
          </DialogTitle>
          <p className="text-center text-sm text-gray-400 mt-2">
            Connect with Habesha people worldwide
          </p>
        </DialogHeader>

        {mode === 'verify-email' 
          ? renderVerifyEmail() 
          : mode === 'verify-phone' 
          ? renderVerifyPhone()
          : mode === 'email' || mode === 'signup' 
          ? renderEmailAuth() 
          : mode === 'phone' 
          ? renderPhoneAuth() 
          : renderMainOptions()}
      </DialogContent>
    </Dialog>
  );
}