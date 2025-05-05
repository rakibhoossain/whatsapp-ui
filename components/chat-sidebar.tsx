"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Edit, Phone, Archive, MoreVertical, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Contact } from "@/lib/types"
import { formatTime } from "@/lib/utils"

interface ChatSidebarProps {
  contacts: Contact[]
  archivedContacts: Contact[]
  activeContact: Contact | null
  onSelectContact: (contact: Contact) => void
  onArchiveContact: (contactId: string) => void
  onUnarchiveContact: (contactId: string) => void
  isWidget?: boolean
}

export default function ChatSidebar({
  contacts,
  archivedContacts,
  activeContact,
  onSelectContact,
  onArchiveContact,
  onUnarchiveContact,
  isWidget = false,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showArchived, setShowArchived] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const [headerHeight, setHeaderHeight] = useState(0)

  // Calculate header height for proper scrolling
  useEffect(() => {
    if (headerRef.current && searchRef.current && !isWidget && tabsRef.current) {
      const height =
        headerRef.current.offsetHeight +
        searchRef.current.offsetHeight +
        (!isWidget && tabsRef.current ? tabsRef.current.offsetHeight : 0)
      setHeaderHeight(height)
    }
  }, [isWidget, showArchived])

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.lastMessage && contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const filteredArchivedContacts = archivedContacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.lastMessage && contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="flex flex-col h-full">
      <div ref={headerRef}>
        {showArchived ? (
          <div className="p-3 bg-[#008069] text-white flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="text-white mr-2 hover:bg-[#017561]"
              onClick={() => setShowArchived(false)}
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-medium">Archived</h1>
          </div>
        ) : (
          <div className="p-3 bg-[#008069] text-white flex justify-between items-center">
            <h1 className="text-xl font-medium">{isWidget ? "Conversations" : "Chats"}</h1>
            {!isWidget && (
              <div className="flex gap-2">
                <button className="p-2 rounded-full hover:bg-[#017561]">
                  <Edit size={20} />
                </button>
                <button className="p-2 rounded-full hover:bg-[#017561]">
                  <Phone size={20} />
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 rounded-full hover:bg-[#017561]">
                      <MoreVertical size={20} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>New group</DropdownMenuItem>
                    <DropdownMenuItem>Starred messages</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setShowArchived(true)}>
                      Archived chats
                      {archivedContacts.length > 0 && (
                        <span className="ml-2 bg-gray-200 text-gray-800 rounded-full px-2 py-0.5 text-xs">
                          {archivedContacts.length}
                        </span>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        )}
      </div>

      <div ref={searchRef} className="p-2 bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#54656f]" size={18} />
          <Input
            placeholder="Search or start new chat"
            className="pl-10 bg-[#f0f2f5] border-none rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {!showArchived && !isWidget && (
        <div ref={tabsRef}>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white p-0 h-auto">
              <TabsTrigger
                value="all"
                className="py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#00a884] data-[state=active]:text-[#00a884]"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="unread"
                className="py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#00a884] data-[state=active]:text-[#00a884]"
              >
                Unread
              </TabsTrigger>
              <TabsTrigger
                value="groups"
                className="py-3 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#00a884] data-[state=active]:text-[#00a884]"
              >
                Groups
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      <div className="flex-1 overflow-y-auto bg-white" style={{ height: `calc(100% - ${headerHeight}px)` }}>
        {showArchived ? (
          filteredArchivedContacts.length > 0 ? (
            filteredArchivedContacts.map((contact) => (
              <ContactItem
                key={contact.id}
                contact={contact}
                isActive={activeContact?.id === contact.id}
                onSelect={() => onSelectContact(contact)}
                onArchive={() => onUnarchiveContact(contact.id)}
                isArchived={true}
              />
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">No archived chats</div>
          )
        ) : filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <ContactItem
              key={contact.id}
              contact={contact}
              isActive={activeContact?.id === contact.id}
              onSelect={() => onSelectContact(contact)}
              onArchive={() => onArchiveContact(contact.id)}
              isArchived={false}
            />
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            {searchQuery ? "No matching contacts" : "No conversations yet"}
          </div>
        )}
      </div>
    </div>
  )
}

interface ContactItemProps {
  contact: Contact
  isActive: boolean
  isArchived: boolean
  onSelect: () => void
  onArchive: () => void
}

function ContactItem({ contact, isActive, isArchived, onSelect, onArchive }: ContactItemProps) {
  const [showActions, setShowActions] = useState(false)

  return (
    <div
      className={`relative flex items-center p-3 cursor-pointer hover:bg-[#f5f6f6] border-t border-[#e9edef] first:border-t-0 ${isActive ? "bg-[#f0f2f5]" : ""}`}
      onClick={onSelect}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Avatar className="h-12 w-12 mr-3">
        <AvatarImage src={contact.avatar || "/placeholder.svg?height=200&width=200"} alt={contact.name} />
        <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 border-b border-[#e9edef] pb-3 -mb-3">
        <div className="flex justify-between items-baseline">
          <h3 className="font-medium truncate text-[#111b21]">{contact.name}</h3>
          {showActions ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-500"
              onClick={(e) => {
                e.stopPropagation()
                onArchive()
              }}
            >
              <Archive size={16} />
            </Button>
          ) : (
            <span className="text-xs text-[#667781]">{formatTime(contact.lastMessageTime)}</span>
          )}
        </div>

        <div className="flex items-center">
          {contact.lastMessageStatus && <MessageStatus status={contact.lastMessageStatus} />}
          <p className="text-sm text-[#667781] truncate">{contact.lastMessage}</p>
          {contact.unreadCount > 0 && (
            <span className="ml-2 bg-[#25d366] text-white rounded-full px-1.5 py-0.5 text-xs min-w-5 text-center">
              {contact.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function MessageStatus({ status }: { status: string }) {
  if (status === "sent") {
    return <span className="text-[#667781] mr-1">✓</span>
  } else if (status === "delivered") {
    return <span className="text-[#667781] mr-1">✓✓</span>
  } else if (status === "read") {
    return <span className="text-  mr-1">✓✓</span>
  } else if (status === "read") {
    return <span className="text-[#53bdeb] mr-1">✓✓</span>
  } else if (status === "sending") {
    return <span className="text-[#667781] mr-1">⏱</span>
  } else if (status === "failed") {
    return <span className="text-red-500 mr-1">!</span>
  }
  return null
}
