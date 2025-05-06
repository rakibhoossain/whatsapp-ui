"use client"

import { useState } from "react"
import { MoreVertical, Reply, Forward, Trash2, Check, CheckCheck, Play, Pause, File } from "lucide-react"
import type { Message, Contact } from "@/lib/types"
import { formatMessageTime } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import ReactionPicker from "./reaction-picker"

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  contact: Contact
  onReact: (reaction: string) => void
  onReply: () => void
  onDelete: () => void
  onForward: () => void
}

export default function MessageBubble({
  message,
  isOwn,
  contact,
  onReact,
  onReply,
  onDelete,
  onForward,
}: MessageBubbleProps) {
  const [showReactionPicker, setShowReactionPicker] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

  const getStatusIcon = () => {
    switch (message.status) {
      case "sending":
        return <span className="text-gray-400">⏱</span>
      case "sent":
        return <Check className="h-3 w-3 text-gray-400" />
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-gray-400" />
      case "read":
        return <CheckCheck className="h-3 w-3 text-[#53bdeb]" />
      case "failed":
        return <span className="text-red-500">!</span>
      default:
        return null
    }
  }

  const handlePlayAudio = () => {
    if (!audioElement && message.attachments && message.attachments[0]) {
      const audio = new Audio(message.attachments[0])
      audio.onended = () => setIsPlaying(false)
      setAudioElement(audio)
      audio.play()
      setIsPlaying(true)
    } else if (audioElement) {
      if (isPlaying) {
        audioElement.pause()
        setIsPlaying(false)
      } else {
        audioElement.play()
        setIsPlaying(true)
      }
    }
  }

  const renderContent = () => {
    // If it's a reply message
    if (message.replyTo) {
      return (
        <div>
          <div className="mb-1 p-1 bg-black/5 rounded border-l-4 border-gray-400 text-xs">
            <div className="font-medium text-[#00a884]">{message.replyTo.senderId === "me" ? "You" : contact.name}</div>
            <div className="truncate">{message.replyTo.content}</div>
          </div>
          <div className="whitespace-pre-wrap break-words">{message.content}</div>
        </div>
      )
    }

    // If it's an audio message
    if (message.type === "audio") {
      return (
        <div className="flex items-center gap-2 py-1">
          <button
            onClick={handlePlayAudio}
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <div className="flex-1">
            <div className="w-full bg-gray-200 h-1 rounded-full">
              <div className="bg-[#00a884] h-1 rounded-full w-0"></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">0:00</div>
          </div>
        </div>
      )
    }

    // If it's a media message with attachments
    if (message.type === "media" && message.attachments && message.attachments.length > 0) {
      return (
        <div>
          <div className={`grid ${message.attachments.length > 1 ? "grid-cols-2" : "grid-cols-1"} gap-1 mb-2`}>
            {message.attachments.map((url, index) => {
              // Check if it's an image or a file
              const isImage = url.match(/\.(jpeg|jpg|gif|png)$/i)

              return isImage ? (
                <img
                  key={index}
                  src={url || "/placeholder.svg"}
                  alt="Attachment"
                  className="rounded object-cover w-full h-32"
                />
              ) : (
                <div key={index} className="flex items-center p-2 bg-white/80 rounded">
                  <File className="h-6 w-6 mr-2 text-[#00a884]" />
                  <div className="text-xs truncate">File attachment</div>
                </div>
              )
            })}
          </div>
          {message.content && <div className="whitespace-pre-wrap break-words">{message.content}</div>}
        </div>
      )
    }

    // Regular text message with URL detection
    if (message.content.startsWith("http")) {
      return (
        <div>
          <a
            href={message.content}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#039be5] underline break-all"
          >
            {message.content}
          </a>
        </div>
      )
    }

    // Regular text message
    return <div className="whitespace-pre-wrap break-words">{message.content}</div>
  }

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} group mb-1`}>
      <div className="relative">
        <div
          className={`px-2 py-[6px] rounded-md ${isOwn ? "bg-[#d9fdd3] text-[#111b21]" : "bg-white text-[#111b21]"}`}
          style={{
            borderTopRightRadius: isOwn ? 0 : undefined,
            borderTopLeftRadius: !isOwn ? 0 : undefined,
          }}
          onDoubleClick={() => setShowReactionPicker(true)}
        >
          {renderContent()}

          <div className="flex justify-end items-center gap-1 mt-[2px]">
            <span className="text-[11px] text-[#667781]">{formatMessageTime(message.timestamp)}</span>
            {isOwn && <span className="ml-[1px]">{getStatusIcon()}</span>}
          </div>

          {/* Message reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="absolute -bottom-2 right-2 bg-white rounded-full px-2 py-0.5 shadow-sm flex">
              {message.reactions.map((reaction, index) => (
                <span key={index} className="text-xs">
                  {reaction.emoji}
                </span>
              ))}
              <span className="text-xs text-gray-500 ml-1">{message.reactions.length}</span>
            </div>
          )}
        </div>

        {/* Message actions */}
        <div
          className={`absolute ${isOwn ? "left-0" : "right-0"}  top-0  transition-opacity opacity-0 group-hover:opacity-100`}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded-full bg-white shadow-sm">
                <MoreVertical size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isOwn ? "start" : "end"}>
              <DropdownMenuItem onClick={() => setShowReactionPicker(true)}>Add reaction</DropdownMenuItem>
              <DropdownMenuItem onClick={onReply}>
                <Reply className="mr-2 h-4 w-4" />
                Reply
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onForward}>
                <Forward className="mr-2 h-4 w-4" />
                Forward
              </DropdownMenuItem>
              {isOwn && (
                <DropdownMenuItem onClick={onDelete} className="text-red-500">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Reaction picker */}
        {showReactionPicker && (
          <div className={`absolute ${isOwn ? "right-0" : "left-0"} -top-10 bg-white rounded-full shadow-md p-1 z-10`}>
            <ReactionPicker
              onSelect={(emoji) => {
                onReact(emoji)
                setShowReactionPicker(false)
              }}
              onClose={() => setShowReactionPicker(false)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
