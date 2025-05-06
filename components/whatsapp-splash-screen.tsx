"use client"

import { MessageCircle } from "lucide-react"

export default function WhatsAppSplashScreen() {

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#008069]">
      <div className="flex flex-col items-center justify-center">
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-white">
          <MessageCircle className="h-14 w-14 text-[#008069]" />
        </div>

        <div className="flex flex-col items-center">
          <div className="mb-8 flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-3 w-3 rounded-full bg-[#25D366] opacity-70"
                style={{
                  animation: `bounce 1.4s infinite ease-in-out both`,
                  animationDelay: `${i * 0.16}s`,
                }}
              />
            ))}
          </div>

          <div className="text-center">
            <h1 className="text-xl font-medium text-white">WhatsApp</h1>
            <p className="mt-2 text-sm text-[#E9FFEF]">Loading...</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0.6);
          }
          40% {
            transform: scale(1.0);
          }
        }
      `}</style>
    </div>
  )
}
