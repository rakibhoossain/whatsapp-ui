import { NextResponse } from "next/server"

// This endpoint serves the widget styles
export async function GET() {
  // In a real implementation, this would serve the CSS file
  return new NextResponse(
    `
    #whatsapp-chat-widget-container {
      position: fixed;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    
    .chat-widget-root {
      position: relative;
    }
    
    .chat-widget-button {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: #25D366;
      color: white;
      border: none;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    
    .chat-widget-button:hover {
      background-color: #128C7E;
      transform: scale(1.05);
    }
    
    .chat-widget-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background-color: #FF3B30;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .chat-widget-container {
      position: absolute;
      bottom: 70px;
      right: 0;
      width: 350px;
      height: 500px;
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    
    @media (max-width: 480px) {
      .chat-widget-container {
        width: 100vw;
        height: 100vh;
        bottom: 0;
        right: 0;
        border-radius: 0;
      }
    }
  `,
    {
      headers: {
        "Content-Type": "text/css",
      },
    },
  )
}
