import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Mail, AlertCircle } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChangeEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
  currentEmail: string;
}

export function ChangeEmailDialog({ open, onOpenChange, onBack, currentEmail }: ChangeEmailDialogProps) {
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!newEmail || !newEmail.includes('@')) {
      toast.error("❌ Please enter a valid email address");
      return;
    }

    if (!password) {
      toast.error("❌ Please enter your password");
      return;
    }

    setLoading(true);
    try {
      // First verify password by trying to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: currentEmail,
        password: password,
      });

      if (signInError) {
        toast.error("❌ Incorrect password");
        setLoading(false);
        return;
      }

      // Update email
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (error) throw error;

      toast.success("✅ Verification email sent! Please check your new email to confirm the change.");
      onOpenChange(false);
      setNewEmail("");
      setPassword("");
    } catch (error: any) {
      console.error('Error changing email:', error);
      toast.error(error.message || "Failed to change email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black text-white border-gray-800 max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack} 
              className="hover:bg-white/10 p-2 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <DialogTitle className="text-xl font-bold">Change Email</DialogTitle>
              <p className="text-sm text-gray-400">Update your email address</p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          <div className="bg-[#00D9B4]/10 border border-[#00D9B4]/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#00D9B4] flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-300">
                <p className="font-medium text-white mb-1">Email Verification Required</p>
                <p className="text-xs leading-relaxed">
                  You'll receive a verification email at your new address. Click the link to confirm the change.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Current Email</Label>
            <Input
              type="email"
              value={currentEmail}
              disabled
              className="bg-[#2a2a2a] border-gray-700 text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#00D9B4]" />
              New Email Address <span className="text-red-400">*</span>
            </Label>
            <Input
              type="email"
              placeholder="your.newemail@example.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="bg-[#2a2a2a] border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00D9B4] focus:ring-[#00D9B4]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Current Password <span className="text-red-400">*</span>
            </Label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#2a2a2a] border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00D9B4] focus:ring-[#00D9B4]"
            />
            <p className="text-xs text-gray-500">
              Enter your password to confirm this change
            </p>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#00D9B4] hover:bg-[#00c9a4] text-black font-medium py-6 text-lg rounded-xl"
          >
            {loading ? 'Updating...' : '✅ Change Email'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
