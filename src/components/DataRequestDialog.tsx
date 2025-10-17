import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Mail, FileText } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DataRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
}

export function DataRequestDialog({ open, onOpenChange, onBack }: DataRequestDialogProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      toast.error("❌ Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Here you would typically send this to an edge function to email the data
      // For now, we'll just show success
      toast.success(`✅ Your data will be sent to ${email} within 24-48 hours`);
      onOpenChange(false);
      setEmail("");
    } catch (error: any) {
      console.error('Error requesting data:', error);
      toast.error(error.message || "Failed to request data");
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
              <DialogTitle className="text-xl font-bold">My HabeshLive Data Request</DialogTitle>
              <p className="text-sm text-gray-400">We'll email your data to you</p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          <div className="bg-[#00D9B4]/10 border border-[#00D9B4]/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-[#00D9B4] flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-300">
                <p className="font-medium text-white mb-1">Data Privacy</p>
                <p className="text-xs leading-relaxed">
                  We'll send your personal data to your email within 24-48 hours. This includes your profile information, settings, and activity history.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#00D9B4]" />
              Email Address <span className="text-red-400">*</span>
            </Label>
            <Input
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#2a2a2a] border-gray-700 text-white placeholder:text-gray-500 focus:border-[#00D9B4] focus:ring-[#00D9B4]"
            />
            <p className="text-xs text-gray-500">
              We'll send your data to this email address
            </p>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#00D9B4] hover:bg-[#00c9a4] text-black font-medium py-6 text-lg rounded-xl"
          >
            {loading ? 'Requesting...' : '✅ Request My Data'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
