import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronRight, ChevronLeft, AlertTriangle, FileText, Coffee } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ManageAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack: () => void;
}

export function ManageAccountDialog({ open, onOpenChange, onBack }: ManageAccountDialogProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Delete user profile
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (error) throw error;

      // Sign out
      await supabase.auth.signOut();
      
      toast.success("Account deleted successfully");
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast.error(error.message || "Failed to delete account");
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleDataRequest = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Create downloadable JSON
      const dataStr = JSON.stringify(profile, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `habeshlive-data-${user.id}.json`;
      link.click();
      
      toast.success("✅ Your data has been downloaded");
    } catch (error: any) {
      console.error('Error requesting data:', error);
      toast.error(error.message || "Failed to download data");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-black text-white border-gray-800 max-w-md">
        
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

          <button 
            onClick={() => setShowDeleteDialog(true)}
            className="w-full bg-[#2a2a2a] border border-red-500/30 rounded-lg p-4 flex items-center justify-between hover:bg-red-500/10 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 group-hover:text-red-300" />
              <div className="text-left">
                <div className="text-red-400 group-hover:text-red-300 font-medium">Delete Account</div>
                <div className="text-xs text-gray-400">Permanently delete your HabeshLive account</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-red-400 group-hover:text-red-300" />
          </button>
          
          <button 
            onClick={handleDataRequest}
            className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-[#333] hover:border-[#00D9B4]/50 transition-colors"
          >
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

    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <AlertDialogContent className="bg-black border-red-500/30 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-400">Delete Account Permanently?</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-[#2a2a2a] border-gray-700 text-white hover:bg-[#333]">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {deleting ? 'Deleting...' : 'Delete Account'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
  );
}
