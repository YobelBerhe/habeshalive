import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { HashtagSelector } from "./HashtagSelector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileDialog({ open, onOpenChange }: EditProfileDialogProps) {
  const [aboutMe, setAboutMe] = useState("");
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [language, setLanguage] = useState("english");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (open) {
      loadProfile();
    }
  }, [open]);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setUsername(data.username || '');
        setAvatarUrl(data.avatar_url || '');
        setAboutMe(data.bio || '');
        setSelectedHashtags(data.interests || []);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      toast.success("✅ Photo uploaded successfully!");
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      toast.error(error.message || "Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          bio: aboutMe,
          interests: selectedHashtags,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success("Profile updated successfully!");
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black text-white border-gray-800 max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          {/* Profile Picture */}
          <div className="flex justify-center">
            <div className="relative group">
              <Avatar className="w-28 h-28 border-4 border-[#00D9B4]/30 group-hover:border-[#00D9B4] transition-colors">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="bg-gradient-to-br from-[#00D9B4] to-[#00a085] text-black text-3xl font-bold">
                  {username[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <label htmlFor="photo-upload" className="absolute bottom-0 right-0 w-10 h-10 bg-[#00D9B4] hover:bg-[#00c9a4] rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer">
                <Camera className="w-5 h-5 text-black" />
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
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

          {/* Hashtags - ALL 10 CATEGORIES */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Hashtags
              <span className="text-gray-400 ml-2">(Select up to 10)</span>
            </label>
            <HashtagSelector
              selectedTags={selectedHashtags}
              onTagsChange={setSelectedHashtags}
              maxTags={10}
            />
            <p className="text-xs text-gray-500 mt-2">
              💡 Choose hashtags that represent you! This helps match with like-minded people.
            </p>
          </div>

          {/* Username Display */}
          <div>
            <label className="text-sm font-medium mb-2 block">My Info</label>
            <div className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">👤</span>
                <span>{username}</span>
              </div>
            </div>
          </div>

          {/* Language Selector */}
          <div>
            <label className="text-sm font-medium mb-2 block">Language Preference</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full bg-[#2a2a2a] border-gray-700 text-white">
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="bg-[#2a2a2a] border-gray-700 text-white">
                <SelectItem value="english">🇬🇧 English (Default)</SelectItem>
                <SelectItem value="tigrinya">🇪🇷 ትግርኛ (Tigrinya)</SelectItem>
                <SelectItem value="amharic">🇪🇹 አማርኛ (Amharic)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-2">
              Select your preferred language for the interface
            </p>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-[#00D9B4] hover:bg-[#00c9a4] text-black font-medium py-6 text-lg rounded-xl"
          >
            {loading ? 'Saving...' : 'Complete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
