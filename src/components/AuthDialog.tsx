import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, Phone, Facebook, Apple, Loader2 } from "lucide-react";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'email' | 'phone'>('signin');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

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
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      toast.success("Account created! You can now sign in.");
      setMode('signin');
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });

      if (error) throw error;

      toast.success("Check your phone for the OTP code!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
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
          <Input
            id="phone"
            type="tel"
            placeholder="+1234567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="bg-black/40 border-white/20"
          />
          <p className="text-xs text-gray-400">
            Include country code (e.g., +1 for USA)
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
            {mode === 'email' || mode === 'signup' 
              ? 'Sign In with Email' 
              : mode === 'phone' 
              ? 'Sign In with Phone' 
              : 'Welcome to HabeshLive'}
          </DialogTitle>
          <p className="text-center text-sm text-gray-400 mt-2">
            Connect with Habesha people worldwide
          </p>
        </DialogHeader>

        {mode === 'email' || mode === 'signup' ? renderEmailAuth() : mode === 'phone' ? renderPhoneAuth() : renderMainOptions()}
      </DialogContent>
    </Dialog>
  );
}