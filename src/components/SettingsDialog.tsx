import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronRight, Settings, Mail, Bell, Shield, Sparkles, HelpCircle, LogOut } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onManageAccount: () => void;
  onContactUs: () => void;
}

export function SettingsDialog({ open, onOpenChange, onManageAccount, onContactUs }: SettingsDialogProps) {
  const [marketingNotifications, setMarketingNotifications] = useState(true);
  const [hideGender, setHideGender] = useState(false);
  const [showPartnerProfile, setShowPartnerProfile] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (open) {
      loadSettings();
    }
  }, [open]);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUserEmail(profile.email || user.email || '');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("👋 Logged out successfully");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to log out");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black text-white border-gray-800 max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-[#00D9B4]/20 p-2 rounded-lg">
              <Settings className="w-6 h-6 text-[#00D9B4]" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">More</DialogTitle>
              <p className="text-sm text-gray-400">Settings & preferences</p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Account & Security */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-[#00D9B4]" />
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Account & Security</h3>
            </div>
            <div className="space-y-2">
              <div className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-4 hover:border-[#00D9B4]/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div className="text-left">
                      <p className="font-medium">Email</p>
                      <p className="text-xs text-gray-400">{userEmail || 'Not set'}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              
              <button 
                onClick={() => {
                  onOpenChange(false);
                  onManageAccount();
                }}
                className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-4 hover:bg-[#333] hover:border-[#00D9B4]/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Manage account</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
            </div>
          </div>

          {/* Notification */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-4 h-4 text-[#00D9B4]" />
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Notification</h3>
            </div>
            <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Marketing Notifications</span>
                <Switch
                  checked={marketingNotifications}
                  onCheckedChange={setMarketingNotifications}
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#00D9B4]" />
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Preferences</h3>
            </div>
            <div className="space-y-2">
              <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Hide gender from your profile</span>
                  <Switch
                    checked={hideGender}
                    onCheckedChange={setHideGender}
                  />
                </div>
              </div>
              
              <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Show my profile on partner services</span>
                  <Switch
                    checked={showPartnerProfile}
                    onCheckedChange={setShowPartnerProfile}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#00D9B4]" />
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Services</h3>
            </div>
            <div className="space-y-2">
              <a 
                href="https://docs.lovable.dev/features/security" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-4 hover:bg-[#333] hover:border-[#00D9B4]/50 transition-colors block"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Privacy Preference Center</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </a>

              <button 
                onClick={() => {
                  onOpenChange(false);
                  onContactUs();
                }}
                className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-4 hover:bg-[#333] hover:border-[#00D9B4]/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Help</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
            </div>
          </div>

          {/* Log Out */}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 py-6"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Log out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
