import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronRight } from "lucide-react";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const reportReasons = [
  {
    title: "Inappropriate behavior",
    description: "Partial/full nudity in photo or video",
  },
  {
    title: "Inappropriate messages",
    description: "Swearing, offensive language, threats, ads",
  },
  {
    title: "Underage user",
    description: "This user appears to be too young to use HabeshaLive",
  },
  {
    title: "Inappropriate profile video",
    description: "Content that contains nudity or offensive language",
  },
  {
    title: "Report Illegal Content",
    description: "Report publicly posted illegal content",
  },
];

export function ReportDialog({ open, onOpenChange }: ReportDialogProps) {
  const handleReport = (reason: string) => {
    console.log(`Reported for: ${reason}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1a1a] text-white border-gray-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Reason for reporting</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2 py-4">
          {reportReasons.map((reason, index) => (
            <button
              key={index}
              onClick={() => handleReport(reason.title)}
              className="w-full text-left p-4 rounded-lg bg-[#2a2a2a] hover:bg-[#333] transition-colors flex items-start justify-between group"
            >
              <div className="flex-1">
                <div className="font-medium mb-1">{reason.title}</div>
                <div className="text-sm text-gray-400">{reason.description}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white mt-1" />
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
