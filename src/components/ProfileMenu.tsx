import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { User, Settings, Mail, LogOut } from "lucide-react";

interface ProfileMenuProps {
  user: any;
  onEditProfile: () => void;
  onMore: () => void;
  onSignOut: () => void;
}

export function ProfileMenu({ user, onEditProfile, onMore, onSignOut }: ProfileMenuProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center hover:opacity-80 transition-opacity">
          <User className="w-5 h-5 text-white" />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 bg-background border-border" 
        align="end"
        sideOffset={8}
      >
        {/* User Info Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-foreground">gift</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>🇺🇸</span>
                <span>•</span>
                <span>♂ Male</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Code: 5cz0j4b3Gja0
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          <button
            onClick={onEditProfile}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors text-foreground"
          >
            <User className="w-5 h-5" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={onMore}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors text-foreground"
          >
            <Settings className="w-5 h-5" />
            <span>More</span>
          </button>

          <button
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors text-foreground"
          >
            <Mail className="w-5 h-5" />
            <span>Contact us</span>
          </button>

          <div className="border-t border-border my-2" />

          <button
            onClick={onSignOut}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors text-foreground"
          >
            <LogOut className="w-5 h-5" />
            <span>Log out</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
