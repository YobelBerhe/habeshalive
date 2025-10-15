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
      <DialogContent className="bg-background text-foreground border-border max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="hover:bg-muted p-1 rounded transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <DialogTitle className="text-xl font-bold">Manage account</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-2 py-4">
          <button className="w-full bg-muted border border-border rounded-lg p-4 flex items-center justify-between hover:bg-muted/70 transition-colors">
            <span>Delete Account</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <button className="w-full bg-muted border border-border rounded-lg p-4 flex items-center justify-between hover:bg-muted/70 transition-colors">
            <span>My Azar Data Request</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
