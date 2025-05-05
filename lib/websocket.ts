// WebSocket client implementation with authentication

export function setupWebSocket(
  wsEndpoint: string,
  authToken: string,
  handlers: {
    onMessage: (message: any) => void
    onStatusUpdate: (update: any) => void
  },
) {
  // Add auth token to the WebSocket URL
  const wsUrl = new URL(wsEndpoint)
  wsUrl.searchParams.append("token", authToken)

  const socket = new WebSocket(wsUrl.toString())

  socket.onopen = () => {
    console.log("WebSocket connection established")

    // Send authentication message
    socket.send(
      JSON.stringify({
        type: "auth",
        token: authToken,
      }),
    )
  }

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)

      // Handle different message types
      switch (data.type) {
        case "message":
          handlers.onMessage(data.message)
          break
        case "status_update":
          handlers.onStatusUpdate(data.update)
          break
        case "error":
          console.error("WebSocket error:", data.error)
          break
        default:
          console.log("Unknown message type:", data.type)
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error)
    }
  }

  socket.onerror = (error) => {
    console.error("WebSocket error:", error)
  }

  socket.onclose = (event) => {
    console.log(`WebSocket connection closed: ${event.code} ${event.reason}`)

    // Attempt to reconnect after a delay if not closed intentionally
    if (event.code !== 1000) {
      setTimeout(() => {
        console.log("Attempting to reconnect...")
        setupWebSocket(wsEndpoint, authToken, handlers)
      }, 5000)
    }
  }

  // Add helper methods to the socket
  const enhancedSocket = socket as WebSocket & {
    sendMessage: (message: any) => void
    sendTyping: (isTyping: boolean) => void
  }

  enhancedSocket.sendMessage = (message) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "message",
          message,
        }),
      )
    } else {
      console.error("WebSocket is not connected")
    }
  }

  enhancedSocket.sendTyping = (isTyping) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "typing",
          isTyping,
        }),
      )
    }
  }

  return enhancedSocket
}
