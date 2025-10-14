import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Apple } from "lucide-react";
import { FaFacebook } from "react-icons/fa";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: () => void;
}

export function LoginDialog({ open, onOpenChange, onLogin }: LoginDialogProps) {
  const handleLogin = (method: string) => {
    console.log(`Login with ${method}`);
    // Simulate login and camera permission request
    setTimeout(() => {
      onLogin();
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-black max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Welcome to HabeshaLive</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          <Button
            onClick={() => handleLogin('email')}
            className="w-full bg-white hover:bg-gray-100 text-black border-2 border-gray-300 py-6 text-lg font-medium"
          >
            <Mail className="w-5 h-5 mr-3" />
            Continue with Email
          </Button>
          
          <Button
            onClick={() => handleLogin('facebook')}
            className="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white py-6 text-lg font-medium"
          >
            <FaFacebook className="w-5 h-5 mr-3" />
            Continue with Facebook
          </Button>
          
          <Button
            onClick={() => handleLogin('phone')}
            className="w-full bg-white hover:bg-gray-100 text-black border-2 border-gray-300 py-6 text-lg font-medium"
          >
            <Phone className="w-5 h-5 mr-3" />
            Continue with Phone
          </Button>
          
          <Button
            onClick={() => handleLogin('apple')}
            className="w-full bg-black hover:bg-gray-900 text-white py-6 text-lg font-medium"
          >
            <Apple className="w-5 h-5 mr-3" />
            Continue with Apple
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 text-center mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </DialogContent>
    </Dialog>
  );
}
