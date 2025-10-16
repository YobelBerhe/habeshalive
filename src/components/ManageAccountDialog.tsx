import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronRight, ChevronLeft, AlertTriangle, FileText } from "lucide-react";

interface ManageAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
}

export function ManageAccountDialog({ open, onOpenChange, onBack }: ManageAccountDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] text-white border-gray-800 max-w-md">
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
              <p className="text-sm text-gray-400">Account settings & data</p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          <button className="w-full bg-[#2a2a2a] border border-red-500/30 rounded-lg p-4 flex items-center justify-between hover:bg-red-500/10 transition-colors group">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 group-hover:text-red-300" />
              <span className="text-red-400 group-hover:text-red-300 font-medium">Delete Account</span>
            </div>
            <ChevronRight className="w-5 h-5 text-red-400 group-hover:text-red-300" />
          </button>
          
          <button className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-[#333] transition-colors">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <span className="font-medium">My Azar Data Request</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
