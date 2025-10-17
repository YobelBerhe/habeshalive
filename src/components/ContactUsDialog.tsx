import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Shield, AlertCircle, Coffee } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ContactUsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactUsDialog({ open, onOpenChange }: ContactUsDialogProps) {
  const [formData, setFormData] = useState({
    category: "",
    email: "",
    accountId: "",
    country: "",
    device: "",
    osVersion: "",
    language: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadUserData();
    }
  }, [open]);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('email, country, id')
        .eq('id', user.id)
        .single();

      if (profile) {
        setFormData(prev => ({
          ...prev,
          email: profile.email || user.email || '',
          accountId: profile.id,
          country: profile.country || '',
        }));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.category || !formData.email || !formData.description || !formData.language) {
      toast.error("❌ Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      // In production, send this to your backend/support system
      const { data: { user } } = await supabase.auth.getUser();
      
      // Create support ticket
      const { error } = await supabase
        .from('reports')
        .insert({
          reporter_id: user?.id,
          reason: formData.category,
          description: `
Category: ${formData.category}
Email: ${formData.email}
Country: ${formData.country}
Device: ${formData.device}
OS: ${formData.osVersion}
Language: ${formData.language}

Description:
${formData.description}
          `,
          status: 'pending',
          priority: 'medium',
        });

      if (error) throw error;

      toast.success("✅ Request submitted! We'll get back to you within 24-48 hours");
      onOpenChange(false);
      
      // Reset form
      setFormData({
        category: "",
        email: "",
        accountId: "",
        country: "",
        device: "",
        osVersion: "",
        language: "",
        description: "",
      });
    } catch (error: any) {
      console.error('Error submitting request:', error);
      toast.error(error.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-habesha-gradient text-habesha-cream border-habesha-border max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Habesha Cultural Header Pattern */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-habesha-gold via-habesha-hover-gold to-habesha-gold opacity-80"></div>
        
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-habesha-gold/20 p-2 rounded-lg">
              <MessageSquare className="w-6 h-6 text-habesha-gold" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-habesha-cream">Help Center</DialogTitle>
              <p className="text-sm text-habesha-cream/70">ሓገዝ ማእከል (We're here to help you)</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2 text-habesha-cream">
              <Shield className="w-4 h-4 text-habesha-gold" />
              Issue Category <span className="text-red-400">*</span>
            </Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger className="bg-habesha-dark border-habesha-border text-habesha-cream focus:border-habesha-gold focus:ring-habesha-gold">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-habesha-dark border-habesha-border text-habesha-cream">
                <SelectItem value="account">Account</SelectItem>
                <SelectItem value="payment">Payment & Refund</SelectItem>
                <SelectItem value="technical">Technical Issues</SelectItem>
                <SelectItem value="live">HabeshLive Issues</SelectItem>
                <SelectItem value="safety">Safety, Security & Privacy</SelectItem>
                <SelectItem value="legal">Law enforcement inquiries</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Mail className="w-4 h-4 text-habesha-gold" />
              Email Address <span className="text-red-400">*</span>
            </Label>
            <Input
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-habesha-dark border-habesha-border text-habesha-cream placeholder:text-habesha-cream/40 focus:border-habesha-gold focus:ring-habesha-gold"
            />
            <p className="text-xs text-habesha-cream/50">Please make sure your email is valid</p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-habesha-gold" />
              Description (as detailed as possible) <span className="text-red-400">*</span>
            </Label>
            <Textarea
              placeholder="Describe your issue in detail... ጉዳይካ ብዝርዝር ግለጽ"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-habesha-dark border-habesha-border text-habesha-cream placeholder:text-habesha-cream/40 min-h-[120px] resize-none focus:border-habesha-gold focus:ring-habesha-gold"
            />
          </div>

          {/* Account ID */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-habesha-cream">Account ID</Label>
            <Input
              placeholder="Your account ID"
              value={formData.accountId}
              onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
              className="bg-habesha-dark border-habesha-border text-habesha-cream placeholder:text-habesha-cream/40 font-mono text-sm"
              disabled
            />
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-habesha-cream">Country <span className="text-red-400">*</span></Label>
            <Input
              placeholder="Your country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="bg-habesha-dark border-habesha-border text-habesha-cream placeholder:text-habesha-cream/40 focus:border-habesha-gold focus:ring-habesha-gold"
            />
          </div>

          {/* Device & OS */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-habesha-cream">Your Device</Label>
              <Input
                placeholder="e.g., iPhone 14"
                value={formData.device}
                onChange={(e) => setFormData({ ...formData, device: e.target.value })}
                className="bg-habesha-dark border-habesha-border text-habesha-cream placeholder:text-habesha-cream/40 focus:border-habesha-gold focus:ring-habesha-gold"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-habesha-cream">OS Version</Label>
              <Input
                placeholder="e.g., iOS 17"
                value={formData.osVersion}
                onChange={(e) => setFormData({ ...formData, osVersion: e.target.value })}
                className="bg-habesha-dark border-habesha-border text-habesha-cream placeholder:text-habesha-cream/40 focus:border-habesha-gold focus:ring-habesha-gold"
              />
            </div>
          </div>

          {/* Language Preference */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2 text-habesha-cream">
              <Coffee className="w-4 h-4 text-habesha-gold" />
              Language Preference <span className="text-red-400">*</span>
            </Label>
            <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
              <SelectTrigger className="bg-habesha-dark border-habesha-border text-habesha-cream focus:border-habesha-gold focus:ring-habesha-gold">
                <SelectValue placeholder="Select your language" />
              </SelectTrigger>
              <SelectContent className="bg-habesha-dark border-habesha-border text-habesha-cream">
                <SelectItem value="english">🇬🇧 English</SelectItem>
                <SelectItem value="tigrinya">🇪🇷 ትግርኛ (Tigrinya)</SelectItem>
                <SelectItem value="amharic">🇪🇹 አማርኛ (Amharic)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-habesha-gold to-habesha-hover-gold hover:from-habesha-hover-gold hover:to-habesha-gold text-habesha-bg font-bold py-6 text-lg rounded-xl shadow-gold-lg transition-all"
          >
            {loading ? 'Submitting...' : '✅ Submit Request'}
          </Button>

          <div className="bg-habesha-gold/10 border border-habesha-gold/30 rounded-lg p-3">
            <p className="text-xs text-center text-habesha-cream flex items-center justify-center gap-2">
              <Coffee className="w-4 h-4 text-habesha-gold" />
              Response time: 24-48 hours • We'll contact you via email
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
