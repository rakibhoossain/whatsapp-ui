import { NextResponse } from "next/server"

// This endpoint serves the bundled widget script
export async function GET() {
  // In a real implementation, this would serve the bundled JS file
  // For now, we'll return a placeholder
  return new NextResponse(
    `
    // Widget initialization code
    window.initChatWidget = function(container, config) {
      // This would be the actual bundled React code that renders the widget
      console.log('Initializing chat widget with config:', config);
      
      // For demo purposes, we'll create a simple placeholder
      const widgetHTML = \`
        <div class="chat-widget-root">
          <button class="chat-widget-button">
            <span>Chat</span>
            \${config.unreadCount > 0 ? \`<span class="chat-widget-badge">\${config.unreadCount}</span>\` : ''}
          </button>
        </div>
      \`;
      
      container.innerHTML = widgetHTML;
      
      // Add event listeners
      const button = container.querySelector('.chat-widget-button');
      if (button) {
        button.addEventListener('click', function() {
          console.log('Widget button clicked');
          // This would open the actual widget UI
        });
      }
    };
  `,
    {
      headers: {
        "Content-Type": "application/javascript",
      },
    },
  )
}
