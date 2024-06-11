import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import { ApiResponse } from "@/types/ApiResponse"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/User.models"

export async function GET(request: Request) {
  await dbConnect()

  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    const response: ApiResponse = {
      success: false,
      message: "User not authenticated",
    }
    return Response.json(response, { status: 400 })
  }

  const username = session.user.username

  try {
    const userFromDB = await UserModel.findOne({
      username,
    })

    const messages = userFromDB?.messages

    console.log("User messages (api): ", messages)

    const response: ApiResponse = {
      success: true,
      message: "Messages fetched successfully",
      messages,
    }

    return Response.json(response, { status: 200 })
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: "Error fetching user messages",
    }
    return Response.json(response, { status: 500 })
  }
}
