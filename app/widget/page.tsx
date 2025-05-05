"use client"

import { useState } from "react"
import ChatWidget from "@/widget/chat-widget"

export default function WidgetDemo() {
  const [config] = useState({
    authToken: "demo_token_123",
    apiEndpoint: "/api",
    wsEndpoint: "wss://echo.websocket.org",
    position: {
      bottom: "20px",
      right: "20px",
    },
    size: {
      width: "380px",
      height: "600px",
    },
    companyName: "Demo Company",
    companyLogo: "/placeholder.svg?height=40&width=40",
    unreadCount: 3,
    persistentWidget: false,
    showButtonWhenOpen: true,
  })

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">WhatsApp Chat Widget Demo</h1>
      <p className="mb-6">This page demonstrates how the chat widget appears when embedded on a website.</p>

      <div className="p-4 bg-gray-100 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Installation</h2>
        <p className="mb-4">To add this chat widget to your website, add the following script tag:</p>

        <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
          {`<script 
  src="https://your-domain.com/widget/embed.js" 
  data-auth-token="YOUR_AUTH_TOKEN"
  data-api-endpoint="https://your-api.com/api"
  data-ws-endpoint="wss://your-websocket.com"
  data-company-name="Your Company"
  data-company-logo="https://your-domain.com/logo.png"
  data-position-bottom="20px"
  data-position-right="20px"
  data-width="380px"
  data-height="600px"
></script>`}
        </pre>
      </div>

      <div className="p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Configuration Options</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>data-auth-token</strong>: Your authentication token (required)
          </li>
          <li>
            <strong>data-api-endpoint</strong>: Your API endpoint URL (required)
          </li>
          <li>
            <strong>data-ws-endpoint</strong>: Your WebSocket endpoint URL (required)
          </li>
          <li>
            <strong>data-company-name</strong>: Your company name
          </li>
          <li>
            <strong>data-company-logo</strong>: URL to your company logo
          </li>
          <li>
            <strong>data-position-bottom</strong>: Distance from bottom of screen
          </li>
          <li>
            <strong>data-position-right</strong>: Distance from right of screen
          </li>
          <li>
            <strong>data-position-left</strong>: Distance from left of screen (use instead of right)
          </li>
          <li>
            <strong>data-width</strong>: Width of the widget
          </li>
          <li>
            <strong>data-height</strong>: Height of the widget
          </li>
          <li>
            <strong>data-persistent</strong>: Set to "true" to keep widget open when clicking outside
          </li>
          <li>
            <strong>data-show-button-when-open</strong>: Set to "true" to show button when widget is open
          </li>
        </ul>
      </div>

      {/* The widget will appear in the bottom right corner */}
      <ChatWidget config={config} />
    </div>
  )
}
