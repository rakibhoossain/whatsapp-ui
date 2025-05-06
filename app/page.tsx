"use client"

import ChatLayout from "@/components/chat-layout"
import WhatsAppSplashScreen from "@/components/whatsapp-splash-screen"
import { loginAction } from "@/lib/action/auth-action"
import { useEffect, useState } from "react"

export default function Home() {

  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<any>()


  const loadData = async () => {
    setIsLoading(true)
    const loginData = await loginAction({userId: '1', token: 'token'})
    setData(loginData)
    setIsLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])
  

  if(isLoading) {
    return <WhatsAppSplashScreen />
  }
  

  if(data?.code == 'ALREADY_LOGGED_IN') {
    return <ChatLayout />
  }

  console.log(data)

  return <WhatsAppSplashScreen />
}
