"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface EmojiPickerProps {
  onSelect: (emoji: string) => void
}

// Common emoji categories
const EMOJI_CATEGORIES = {
  recent: ["👍", "❤️", "😊", "😂", "🙏", "👏", "🔥", "🎉"],
  smileys: ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "😍", "🥰", "😘"],
  people: ["👋", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "👍", "👎", "✊", "👊", "🤛"],
  nature: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵"],
  food: ["🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥"],
  activities: ["⚽️", "🏀", "🏈", "⚾️", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🏓", "🏸", "🏒", "🏑", "🥍"],
  travel: ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎", "🚓", "🚑", "🚒", "🚐", "🚚", "🚛", "🚜", "🛴", "🚲"],
  symbols: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘"],
}

export default function EmojiPicker({ onSelect }: EmojiPickerProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredEmojis = searchQuery
    ? Object.values(EMOJI_CATEGORIES)
        .flat()
        .filter(
          (emoji) => emoji.includes(searchQuery) || getEmojiDescription(emoji).includes(searchQuery.toLowerCase()),
        )
    : []

  // Helper function to get emoji description (simplified)
  function getEmojiDescription(emoji: string): string {
    const descriptions: Record<string, string> = {
      "👍": "thumbs up",
      "❤️": "heart",
      "😊": "smile",
      "😂": "laugh",
      "🙏": "pray",
      "👏": "clap",
      "🔥": "fire",
      "🎉": "celebration",
      // In a real app, this would be a comprehensive mapping
    }
    return descriptions[emoji] || ""
  }

  return (
    <div className="p-2 h-full flex flex-col bg-[#f0f2f5]">
      <div className="relative mb-2">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#54656f]" size={16} />
        <Input
          placeholder="Search emoji"
          className="pl-8 bg-white border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {searchQuery ? (
        <div className="grid grid-cols-8 gap-1 overflow-y-auto bg-white rounded-md p-2">
          {filteredEmojis.map((emoji, index) => (
            <button key={index} className="p-2 text-xl hover:bg-[#f0f2f5] rounded" onClick={() => onSelect(emoji)}>
              {emoji}
            </button>
          ))}
        </div>
      ) : (
        <Tabs defaultValue="recent" className="flex-1">
          <TabsList className="grid grid-cols-8 h-auto bg-transparent p-0">
            {Object.keys(EMOJI_CATEGORIES).map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="text-xs py-1 data-[state=active]:bg-white data-[state=active]:shadow-none rounded-t-md data-[state=active]:text-[#00a884]"
              >
                {getCategoryIcon(category)}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
            <TabsContent
              key={category}
              value={category}
              className="flex-1 overflow-y-auto mt-0 bg-white rounded-b-md p-2"
            >
              <div className="grid grid-cols-8 gap-1">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    className="p-2 text-xl hover:bg-[#f0f2f5] rounded"
                    onClick={() => onSelect(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}

function getCategoryIcon(category: string): string {
  switch (category) {
    case "recent":
      return "🕒"
    case "smileys":
      return "😊"
    case "people":
      return "👋"
    case "nature":
      return "🐶"
    case "food":
      return "🍔"
    case "activities":
      return "⚽️"
    case "travel":
      return "🚗"
    case "symbols":
      return "❤️"
    default:
      return "🔣"
  }
}
