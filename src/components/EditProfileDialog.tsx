import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, ChevronRight } from "lucide-react";
import { useState } from "react";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileDialog({ open, onOpenChange }: EditProfileDialogProps) {
  const [aboutMe, setAboutMe] = useState("");
  const [hashtag, setHashtag] = useState("hi");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1a1a] text-white border-gray-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Profile Picture */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gray-600" />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Camera className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>
          
          <p className="text-xs text-gray-400 text-center">
            Please do not share inappropriate content or personal information
            <br />
            (such as phone number or address) on your profile. All uploads are
            <br />
            reviewed and moderated.
          </p>

          {/* About Me */}
          <div>
            <label className="text-sm font-medium mb-2 block">About me</label>
            <Textarea
              placeholder="Share a little something about yourself."
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              className="bg-[#2a2a2a] border-gray-700 text-white resize-none h-24"
              maxLength={250}
            />
            <div className="text-right text-sm text-gray-400 mt-1">250</div>
          </div>

          {/* Hashtag */}
          <div>
            <label className="text-sm font-medium mb-2 block">Hashtag</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">#</span>
              <div className="flex-1 bg-[#2a2a2a] border border-gray-700 rounded-md px-3 py-2">
                <span className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
                  {hashtag}
                </span>
              </div>
            </div>
          </div>

          {/* My Info */}
          <div>
            <label className="text-sm font-medium mb-2 block">My Info</label>
            <button className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-[#333]">
              <div className="flex items-center gap-3">
                <span className="text-gray-400">👤</span>
                <span>gift</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Language */}
          <button className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-4 flex items-center gap-3 hover:bg-[#333]">
            <span className="text-gray-400">🌐</span>
            <span>English</span>
          </button>

          {/* Complete Button */}
          <Button className="w-full bg-[#00D9B4] hover:bg-[#00c9a4] text-black font-medium py-6 text-lg rounded-xl">
            Complete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
