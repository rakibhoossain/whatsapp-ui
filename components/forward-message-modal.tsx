"use client"

import { useState } from "react"
import { Search, X, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import type { Contact, Message } from "@/lib/types"

interface ForwardMessageModalProps {
  message: Message
  contacts: Contact[]
  onClose: () => void
  onForward: (contactIds: string[]) => void
}

export default function ForwardMessageModal({ message, contacts, onClose, onForward }: ForwardMessageModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])

  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleToggleContact = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId],
    )
  }

  const handleForward = () => {
    onForward(selectedContacts)
    onClose()
  }

  // Truncate message content for preview
  const previewContent = message.content.length > 50 ? message.content.substring(0, 50) + "..." : message.content

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="p-4 bg-[#008069] text-white flex items-center justify-between rounded-t-lg">
          <h2 className="font-medium">Forward message</h2>
          <Button variant="ghost" size="icon" className="text-white hover:bg-[#017561]" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Message preview */}
        <div className="p-3 bg-[#f0f2f5] border-b border-[#e9edef]">
          <div className="bg-white p-3 rounded-lg text-sm">
            {message.type === "media" ? (
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#f0f2f5] rounded-md flex items-center justify-center mr-2">
                  <img
                    src={message.attachments?.[0] || "/placeholder.svg"}
                    alt="Media"
                    className="w-8 h-8 object-cover rounded"
                  />
                </div>
                <span className="text-[#54656f]">{message.content || "Media message"}</span>
              </div>
            ) : (
              <span>{previewContent}</span>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="p-2 border-b border-[#e9edef]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#54656f]" size={18} />
            <Input
              placeholder="Search contacts"
              className="pl-10 bg-[#f0f2f5] border-none rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Contacts list */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center p-3 hover:bg-[#f5f6f6] cursor-pointer border-b border-[#e9edef] last:border-b-0"
                onClick={() => handleToggleContact(contact.id)}
              >
                <Checkbox
                  checked={selectedContacts.includes(contact.id)}
                  onCheckedChange={() => handleToggleContact(contact.id)}
                  className="mr-3 border-[#54656f] data-[state=checked]:bg-[#00a884] data-[state=checked]:border-[#00a884]"
                />
                <Avatar className="h-12 w-12 mr-3">
                  <AvatarImage src={contact.avatar || "/placeholder.svg?height=200&width=200"} alt={contact.name} />
                  <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-medium text-[#111b21]">{contact.name}</h3>
                  <p className="text-sm text-[#667781] truncate">
                    {contact.isOnline ? "Online" : "Last seen recently"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-[#54656f]">No contacts found</div>
          )}
        </div>

        {/* Action buttons */}
        <div className="p-3 bg-white border-t border-[#e9edef] flex justify-end">
          <Button
            onClick={handleForward}
            disabled={selectedContacts.length === 0}
            className="bg-[#00a884] hover:bg-[#017561] text-white gap-2"
          >
            Forward
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}
