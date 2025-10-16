import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, MapPin, Hash, Sparkles, Settings as SettingsIcon, MessageSquare, LogOut } from "lucide-react";

interface ProfileViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditProfile: () => void;
  onOpenSettings: () => void;
  onOpenContactUs: () => void;
}

export function ProfileViewDialog({ 
  open, 
  onOpenChange, 
  onEditProfile, 
  onOpenSettings,
  onOpenContactUs 
}: ProfileViewDialogProps) {
  // Mock data - in real app, this would come from user profile
  const userProfile = {
    name: "gift",
    country: "United States",
    countryCode: "US",
    gender: "Male",
    ipAddress: "192.168.1.1", // This would be fetched from backend
    code: "5zcjzb3blgjie",
    hashtags: ["hi", "EthiopianDiaspora", "USAHabesha"],
  };

  const getCountryFlag = (code: string) => {
    const codePoints = code
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/95 backdrop-blur-xl border-gray-800 max-w-md text-white p-0 gap-0">
        {/* User Info Section */}
        <div className="p-6 pb-4 border-b border-white/10">
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16 border-2 border-[#00D9B4]">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gradient-to-br from-[#00D9B4] to-[#00a085] text-black text-xl font-bold">
                {userProfile.name[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">{userProfile.name}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <span className="text-2xl">{getCountryFlag(userProfile.countryCode)}</span>
                <span>{userProfile.gender}</span>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded px-2 py-1 inline-block">
                <span className="text-xs text-gray-400">Code:</span>
                <code className="text-xs text-[#00D9B4] ml-2 font-mono">{userProfile.code}</code>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-2">
          <button
            onClick={() => {
              onOpenChange(false);
              onEditProfile();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 rounded-lg transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#00D9B4]/20 transition-colors">
              <User className="w-5 h-5 text-white group-hover:text-[#00D9B4]" />
            </div>
            <span className="flex-1 font-medium">Edit Profile</span>
          </button>

          <button
            onClick={() => {
              onOpenChange(false);
              onOpenSettings();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 rounded-lg transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#00D9B4]/20 transition-colors">
              <SettingsIcon className="w-5 h-5 text-white group-hover:text-[#00D9B4]" />
            </div>
            <span className="flex-1 font-medium">More</span>
          </button>

          <button
            onClick={() => {
              onOpenChange(false);
              onOpenContactUs();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 rounded-lg transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#00D9B4]/20 transition-colors">
              <MessageSquare className="w-5 h-5 text-white group-hover:text-[#00D9B4]" />
            </div>
            <span className="flex-1 font-medium">Contact us</span>
          </button>

          <div className="my-2 border-t border-white/10" />

          <button
            onClick={() => {
              // Handle logout
              onOpenChange(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 rounded-lg transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
              <LogOut className="w-5 h-5 text-white group-hover:text-red-400" />
            </div>
            <span className="flex-1 font-medium text-red-400">Log out</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
