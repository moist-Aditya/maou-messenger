import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/models/User.models";

export async function DELETE(request: Request, { params }: { params: {messageId: string} }) {
    
    const messageId = params.messageId
    await dbConnect()
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "User not authenticated"
            },
            {
                status: 404
            }
        )
    }

    const user = session.user
    
    try {
        const updatedResult = await UserModel.updateOne(
            {_id: user._id},
            {$pull: {messages: {_id: messageId}}}
        )

        if (updatedResult.modifiedCount == 0) {
            return Response.json(
                {
                    success: false,
                    message: "Message does not exist"
                },
                {
                    status: 404
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Message deleted"
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.error("Error deleting message", error);
        return Response.json(
            {
                success: false,
                message: "Error deleting message"
            },
            {
                status: 500
            }
        )
    }
}