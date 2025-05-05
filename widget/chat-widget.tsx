"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Minimize2, Maximize2 } from "lucide-react"
import ChatLayout from "@/components/chat-layout"
import type { WidgetConfig } from "@/lib/types"

interface ChatWidgetProps {
  config: WidgetConfig
}

export default function ChatWidget({ config }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const widgetRef = useRef<HTMLDivElement>(null)

  // Close widget when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        // Don't close if clicking on the widget button
        const target = event.target as HTMLElement
        if (target.closest(".widget-button")) return

        if (isOpen && !config.persistentWidget) {
          setIsOpen(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, config.persistentWidget])

  const toggleWidget = () => {
    if (isOpen && isMinimized) {
      setIsMinimized(false)
    } else {
      setIsOpen(!isOpen)
      setIsMinimized(false)
    }
  }

  const minimizeWidget = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMinimized(!isMinimized)
  }

  const closeWidget = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(false)
  }

  return (
    <>
      {/* Widget Button */}
      {(!isOpen || config.showButtonWhenOpen) && (
        <button
          onClick={toggleWidget}
          className="widget-button fixed z-50 flex items-center justify-center w-16 h-16 rounded-full shadow-lg bg-[#25d366] hover:bg-[#00a884] transition-all duration-200 focus:outline-none"
          style={{
            bottom: config.position.bottom || "20px",
            right: config.position.right || "20px",
            left: config.position.left,
          }}
        >
          <MessageCircle size={28} className="text-white" />
          {config.unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full">
              {config.unreadCount > 9 ? "9+" : config.unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Widget Container */}
      {isOpen && (
        <div
          ref={widgetRef}
          className="fixed z-50 bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 flex flex-col"
          style={{
            bottom: config.position.bottom || "20px",
            right: config.position.right || "20px",
            left: config.position.left,
            width: isMinimized ? "300px" : config.size.width || "380px",
            height: isMinimized ? "60px" : config.size.height || "600px",
            maxWidth: "calc(100vw - 40px)",
            maxHeight: "calc(100vh - 40px)",
          }}
        >
          {/* Widget Header */}
          <div
            className="bg-[#008069] text-white p-3 flex items-center justify-between cursor-pointer"
            onClick={isMinimized ? toggleWidget : undefined}
          >
            <div className="flex items-center">
              <img
                src={config.companyLogo || "/placeholder.svg?height=40&width=40"}
                alt={config.companyName}
                className="w-8 h-8 rounded-full mr-2"
              />
              <h3 className="font-medium">{config.companyName || "Chat Support"}</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={minimizeWidget} className="text-white hover:bg-[#017561] p-1 rounded">
                {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
              </button>
              <button onClick={closeWidget} className="text-white hover:bg-[#017561] p-1 rounded">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Widget Content */}
          {!isMinimized && (
            <div className="flex-1 overflow-hidden">
              <ChatLayout
                authToken={config.authToken}
                apiEndpoint={config.apiEndpoint}
                wsEndpoint={config.wsEndpoint}
                isWidget={true}
              />
            </div>
          )}
        </div>
      )}
    </>
  )
}
