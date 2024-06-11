"use client"

import { messageSchema } from "@/schemas/messageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const page = ({ params }: { params: { username: string } }) => {
  const username = params.username

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      })

      if (!response.data.success) {
        toast.message("Error sending message", {
          description: response.data.message,
        })
        return
      }
      reset()
      toast.success("Message sent successfully")
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.message("Error sending message", {
        description:
          axiosError.response?.data.message || "An unknown error occured.",
      })
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="p-7">
        <div className="flex flex-col gap-4">
          <label htmlFor="content" className="text-lg font-semibold ">
            Enter your message
          </label>
          <input
            type="text"
            {...register("content")}
            className="bg-transparent border border-slate-800 p-2 rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="p-4 bg-slate-200 text-black font-semibold text-sm rounded-xl mt-7"
        >
          Send
        </button>
      </form>
    </>
  )
}

export default page
