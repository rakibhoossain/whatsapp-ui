"use client"

import { useState, useEffect } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import ChatSidebar from "./chat-sidebar"
import ChatMain from "./chat-main"
import type { Contact, Message, ReplyTo } from "@/lib/types"
import { initialContacts, initialMessages } from "@/lib/data"
import { setupWebSocket } from "@/lib/websocket"

interface ChatLayoutProps {
  authToken?: string
  apiEndpoint?: string
  wsEndpoint?: string
  isWidget?: boolean
}

export default function ChatLayout({ authToken, apiEndpoint, wsEndpoint, isWidget = false }: ChatLayoutProps) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [archivedContacts, setArchivedContacts] = useState<Contact[]>([])
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [activeContact, setActiveContact] = useState<Contact | null>(initialContacts[0])
  const [isMobileView, setIsMobileView] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null)

  const isMobile = useMediaQuery("(max-width: 768px)")

  // Initialize WebSocket connection with auth token
  useEffect(() => {
    if (wsEndpoint && authToken) {
      const ws = setupWebSocket(wsEndpoint, authToken, {
        onMessage: handleIncomingMessage,
        onStatusUpdate: handleStatusUpdate,
      })
      setWsConnection(ws)

      return () => {
        ws.close()
      }
    }
  }, [wsEndpoint, authToken])

  useEffect(() => {
    setIsMobileView(isMobile || isWidget)
    setShowSidebar(isMobile || isWidget ? !activeContact : true)
  }, [isMobile, activeContact, isWidget])

  // Handle incoming messages from WebSocket
  const handleIncomingMessage = (message: Message) => {
    setMessages((prev) => [...prev, message])

    // Update contact's last message
    const contactId = message.senderId
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === contactId
          ? {
              ...contact,
              lastMessage: message.content || (message.type === "audio" ? "Voice message" : "Media message"),
              lastMessageTime: message.timestamp,
              unreadCount: activeContact?.id === contactId ? 0 : (contact.unreadCount || 0) + 1,
            }
          : contact,
      ),
    )
  }

  // Handle status updates from WebSocket (read receipts, etc.)
  const handleStatusUpdate = (update: { messageId: string; status: string }) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === update.messageId ? { ...msg, status: update.status as any } : msg)),
    )
  }

  const handleSendMessage = async (content: string, type = "text", replyTo?: ReplyTo, attachments?: string[]) => {
    if (!activeContact || (!content.trim() && !attachments?.length)) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      timestamp: new Date(),
      senderId: "me", // Current user ID
      receiverId: activeContact.id,
      status: "sending",
      type,
      replyTo,
      attachments,
    }

    // Optimistically update UI
    setMessages((prev) => [...prev, newMessage])

    try {
      // Send message to API
      if (apiEndpoint && authToken) {
        const response = await fetch(`${apiEndpoint}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ message: newMessage }),
        })

        if (!response.ok) {
          throw new Error("Failed to send message")
        }
      } else {
        // Simulate API delay for demo
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      // Update message status to sent
      setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "sent" } : msg)))

      // After 1 second, update to delivered
      setTimeout(() => {
        setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg)))
      }, 1000)

      // After 2 seconds, update to read
      setTimeout(() => {
        setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "read" } : msg)))
      }, 2000)

      // Update contact's last message
      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === activeContact.id
            ? {
                ...contact,
                lastMessage: content || (type === "audio" ? "Voice message" : "Media message"),
                lastMessageTime: new Date(),
                lastMessageStatus: "sent",
              }
            : contact,
        ),
      )
    } catch (error) {
      console.error("Failed to send message:", error)
      // Update message status to failed
      setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "failed" } : msg)))
    }
  }

  const handleReactToMessage = (messageId: string, reaction: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const existingReactionIndex = msg.reactions?.findIndex((r) => r.userId === "me")
          let newReactions = msg.reactions || []

          if (existingReactionIndex !== undefined && existingReactionIndex >= 0) {
            // Replace existing reaction
            newReactions[existingReactionIndex] = { emoji: reaction, userId: "me" }
          } else {
            // Add new reaction
            newReactions = [...newReactions, { emoji: reaction, userId: "me" }]
          }

          return { ...msg, reactions: newReactions }
        }
        return msg
      }),
    )

    // Send reaction to API
    if (apiEndpoint && authToken) {
      fetch(`${apiEndpoint}/messages/react`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ messageId, reaction }),
      }).catch((error) => {
        console.error("Failed to send reaction:", error)
      })
    }
  }

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isDeleted: true, content: "This message was deleted" } : msg,
      ),
    )

    // Send delete request to API
    if (apiEndpoint && authToken) {
      fetch(`${apiEndpoint}/messages/${messageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).catch((error) => {
        console.error("Failed to delete message:", error)
      })
    }
  }

  const handleForwardMessage = (messageId: string, contactIds: string[]) => {
    const messageToForward = messages.find((msg) => msg.id === messageId)

    if (!messageToForward) return

    // Create new forwarded messages for each selected contact
    contactIds.forEach((contactId) => {
      const forwardedMessage: Message = {
        id: `msg-${Date.now()}-${contactId}`,
        content: messageToForward.content,
        timestamp: new Date(),
        senderId: "me",
        receiverId: contactId,
        status: "sending",
        type: messageToForward.type,
        attachments: messageToForward.attachments,
        isForwarded: true,
      }

      // Add to messages
      setMessages((prev) => [...prev, forwardedMessage])

      // Update contact's last message
      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === contactId
            ? {
                ...contact,
                lastMessage:
                  forwardedMessage.content || (forwardedMessage.type === "audio" ? "Voice message" : "Media message"),
                lastMessageTime: new Date(),
                lastMessageStatus: "sent",
              }
            : contact,
        ),
      )

      // Send to API
      if (apiEndpoint && authToken) {
        fetch(`${apiEndpoint}/messages/forward`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            originalMessageId: messageId,
            contactId,
            message: forwardedMessage,
          }),
        }).catch((error) => {
          console.error("Failed to forward message:", error)
        })
      } else {
        // Simulate API delay for demo
        setTimeout(() => {
          setMessages((prev) => prev.map((msg) => (msg.id === forwardedMessage.id ? { ...msg, status: "sent" } : msg)))
        }, 500)

        setTimeout(() => {
          setMessages((prev) =>
            prev.map((msg) => (msg.id === forwardedMessage.id ? { ...msg, status: "delivered" } : msg)),
          )
        }, 1500)
      }
    })
  }

  const handleBlockContact = (contactId: string) => {
    setContacts((prev) => prev.map((contact) => (contact.id === contactId ? { ...contact, isBlocked: true } : contact)))

    // Send block request to API
    if (apiEndpoint && authToken) {
      fetch(`${apiEndpoint}/contacts/${contactId}/block`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).catch((error) => {
        console.error("Failed to block contact:", error)
      })
    }
  }

  const handleArchiveChat = (contactId: string) => {
    const contactToArchive = contacts.find((c) => c.id === contactId)
    if (contactToArchive) {
      // Remove from active contacts
      setContacts((prev) => prev.filter((c) => c.id !== contactId))

      // Add to archived contacts
      setArchivedContacts((prev) => [...prev, { ...contactToArchive, isArchived: true }])

      // If the archived contact was active, reset active contact
      if (activeContact?.id === contactId) {
        setActiveContact(contacts.find((c) => c.id !== contactId) || null)
      }

      // Send archive request to API
      if (apiEndpoint && authToken) {
        fetch(`${apiEndpoint}/contacts/${contactId}/archive`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }).catch((error) => {
          console.error("Failed to archive chat:", error)
        })
      }
    }
  }

  const handleUnarchiveChat = (contactId: string) => {
    const contactToUnarchive = archivedContacts.find((c) => c.id === contactId)
    if (contactToUnarchive) {
      // Remove from archived contacts
      setArchivedContacts((prev) => prev.filter((c) => c.id !== contactId))

      // Add back to active contacts
      setContacts((prev) => [...prev, { ...contactToUnarchive, isArchived: false }])

      // Send unarchive request to API
      if (apiEndpoint && authToken) {
        fetch(`${apiEndpoint}/contacts/${contactId}/unarchive`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }).catch((error) => {
          console.error("Failed to unarchive chat:", error)
        })
      }
    }
  }

  const handleSelectContact = (contact: Contact) => {
    setActiveContact(contact)
    if (isMobileView) {
      setShowSidebar(false)
    }

    // Mark messages as read
    setMessages((prev) =>
      prev.map((msg) =>
        msg.receiverId === "me" && msg.senderId === contact.id && msg.status !== "read"
          ? { ...msg, status: "read" }
          : msg,
      ),
    )

    // Reset unread count
    setContacts((prev) => prev.map((c) => (c.id === contact.id ? { ...c, unreadCount: 0 } : c)))

    // Send read status to API
    if (apiEndpoint && authToken) {
      fetch(`${apiEndpoint}/contacts/${contact.id}/read`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).catch((error) => {
        console.error("Failed to mark as read:", error)
      })
    }
  }

  const handleBackToList = () => {
    if (isMobileView) {
      setShowSidebar(true)
    }
  }

  return (
    <div className="flex h-full bg-[#f0f2f5]">
      {showSidebar && (
        <div
          className={`${isMobileView ? "w-full" : "w-[380px]"} h-full border-r border-[#d1d7db] bg-white flex-shrink-0 overflow-hidden`}
        >
          <ChatSidebar
            contacts={contacts}
            archivedContacts={archivedContacts}
            activeContact={activeContact}
            onSelectContact={handleSelectContact}
            onArchiveContact={handleArchiveChat}
            onUnarchiveContact={handleUnarchiveChat}
            isWidget={isWidget}
          />
        </div>
      )}

      {(!isMobileView || !showSidebar) && activeContact && (
        <div className="flex-1 h-full overflow-hidden">
          <ChatMain
            contact={activeContact}
            messages={messages.filter(
              (msg) =>
                (msg.senderId === activeContact.id && msg.receiverId === "me") ||
                (msg.senderId === "me" && msg.receiverId === activeContact.id),
            )}
            allContacts={contacts}
            onSendMessage={handleSendMessage}
            onReactToMessage={handleReactToMessage}
            onDeleteMessage={handleDeleteMessage}
            onForwardMessage={handleForwardMessage}
            onBlockContact={handleBlockContact}
            onArchiveChat={handleArchiveChat}
            onBack={handleBackToList}
            isMobileView={isMobileView}
            isWidget={isWidget}
          />
        </div>
      )}
    </div>
  )
}
