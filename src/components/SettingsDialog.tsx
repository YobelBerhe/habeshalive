import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onManageAccount: () => void;
}

export function SettingsDialog({ open, onOpenChange, onManageAccount }: SettingsDialogProps) {
  const [marketingNotifications, setMarketingNotifications] = useState(true);
  const [hideGender, setHideGender] = useState(false);
  const [showPartnerProfile, setShowPartnerProfile] = useState(true);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1a1a] text-white border-gray-800 max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">More</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Account & Security */}
          <div>
            <h3 className="text-gray-400 text-sm font-medium mb-3">Account & Security</h3>
            <button className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-[#333] mb-2">
              <span>Email</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">giftloopsllc@gmail.com</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </button>
            
            <button
              onClick={onManageAccount}
              className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-[#333]"
            >
              <span>Manage account</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Notification */}
          <div>
            <h3 className="text-gray-400 text-sm font-medium mb-3">Notification</h3>
            <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-4 flex items-center justify-between">
              <span>Marketing Notifications</span>
              <Switch
                checked={marketingNotifications}
                onCheckedChange={setMarketingNotifications}
              />
            </div>
          </div>

          {/* Preferences */}
          <div>
            <h3 className="text-gray-400 text-sm font-medium mb-3">Preferences</h3>
            <div className="space-y-2">
              <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-4 flex items-center justify-between">
                <span>Hide gender from your profile</span>
                <Switch
                  checked={hideGender}
                  onCheckedChange={setHideGender}
                />
              </div>
              
              <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-4 flex items-center justify-between">
                <span>Show my profile on partner services</span>
                <Switch
                  checked={showPartnerProfile}
                  onCheckedChange={setShowPartnerProfile}
                />
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-gray-400 text-sm font-medium mb-3">Services</h3>
            <div className="space-y-2">
              <button className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-[#333]">
                <span>Azar Creator Program</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              
              <button className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-[#333]">
                <span>Privacy Preference Center</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              
              <button className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-[#333]">
                <span>Help</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
