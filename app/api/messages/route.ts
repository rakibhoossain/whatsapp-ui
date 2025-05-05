import { NextResponse } from "next/server"
import type { Message } from "@/lib/types"

// This would be replaced with your actual database connection
const messages: Message[] = []

export async function GET() {
  // In a real app, you would fetch messages from your database
  return NextResponse.json({ messages })
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    // In a real app, you would save the message to your database
    messages.push(message)

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return NextResponse.json({
      success: true,
      message: { ...message, status: "sent" },
    })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 })
  }
}
