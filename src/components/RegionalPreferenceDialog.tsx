import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface RegionalPreferenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const countries = [
  { name: "Algeria", flag: "🇩🇿" },
  { name: "Argentina", flag: "🇦🇷" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "Austria", flag: "🇦🇹" },
  { name: "Bahrain", flag: "🇧🇭" },
  { name: "Belgium", flag: "🇧🇪" },
  { name: "Brazil", flag: "🇧🇷" },
  { name: "Canada", flag: "🇨🇦" },
  { name: "Chile", flag: "🇨🇱" },
  { name: "China", flag: "🇨🇳" },
  { name: "Colombia", flag: "🇨🇴" },
  { name: "Denmark", flag: "🇩🇰" },
  { name: "Egypt", flag: "🇪🇬" },
  { name: "Eritrea", flag: "🇪🇷" },
  { name: "Ethiopia", flag: "🇪🇹" },
  { name: "Finland", flag: "🇫🇮" },
  { name: "France", flag: "🇫🇷" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "Greece", flag: "🇬🇷" },
  { name: "India", flag: "🇮🇳" },
  { name: "Indonesia", flag: "🇮🇩" },
  { name: "Iran", flag: "🇮🇷" },
  { name: "Iraq", flag: "🇮🇶" },
  { name: "Ireland", flag: "🇮🇪" },
  { name: "Israel", flag: "🇮🇱" },
  { name: "Italy", flag: "🇮🇹" },
  { name: "Japan", flag: "🇯🇵" },
  { name: "Jordan", flag: "🇯🇴" },
  { name: "Kenya", flag: "🇰🇪" },
  { name: "Kuwait", flag: "🇰🇼" },
  { name: "Lebanon", flag: "🇱🇧" },
  { name: "Libya", flag: "🇱🇾" },
  { name: "Malaysia", flag: "🇲🇾" },
  { name: "Mexico", flag: "🇲🇽" },
  { name: "Morocco", flag: "🇲🇦" },
  { name: "Netherlands", flag: "🇳🇱" },
  { name: "New Zealand", flag: "🇳🇿" },
  { name: "Nigeria", flag: "🇳🇬" },
  { name: "Norway", flag: "🇳🇴" },
  { name: "Oman", flag: "🇴🇲" },
  { name: "Pakistan", flag: "🇵🇰" },
  { name: "Palestine", flag: "🇵🇸" },
  { name: "Philippines", flag: "🇵🇭" },
  { name: "Poland", flag: "🇵🇱" },
  { name: "Portugal", flag: "🇵🇹" },
  { name: "Qatar", flag: "🇶🇦" },
  { name: "Russia", flag: "🇷🇺" },
  { name: "Saudi Arabia", flag: "🇸🇦" },
  { name: "Singapore", flag: "🇸🇬" },
  { name: "Somalia", flag: "🇸🇴" },
  { name: "South Africa", flag: "🇿🇦" },
  { name: "South Korea", flag: "🇰🇷" },
  { name: "Spain", flag: "🇪🇸" },
  { name: "Sudan", flag: "🇸🇩" },
  { name: "Sweden", flag: "🇸🇪" },
  { name: "Switzerland", flag: "🇨🇭" },
  { name: "Syria", flag: "🇸🇾" },
  { name: "Thailand", flag: "🇹🇭" },
  { name: "Tunisia", flag: "🇹🇳" },
  { name: "Turkey", flag: "🇹🇷" },
  { name: "UAE", flag: "🇦🇪" },
  { name: "Uganda", flag: "🇺🇬" },
  { name: "UK", flag: "🇬🇧" },
  { name: "Ukraine", flag: "🇺🇦" },
  { name: "USA", flag: "🇺🇸" },
  { name: "Venezuela", flag: "🇻🇪" },
  { name: "Vietnam", flag: "🇻🇳" },
  { name: "Yemen", flag: "🇾🇪" },
];

