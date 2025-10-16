import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Shield, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ContactUsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactUsDialog({ open, onOpenChange }: ContactUsDialogProps) {
  const { toast } = useToast();
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

  const handleSubmit = () => {
    if (!formData.category || !formData.email || !formData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Submit logic here
    toast({
      title: "Request Submitted",
      description: "We'll get back to you within 24-48 hours",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] text-white border-gray-800 max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-[#00D9B4]/20 p-2 rounded-lg">
              <MessageSquare className="w-6 h-6 text-[#00D9B4]" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">Help Center</DialogTitle>
              <p className="text-sm text-gray-400">We're here to help you</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#00D9B4]" />
              Issue Category <span className="text-red-400">*</span>
            </Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger className="bg-[#2a2a2a] border-gray-700 text-white">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-[#2a2a2a] border-gray-700 text-white">
                <SelectItem value="account">Account</SelectItem>
                <SelectItem value="payment">Payment & Refund</SelectItem>
                <SelectItem value="technical">Technical Issues</SelectItem>
                <SelectItem value="live">Azar Live</SelectItem>
                <SelectItem value="safety">Safety, Security & Privacy</SelectItem>
                <SelectItem value="legal">Law enforcement inquiries</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#00D9B4]" />
              Email Address <span className="text-red-400">*</span>
            </Label>
            <Input
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-[#2a2a2a] border-gray-700 text-white placeholder:text-gray-500"
            />
            <p className="text-xs text-gray-500">Please make sure your email is valid</p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#00D9B4]" />
              Description <span className="text-red-400">*</span>
            </Label>
            <Textarea
              placeholder="Describe your issue in detail..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-[#2a2a2a] border-gray-700 text-white placeholder:text-gray-500 min-h-[120px] resize-none"
            />
          </div>

          {/* Account ID */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Account ID</Label>
            <Input
              placeholder="Your account ID"
              value={formData.accountId}
              onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
              className="bg-[#2a2a2a] border-gray-700 text-white placeholder:text-gray-500 font-mono text-sm"
            />
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Country</Label>
            <Input
              placeholder="Your country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="bg-[#2a2a2a] border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>

          {/* Device & OS */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Your Device</Label>
              <Input
                placeholder="e.g., iPhone 14"
                value={formData.device}
                onChange={(e) => setFormData({ ...formData, device: e.target.value })}
                className="bg-[#2a2a2a] border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">OS Version</Label>
              <Input
                placeholder="e.g., iOS 17"
                value={formData.osVersion}
                onChange={(e) => setFormData({ ...formData, osVersion: e.target.value })}
                className="bg-[#2a2a2a] border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Language Preference */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Language Preference <span className="text-red-400">*</span></Label>
            <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })}>
              <SelectTrigger className="bg-[#2a2a2a] border-gray-700 text-white">
                <SelectValue placeholder="Select your language" />
              </SelectTrigger>
              <SelectContent className="bg-[#2a2a2a] border-gray-700 text-white">
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="amharic">Amharic (አማርኛ)</SelectItem>
                <SelectItem value="tigrinya">Tigrinya (ትግርኛ)</SelectItem>
                <SelectItem value="arabic">Arabic (العربية)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-[#00D9B4] to-[#00a085] hover:from-[#00c9a4] hover:to-[#009075] text-black font-bold py-6 text-lg rounded-xl shadow-lg shadow-[#00D9B4]/25 transition-all"
          >
            Submit Request
          </Button>

          <p className="text-xs text-center text-gray-500">
            Response time: 24-48 hours • We'll contact you via email
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
