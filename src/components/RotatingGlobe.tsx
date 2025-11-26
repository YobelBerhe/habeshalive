import { Globe } from "lucide-react";

export function RotatingGlobe() {
  return (
    <div className="relative w-32 h-32 mx-auto">
      {/* Horizontal ellipse shape */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse" style={{ transform: 'scaleX(1.4) scaleY(0.7)' }} />
      <div className="absolute inset-2 rounded-full border-2 border-blue-400/30 animate-spin" style={{ animationDuration: '3s', transform: 'scaleX(1.4) scaleY(0.7)' }} />
      <div className="absolute inset-4 rounded-full border-2 border-purple-400/30 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse', transform: 'scaleX(1.4) scaleY(0.7)' }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-[80px] animate-pulse" style={{ transform: 'scaleX(1.4) scaleY(0.7)' }}>🌍</div>
      </div>
    </div>
  );
}
