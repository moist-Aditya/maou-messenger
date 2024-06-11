"use client"

import MessageCard from "@/components/MessageCard"
import { Message } from "@/models/User.models"
import { ApiResponse } from "@/types/ApiResponse"
import axios, { AxiosError } from "axios"
import { useSession } from "next-auth/react"
import React, { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

const Dashboard = () => {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])

  const username = session?.user.username
  const baseUrl = `${window.location.protocol}/${window.location.host}`
  const sendMessageUrl = `${baseUrl}/u/${username}`
  const handleUrlCopy = () => {
    navigator.clipboard.writeText(sendMessageUrl)
    toast.success("Copied to clipboard")
  }

  const handleDelete = async (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId))
  }

  const getMessages = useCallback(async () => {
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages")
      if (!response.data.success) {
        toast.error(response.data.message)
        return
      }
      setMessages(response.data.messages || [])
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.message("Error getting messages..", {
        description:
          axiosError.response?.data.message || "Some unknown error occurred.",
      })
    }
  }, [])

  useEffect(() => {
    getMessages()
  }, [getMessages, session])

  return (
    <div className="p-4 px-4 md:px-7">
      <h1 className="text-5xl font-black">Dashboard</h1>

      {/* Copy link section */}
      <div className="mt-7 flex flex-col gap-2">
        <h3>Share your messenger link with the haters</h3>
        <div className="flex gap-2">
          <input
            disabled
            value={sendMessageUrl}
            className="bg-slate-900 flex-1 p-2 rounded-lg"
          />
          <button
            onClick={handleUrlCopy}
            className="bg-slate-200 px-4 p-2 rounded-lg text-black font-semibold text-sm"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Messages map section */}
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {messages.map((message) => (
          <MessageCard message={message} handleDelete={handleDelete} />
        ))}
      </div>
    </div>
  )
}

export default Dashboard
