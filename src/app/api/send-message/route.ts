import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.models";
import { Message } from "@/models/User.models";

export async function POST(request: Request) {
    await dbConnect()

    const { username, content } = await request.json()

    try {
        // find user from db
        const userFromDB = await UserModel.findOne({
            username,
            isVerified: true
        })
    
        if (!userFromDB) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            )
        }
    
        // check if user accepting messages
        if (!userFromDB.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: "User not accepting messages currently. Please try again later."
                },
                {
                    status: 403
                }
            )
        }
    
        const message = {
            content,
            createdAt: new Date()
        }
    
        userFromDB.messages.push(message as Message)
        await userFromDB.save()
    
        return Response.json(
            {
                success: true,
                message: "Message sent successfully"
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.error("Error sending message", error);
        return Response.json(
            {
                success: false,
                message: "Error sending message"
            },
            {
                status: 500
            }
        )
    }

}