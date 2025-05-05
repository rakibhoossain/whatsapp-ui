"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Message } from "@/lib/types"

interface WebSocketContextType {
  isConnected: boolean
  sendMessage: (message: Message) => void
}

const WebSocketContext = createContext<WebSocketContextType>({
  isConnected: false,
  sendMessage: () => {},
})

export const useWebSocket = () => useContext(WebSocketContext)

interface WebSocketProviderProps {
  children: ReactNode
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // In a real app, you would use a proper WebSocket URL
    // For local development, you might use something like:
    // const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/websocket`;

    // For demo purposes, we're not actually connecting
    // webSocketClient.connect(wsUrl);

    // Simulate connection
    const timeout = setTimeout(() => {
      setIsConnected(true)
    }, 1000)

    return () => {
      clearTimeout(timeout)
      // webSocketClient.disconnect();
    }
  }, [])

  const sendMessage = (message: Message) => {
    // In a real app, you would send the message through the WebSocket
    // webSocketClient.send({ type: 'message', data: message });
    console.log("Sending message:", message)
  }

  return <WebSocketContext.Provider value={{ isConnected, sendMessage }}>{children}</WebSocketContext.Provider>
}
