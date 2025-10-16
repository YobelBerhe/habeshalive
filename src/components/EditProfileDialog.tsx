import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Camera, ChevronRight, Globe } from "lucide-react";
import { useState } from "react";
import { HashtagSelector } from "./HashtagSelector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileDialog({ open, onOpenChange }: EditProfileDialogProps) {
  const [aboutMe, setAboutMe] = useState("");
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>(["hi"]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] text-white border-gray-800 max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          {/* Profile Picture */}
          <div className="flex justify-center">
            <div className="relative group">
              <Avatar className="w-28 h-28 border-4 border-[#00D9B4]/30 group-hover:border-[#00D9B4] transition-colors">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-br from-[#00D9B4] to-[#00a085] text-black text-3xl font-bold">
                  G
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#00D9B4] hover:bg-[#00c9a4] rounded-full flex items-center justify-center shadow-lg transition-colors">
                <Camera className="w-5 h-5 text-black" />
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
              className="bg-[#2a2a2a] border-gray-700 text-white resize-none h-24 focus:border-[#00D9B4]"
              maxLength={250}
            />
            <div className="text-right text-sm text-gray-400 mt-1">{aboutMe.length}/250</div>
          </div>

          {/* Hashtags */}
          <div>
            <label className="text-sm font-medium mb-2 block">Hashtags</label>
            <HashtagSelector
              selectedTags={selectedHashtags}
              onTagsChange={setSelectedHashtags}
              maxTags={10}
            />
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
