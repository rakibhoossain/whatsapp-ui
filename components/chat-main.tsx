"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  Send,
  Paperclip,
  Smile,
  ChevronLeft,
  Phone,
  Video,
  MoreVertical,
  Mic,
  X,
  Search,
  Archive,
  Ban,
  Trash2,
  MessageCircle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Contact, Message, ReplyTo } from "@/lib/types"
import { formatMessageTime } from "@/lib/utils"
import MessageBubble from "./message-bubble"
import EmojiPicker from "./emoji-picker"
import FileUploader from "./file-uploader"
import VoiceRecorder from "./voice-recorder"
import ForwardMessageModal from "./forward-message-modal"

interface ChatMainProps {
  contact: Contact
  messages: Message[]
  allContacts: Contact[]
  onSendMessage: (content: string, type?: string, replyTo?: ReplyTo, attachments?: string[]) => void
  onReactToMessage: (messageId: string, reaction: string) => void
  onDeleteMessage: (messageId: string) => void
  onForwardMessage: (messageId: string, contactIds: string[]) => void
  onBlockContact: (contactId: string) => void
  onArchiveChat: (contactId: string) => void
  onBack: () => void
  isMobileView: boolean
  isWidget?: boolean
}

export default function ChatMain({
  contact,
  messages,
  allContacts,
  onSendMessage,
  onReactToMessage,
  onDeleteMessage,
  onForwardMessage,
  onBlockContact,
  onArchiveChat,
  onBack,
  isMobileView,
  isWidget = false,
}: ChatMainProps) {
  const [newMessage, setNewMessage] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showFileUploader, setShowFileUploader] = useState(false)
  const [isRecordingVoice, setIsRecordingVoice] = useState(false)
  const [replyingTo, setReplyingTo] = useState<ReplyTo | null>(null)
  const [searchMode, setSearchMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAttachments, setSelectedAttachments] = useState<string[]>([])
  const [forwardingMessage, setForwardingMessage] = useState<Message | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (replyingTo) {
      inputRef.current?.focus()
    }
  }, [replyingTo])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSend = () => {
    if (newMessage.trim() || selectedAttachments.length > 0) {
      const messageType = selectedAttachments.length > 0 ? "media" : "text"
      onSendMessage(newMessage, messageType, replyingTo || undefined, selectedAttachments)
      setNewMessage("")
      setReplyingTo(null)
      setSelectedAttachments([])
      setShowFileUploader(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prev) => prev + emoji)
    setShowEmojiPicker(false)
  }

  const handleFileSelect = (files: string[]) => {
    setSelectedAttachments(files)
  }

  const handleVoiceMessage = (audioUrl: string) => {
    onSendMessage("", "audio", replyingTo || undefined, [audioUrl])
    setReplyingTo(null)
    setIsRecordingVoice(false)
  }

  const handleReply = (message: Message) => {
    setReplyingTo({
      id: message.id,
      content: message.content,
      senderId: message.senderId,
    })
  }

  const handleForward = (message: Message) => {
    setForwardingMessage(message)
  }

  const handleForwardSubmit = (contactIds: string[]) => {
    if (forwardingMessage) {
      onForwardMessage(forwardingMessage.id, contactIds)
      setForwardingMessage(null)
    }
  }

  const cancelReply = () => {
    setReplyingTo(null)
  }

  const filteredMessages =
    searchMode && searchQuery
      ? messages.filter((msg) => msg.content.toLowerCase().includes(searchQuery.toLowerCase()))
      : messages

  return (
    <div className="flex flex-col h-full bg-[#e5ddd5]">
      <div className="bg-[#008069] text-white p-3 flex items-center shadow-sm">
        {isMobileView && (
          <Button variant="ghost" size="icon" className="text-white mr-2 hover:bg-[#017561]" onClick={onBack}>
            <ChevronLeft size={24} />
          </Button>
        )}

        <Avatar className="h-10 w-10 mr-3 cursor-pointer">
          <AvatarImage src={contact.avatar || "/placeholder.svg?height=200&width=200"} alt={contact.name} />
          <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 cursor-pointer">
          <h2 className="font-medium">{contact.name}</h2>
          <p className="text-xs opacity-90">
            {contact.isOnline ? "Online" : "Last seen " + formatMessageTime(contact.lastSeen)}
          </p>
        </div>

        <div className="flex gap-1">
          {searchMode ? (
            <>
              <Input
                placeholder="Search messages..."
                className="h-8 bg-[#017561] text-white placeholder:text-[#88bdaf] border-[#017561]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-[#017561]"
                onClick={() => setSearchMode(false)}
              >
                <X size={20} />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-[#017561]"
                onClick={() => setSearchMode(true)}
              >
                <Search size={20} />
              </Button>
              {!isWidget && (
                <>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-[#017561]">
                    <Video size={20} />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-[#017561]">
                    <Phone size={20} />
                  </Button>
                </>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-[#017561]">
                    <MoreVertical size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onArchiveChat(contact.jid)}>
                    <Archive className="mr-2 h-4 w-4" />
                    Archive chat
                  </DropdownMenuItem>
                  {!isWidget && (
                    <DropdownMenuItem onClick={() => onBlockContact(contact.jid)}>
                      <Ban className="mr-2 h-4 w-4" />
                      Block contact
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear chat
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>

      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-[#e4ddd6]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Cpath fill='%23e2dad4' d='M300 0C134.3 0 0 134.3 0 300s134.3 300 300 300 300-134.3 300-300S465.7 0 300 0z'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
          backgroundRepeat: "repeat",
        }}
      >
        <div className="flex flex-col space-y-1">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((message, index) => {
              // Group messages by date
              const showDateSeparator =
                index === 0 ||
                new Date(message.timestamp).toDateString() !==
                  new Date(filteredMessages[index - 1].timestamp).toDateString()

              return (
                <div key={message.id}>
                  {showDateSeparator && (
                    <div className="flex justify-center my-4">
                      <div className="bg-[#e1f2fa] text-[#55748a] text-xs font-medium px-3 py-1 rounded-lg shadow-sm">
                        {new Date(message.timestamp).toLocaleDateString(undefined, {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  )}
                  <MessageBubble
                    message={message}
                    isOwn={message.senderId === "me"}
                    onReact={(reaction) => onReactToMessage(message.id, reaction)}
                    onReply={() => handleReply(message)}
                    onDelete={() => onDeleteMessage(message.id)}
                    onForward={() => handleForward(message)}
                    contact={contact}
                  />
                </div>
              )
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 mt-20">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <MessageCircle size={32} className="text-gray-400" />
              </div>
              <p className="text-center">No messages yet</p>
              <p className="text-center text-sm">Start a conversation with {contact.name}</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {replyingTo && (
        <div className="bg-gray-200 p-2 flex items-start">
          <div className="flex-1 pl-2 border-l-4 border-emerald-500">
            <div className="text-xs font-medium text-emerald-700">
              Replying to {replyingTo.senderId === "me" ? "yourself" : contact.name}
            </div>
            <div className="text-sm truncate">{replyingTo.content}</div>
          </div>
          <Button variant="ghost" size="icon" className="text-gray-500" onClick={cancelReply}>
            <X size={18} />
          </Button>
        </div>
      )}

      {selectedAttachments.length > 0 && (
        <div className="bg-gray-200 p-2 flex flex-wrap gap-2">
          {selectedAttachments.map((file, index) => (
            <div key={index} className="relative w-20 h-20 bg-white rounded overflow-hidden">
              <img src={file || "/placeholder.svg"} alt="Attachment" className="w-full h-full object-cover" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-0 right-0 w-5 h-5 rounded-full p-0"
                onClick={() => setSelectedAttachments((prev) => prev.filter((_, i) => i !== index))}
              >
                <X size={12} />
              </Button>
            </div>
          ))}
        </div>
      )}

      {showFileUploader && <FileUploader onFileSelect={handleFileSelect} onClose={() => setShowFileUploader(false)} />}

      {isRecordingVoice ? (
        <VoiceRecorder onComplete={handleVoiceMessage} onCancel={() => setIsRecordingVoice(false)} />
      ) : (
        <div className="p-2 bg-[#f0f2f5] flex items-center gap-1">
          <DropdownMenu open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-[#54656f] rounded-full h-10 w-10">
                <Smile size={24} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 h-96 p-0" align="start">
              <EmojiPicker onSelect={handleEmojiSelect} />
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="text-[#54656f] rounded-full h-10 w-10"
            onClick={() => setShowFileUploader(true)}
          >
            <Paperclip size={24} />
          </Button>

          <div className="flex-1 mx-1">
            <Input
              ref={inputRef}
              placeholder="Type a message"
              className="flex-1 bg-white rounded-lg border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-10 px-4"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>

          {newMessage.trim() || selectedAttachments.length > 0 ? (
            <Button size="icon" className="rounded-full bg-[#00a884] hover:bg-[#017561] h-10 w-10" onClick={handleSend}>
              <Send size={18} />
            </Button>
          ) : (
            <Button
              size="icon"
              className="rounded-full bg-[#00a884] hover:bg-[#017561] h-10 w-10"
              onClick={() => setIsRecordingVoice(true)}
            >
              <Mic size={18} />
            </Button>
          )}
        </div>
      )}

      {/* Forward Message Modal */}
      {forwardingMessage && (
        <ForwardMessageModal
          message={forwardingMessage}
          contacts={allContacts.filter((c) => c.jid !== contact.jid)}
          onClose={() => setForwardingMessage(null)}
          onForward={handleForwardSubmit}
        />
      )}
    </div>
  )
}
