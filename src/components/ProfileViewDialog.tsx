import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, MapPin, Hash, Sparkles } from "lucide-react";

interface ProfileViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditProfile: () => void;
}

export function ProfileViewDialog({ open, onOpenChange, onEditProfile }: ProfileViewDialogProps) {
  // Mock data - in real app, this would come from user profile
  const userProfile = {
    name: "gift",
    country: "United States",
    countryCode: "US",
    gender: "Male",
    ipAddress: "192.168.1.1", // This would be fetched from backend
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
      <DialogContent className="bg-black/95 backdrop-blur-xl border-gray-800 max-w-md text-white">
        <div className="space-y-6 py-4">
          {/* Profile Avatar & Name */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-[#00D9B4]">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-br from-[#00D9B4] to-[#00a085] text-black text-2xl font-bold">
                  {userProfile.name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 bg-[#00D9B4] rounded-full p-1">
                <Sparkles className="w-4 h-4 text-black" />
              </div>
            </div>

            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold">{userProfile.name}</h2>
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <User className="w-4 h-4" />
                <span>{userProfile.gender}</span>
              </div>
            </div>
          </div>

          {/* Location Info */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{getCountryFlag(userProfile.countryCode)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>Location</span>
                </div>
                <p className="font-medium">{userProfile.country}</p>
              </div>
            </div>

            <div className="border-t border-white/10 pt-3">
              <div className="text-xs text-gray-500 mb-1">IP Address</div>
              <code className="text-xs bg-black/30 px-2 py-1 rounded font-mono text-[#00D9B4]">
                {userProfile.ipAddress}
              </code>
            </div>
          </div>

          {/* Hashtags */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Hash className="w-4 h-4" />
              <span>Profile Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {userProfile.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="bg-[#00D9B4]/20 text-[#00D9B4] px-3 py-1.5 rounded-full text-sm font-medium border border-[#00D9B4]/30"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Edit Profile Button */}
          <Button
            onClick={() => {
              onOpenChange(false);
              onEditProfile();
            }}
            className="w-full bg-[#00D9B4] hover:bg-[#00c9a4] text-black font-medium py-6 text-lg rounded-xl"
          >
            Edit Profile
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
