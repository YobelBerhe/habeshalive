import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { HABESHLIVE_HASHTAGS } from "@/lib/hashtag-system";

interface HashtagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  maxTags?: number;
}

export function HashtagSelector({ selectedTags, onTagsChange, maxTags = 10 }: HashtagSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string>("diaspora");

  const categories = [
    { key: "diaspora", label: "Diaspora", icon: "🌍" },
    { key: "languages", label: "Languages", icon: "🗣️" },
    { key: "culture", label: "Culture", icon: "☕" },
    { key: "education", label: "Career", icon: "🎓" },
    { key: "interests", label: "Interests", icon: "🎯" },
    { key: "social", label: "Social", icon: "👥" },
    { key: "communities", label: "Community", icon: "🏘️" },
    { key: "personality", label: "Personality", icon: "🎉" },
    { key: "special", label: "Special", icon: "🌟" },
    { key: "purposes", label: "Purpose", icon: "🎯" },
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else if (selectedTags.length < maxTags) {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const currentHashtags = HABESHLIVE_HASHTAGS[activeCategory as keyof typeof HABESHLIVE_HASHTAGS] || [];

  return (
    <div className="space-y-3">
      {/* Selected Tags Display */}
      <div className="flex flex-wrap gap-2 min-h-[44px] p-3 bg-[#2a2a2a] border border-gray-700 rounded-lg">
        {selectedTags.length === 0 ? (
          <span className="text-gray-500 text-sm">Select hashtags to describe yourself</span>
        ) : (
          selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-[#00D9B4] text-black hover:bg-[#00c9a4] pr-1 gap-1"
            >
              #{tag}
              <button
                onClick={() => toggleTag(tag)}
                className="ml-1 hover:bg-black/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))
        )}
      </div>

      {/* Hashtag Picker Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full bg-[#2a2a2a] border-gray-700 hover:bg-[#333] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Hashtags ({selectedTags.length}/{maxTags})
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[380px] bg-[#1a1a1a] border-gray-700 p-0" align="start">
          {/* Category Tabs */}
          <div className="border-b border-gray-700">
            <div className="flex gap-1 p-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {categories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-colors ${
                      activeCategory === cat.key
                        ? "bg-[#00D9B4] text-black font-medium"
                        : "bg-[#2a2a2a] text-gray-400 hover:bg-[#333]"
                    }`}
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
            </div>
          </div>

          {/* Hashtags Grid */}
          <ScrollArea className="h-[350px]">
            <div className="p-3 grid grid-cols-2 gap-2">
              {currentHashtags.map((hashtag: any) => {
                const isSelected = selectedTags.includes(hashtag.tag);
                const isDisabled = !isSelected && selectedTags.length >= maxTags;

                return (
                  <button
                    key={hashtag.tag}
                    onClick={() => !isDisabled && toggleTag(hashtag.tag)}
                    disabled={isDisabled}
                    className={`p-2 rounded-lg text-left text-sm transition-all ${
                      isSelected
                        ? "bg-[#00D9B4] text-black font-medium"
                        : isDisabled
                        ? "bg-[#1a1a1a] text-gray-600 cursor-not-allowed"
                        : "bg-[#2a2a2a] text-white hover:bg-[#333]"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span>{hashtag.emoji}</span>
                      <span className="truncate">#{hashtag.tag}</span>
                    </div>
                    <div className="text-xs opacity-70 truncate mt-1">
                      {hashtag.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>

      <div className="text-xs text-gray-400 text-center">
        Choose up to {maxTags} hashtags that best describe you
      </div>
    </div>
  );
}
