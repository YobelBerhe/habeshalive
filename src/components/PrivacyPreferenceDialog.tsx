import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Shield, Eye, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PrivacyPreferenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
}

export function PrivacyPreferenceDialog({ open, onOpenChange, onBack }: PrivacyPreferenceDialogProps) {
  const [preferences, setPreferences] = useState({
    analytics: true,
    personalization: true,
    thirdParty: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadPreferences();
    }
  }, [open]);

  const loadPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load from localStorage for now (could be stored in profiles table)
      const saved = localStorage.getItem(`privacy_prefs_${user.id}`);
      if (saved) {
        setPreferences(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Save to localStorage (could be stored in profiles table)
      localStorage.setItem(`privacy_prefs_${user.id}`, JSON.stringify(preferences));
      
      toast.success("✅ Privacy preferences updated!");
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving preferences:', error);
      toast.error(error.message || "Failed to save preferences");
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
              <DialogTitle className="text-xl font-bold">Privacy Preference Center</DialogTitle>
              <p className="text-sm text-gray-400">Manage your privacy settings</p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          <div className="bg-habesha-gold/10 border border-habesha-gold/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-habesha-gold flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-300">
                <p className="font-medium text-white mb-1">Your Privacy Matters</p>
                <p className="text-xs leading-relaxed">
                  Control how HabeshLive uses your data. You can change these settings at any time.
                </p>
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-habesha-gold" />
                <Label className="text-base font-medium cursor-pointer">Analytics</Label>
              </div>
              <Switch
                checked={preferences.analytics}
                onCheckedChange={(checked) => 
                  setPreferences({ ...preferences, analytics: checked })
                }
              />
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Help us improve HabeshLive by allowing us to collect anonymous usage data and analytics.
            </p>
          </div>

          {/* Personalization */}
          <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-habesha-gold" />
                <Label className="text-base font-medium cursor-pointer">Personalization</Label>
              </div>
              <Switch
                checked={preferences.personalization}
                onCheckedChange={(checked) => 
                  setPreferences({ ...preferences, personalization: checked })
                }
              />
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Allow us to personalize your experience based on your interests and activity on HabeshLive.
            </p>
          </div>

          {/* Third Party Sharing */}
          <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-habesha-gold" />
                <Label className="text-base font-medium cursor-pointer">Third-Party Sharing</Label>
              </div>
              <Switch
                checked={preferences.thirdParty}
                onCheckedChange={(checked) => 
                  setPreferences({ ...preferences, thirdParty: checked })
                }
              />
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Allow us to share anonymous data with trusted partners to improve our services.
            </p>
          </div>

          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-gradient-to-r from-habesha-gold to-habesha-hover-gold hover:from-habesha-hover-gold hover:to-habesha-gold text-habesha-bg font-medium py-6 text-lg rounded-xl"
          >
            {loading ? 'Saving...' : '✅ Save Preferences'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