export function RegionalPreferenceDialog({
  open,
  onOpenChange,
}: RegionalPreferenceDialogProps) {
  const [selectedPreference, setSelectedPreference] = useState<
    "balanced" | "global" | "country"
  >("balanced");
  const [sameCountryEnabled, setSameCountryEnabled] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const userCountry = "USA"; // This would be detected from user's location

  const handleSave = () => {
    // Check if paid features are selected
    if (selectedPreference === "country" && sameCountryEnabled) {
      toast.info("💎 Use tokens to enable same-country matching");
      return;
    }
    if (selectedCountry) {
      toast.info(`💎 Use tokens to match with ${selectedCountry}`);
      return;
    }
    
    // Balanced and Global are free, just save
    toast.success("Preference saved!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1a1a] border-gray-800 text-white max-w-lg max-h-[85vh] p-0">
        <ScrollArea className="max-h-[85vh]">
          <div className="p-6 space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Regional Preference
              </DialogTitle>
            </DialogHeader>

            {/* Regional Options */}
            <div className="space-y-3">
              {/* Balanced */}
              <button
                onClick={() => setSelectedPreference("balanced")}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                  selectedPreference === "balanced"
                    ? "bg-primary/20 border-2 border-primary"
                    : "bg-gray-800/50 border-2 border-transparent hover:bg-gray-800"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedPreference === "balanced"
                      ? "border-primary"
                      : "border-gray-600"
                  }`}
                >
                  {selectedPreference === "balanced" && (
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  )}
                </div>
                <span className="text-lg font-medium">Balanced</span>
              </button>

              {/* Global */}
              <button
                onClick={() => setSelectedPreference("global")}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                  selectedPreference === "global"
                    ? "bg-primary/20 border-2 border-primary"
                    : "bg-gray-800/50 border-2 border-transparent hover:bg-gray-800"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedPreference === "global"
                      ? "border-primary"
                      : "border-gray-600"
                  }`}
                >
                  {selectedPreference === "global" && (
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  )}
                </div>
                <span className="text-lg font-medium">Global</span>
              </button>

              {/* Same Country */}
              <button
                onClick={() => setSelectedPreference("country")}
                className={`w-full flex items-start gap-4 p-4 rounded-2xl transition-all ${
                  selectedPreference === "country"
                    ? "bg-primary/20 border-2 border-primary"
                    : "bg-gray-800/50 border-2 border-transparent hover:bg-gray-800"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    selectedPreference === "country"
                      ? "border-primary"
                      : "border-gray-600"
                  }`}
                >
                  {selectedPreference === "country" && (
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-lg font-medium">
                      {userCountry} & more
                    </span>
                    <Switch
                      checked={sameCountryEnabled}
                      onCheckedChange={(checked) => {
                        setSameCountryEnabled(checked);
                        if (checked) {
                          setSelectedPreference("country");
                        }
                      }}
                      className="data-[state=checked]:bg-white"
                    />
                  </div>
                  <p className="text-sm text-gray-400">
                    You're more likely to meet people from your country.
                  </p>
                </div>
              </button>
            </div>

            {/* Country Selection */}
            <div>
              <h3 className="text-xl font-bold mb-4">
                Select a country to match with
              </h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {countries.map((country) => (
                  <button
                    key={country.name}
                    onClick={() => setSelectedCountry(country.name)}
                    className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
                      selectedCountry === country.name
                        ? "bg-primary/20 border-2 border-primary"
                        : "bg-gray-800/30 border-2 border-transparent hover:bg-gray-800/50"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selectedCountry === country.name
                          ? "border-primary"
                          : "border-gray-600"
                      }`}
                    >
                      {selectedCountry === country.name && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="text-lg">{country.flag}</span>
                    <span className="text-base font-medium">{country.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button
                onClick={handleSave}
                className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-6 text-lg rounded-full"
              >
                Start Video Chat
              </Button>
              <Button
                onClick={() => onOpenChange(false)}
                variant="ghost"
                className="w-full text-white hover:bg-gray-800 py-6 text-lg rounded-full"
              >
                Save
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
