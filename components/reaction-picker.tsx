"use client"

interface ReactionPickerProps {
  onSelect: (emoji: string) => void
  onClose: () => void
}

export default function ReactionPicker({ onSelect, onClose }: ReactionPickerProps) {
  // Common reactions in WhatsApp
  const quickReactions = ["👍", "❤️", "😂", "😮", "😢", "🙏"]

  return (
    <div className="flex bg-white rounded-full p-1 shadow-md">
      {quickReactions.map((emoji, index) => (
        <button
          key={index}
          className="p-1.5 text-lg hover:bg-[#f0f2f5] rounded-full transition-colors"
          onClick={() => onSelect(emoji)}
        >
          {emoji}
        </button>
      ))}
    </div>
  )
}
