// Client-side script for embedding the chat widget

;(() => {
  // Configuration defaults
  const defaultConfig = {
    position: {
      bottom: "20px",
      right: "20px",
    },
    size: {
      width: "380px",
      height: "600px",
    },
    companyName: "Chat Support",
    unreadCount: 0,
    persistentWidget: false,
    showButtonWhenOpen: false,
  }

  // Get script tag
  const scriptTag = document.currentScript as HTMLScriptElement

  // Extract configuration from script attributes
  const authToken = scriptTag.getAttribute("data-auth-token") || ""
  const apiEndpoint = scriptTag.getAttribute("data-api-endpoint") || ""
  const wsEndpoint = scriptTag.getAttribute("data-ws-endpoint") || ""
  const companyName = scriptTag.getAttribute("data-company-name")
  const companyLogo = scriptTag.getAttribute("data-company-logo")
  const position = {
    bottom: scriptTag.getAttribute("data-position-bottom"),
    right: scriptTag.getAttribute("data-position-right"),
    left: scriptTag.getAttribute("data-position-left"),
  }
  const size = {
    width: scriptTag.getAttribute("data-width"),
    height: scriptTag.getAttribute("data-height"),
  }
  const persistentWidget = scriptTag.getAttribute("data-persistent") === "true"
  const showButtonWhenOpen = scriptTag.getAttribute("data-show-button-when-open") === "true"

  // Merge with defaults
  const config = {
    authToken,
    apiEndpoint,
    wsEndpoint,
    position: {
      bottom: position.bottom || defaultConfig.position.bottom,
      right: position.right || defaultConfig.position.right,
      left: position.left || defaultConfig.position.left,
    },
    size: {
      width: size.width || defaultConfig.size.width,
      height: size.height || defaultConfig.size.height,
    },
    companyName: companyName || defaultConfig.companyName,
    companyLogo,
    unreadCount: 0,
    persistentWidget: persistentWidget || defaultConfig.persistentWidget,
    showButtonWhenOpen: showButtonWhenOpen || defaultConfig.showButtonWhenOpen,
  }

  // Validate required fields
  if (!config.authToken) {
    console.error("Chat widget: Missing required data-auth-token attribute")
    return
  }

  if (!config.apiEndpoint) {
    console.error("Chat widget: Missing required data-api-endpoint attribute")
    return
  }

  if (!config.wsEndpoint) {
    console.error("Chat widget: Missing required data-ws-endpoint attribute")
    return
  }

  // Load the widget
  loadWidget(config)

  // Function to load the widget
  function loadWidget(config: any) {
    // Create container for the widget
    const container = document.createElement("div")
    container.id = "whatsapp-chat-widget-container"
    document.body.appendChild(container)

    // Load styles
    const styles = document.createElement("link")
    styles.rel = "stylesheet"
    styles.href = `${getBaseUrl()}/widget-styles.css`
    document.head.appendChild(styles)

    // Load the widget script
    const script = document.createElement("script")
    script.src = `${getBaseUrl()}/widget-bundle.js`
    script.onload = () => {
      // Initialize the widget when script is loaded
      if (typeof window.initChatWidget === "function") {
        window.initChatWidget(container, config)
      } else {
        console.error("Chat widget: Failed to initialize widget")
      }
    }
    document.body.appendChild(script)
  }

  // Helper to get base URL from the current script
  function getBaseUrl() {
    const scriptSrc = scriptTag.src
    const urlParts = scriptSrc.split("/")
    urlParts.pop() // Remove the script filename
    return urlParts.join("/")
  }

  // Add to window for external access
  window.updateChatWidget = (newConfig: any) => {
    const container = document.getElementById("whatsapp-chat-widget-container")
    if (container && typeof window.initChatWidget === "function") {
      window.initChatWidget(container, { ...config, ...newConfig })
    }
  }

  // Add global type definition
  declare global {
    interface Window {
      initChatWidget: (container: HTMLElement, config: any) => void
      updateChatWidget: (config: any) => void
    }
  }
})()
