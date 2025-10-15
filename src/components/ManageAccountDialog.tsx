import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface ManageAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
}

export function ManageAccountDialog({ open, onOpenChange, onBack }: ManageAccountDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1a1a] text-white border-gray-800 max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="hover:bg-gray-800 p-1 rounded">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <DialogTitle className="text-xl font-bold">Manage account</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-2 py-4">
          <button className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-[#333]">
            <span>Delete Account</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          
          <button className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-[#333]">
            <span>My Azar Data Request</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
