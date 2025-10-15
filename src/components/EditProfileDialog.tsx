import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
      <DialogContent className="bg-background text-foreground border-border max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Profile Picture */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-muted-foreground/20" />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                <Camera className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
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
              className="bg-muted border-border text-foreground resize-none h-24"
              maxLength={250}
            />
            <div className="text-right text-sm text-muted-foreground mt-1">250</div>
          </div>

          {/* Hashtag */}
          <div>
            <label className="text-sm font-medium mb-2 block">Hashtag</label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">#</span>
              <div className="flex-1 bg-muted border border-border rounded-md px-3 py-2">
                <span className="bg-muted-foreground/20 text-foreground px-3 py-1 rounded-full text-sm">
                  {hashtag}
                </span>
              </div>
            </div>
          </div>

          {/* My Info */}
          <div>
            <label className="text-sm font-medium mb-2 block">My Info</label>
            <button className="w-full bg-muted border border-border rounded-lg p-4 flex items-center justify-between hover:bg-muted/70 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">👤</span>
                <span>gift</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Language */}
          <button className="w-full bg-muted border border-border rounded-lg p-4 flex items-center gap-3 hover:bg-muted/70 transition-colors">
            <span className="text-muted-foreground">🌐</span>
            <span>English</span>
          </button>

          {/* Complete Button */}
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-6 text-lg rounded-xl">
            Complete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
