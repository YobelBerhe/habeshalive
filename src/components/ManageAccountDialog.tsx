import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronRight, ChevronLeft, AlertTriangle, FileText, Coffee } from "lucide-react";

interface ManageAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
}

export function ManageAccountDialog({ open, onOpenChange, onBack }: ManageAccountDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] text-white border-gray-800 max-w-md">
        {/* Habesha Cultural Header */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#00D9B4] via-yellow-500 to-red-500 opacity-80"></div>
        
        <DialogHeader>
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack} 
              className="hover:bg-white/10 p-2 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <DialogTitle className="text-2xl font-bold">Manage account</DialogTitle>
              <p className="text-sm text-gray-400">መለያኻ ኣመሓድር (Account settings & data)</p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          {/* Delete Account - Warning */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Deleting your account is permanent and cannot be undone</span>
            </div>
          </div>

          <button className="w-full bg-[#2a2a2a] border border-red-500/30 rounded-lg p-4 flex items-center justify-between hover:bg-red-500/10 transition-colors group">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 group-hover:text-red-300" />
              <div className="text-left">
                <div className="text-red-400 group-hover:text-red-300 font-medium">Delete Account</div>
                <div className="text-xs text-gray-400">Permanently delete your HabeshLive account</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-red-400 group-hover:text-red-300" />
          </button>
          
          <button className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-[#333] hover:border-[#00D9B4]/50 transition-colors">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <div className="text-left">
                <div className="font-medium">My HabeshLive Data Request</div>
                <div className="text-xs text-gray-400">Download your personal data</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Info Box */}
          <div className="bg-[#00D9B4]/10 border border-[#00D9B4]/30 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
              <Coffee className="w-5 h-5 text-[#00D9B4] flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-300">
                <p className="font-medium text-white mb-1">Data Privacy & Habesha Values</p>
                <p className="text-xs leading-relaxed">
                  We respect your privacy and handle your data with the utmost care, following our community's values of trust (እምነት) and respect (ክብሪ). You can request or delete your data at any time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
