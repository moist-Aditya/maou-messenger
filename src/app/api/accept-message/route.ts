import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.models";


// Toggle isAcceptingMessages status
export async function POST(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "User not authenticated"
            },
            {
                status: 401
            }
        )
    }

    const user = session.user
    const userId = user._id

    const {isAcceptingMessage} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                isAcceptingMessage
            },
            {new: true}
        )

        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Failed to toggle isAcceptingMessages"
                },
                {
                    status: 401
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "isAcceptingMessages toggled successfully"
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.error("Failed to toggle isAcceptingMessages", error);
        return Response.json(
            {
                success: false,
                message: "Failed to toggle isAcceptingMessages"
            },
            {
                status: 500
            }
        )
    }
}


// get currect isAcceptingMessages value
export async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "User not authenticated"
            },
            {
                status: 401
            }
        )
    }

    const user = session.user
    const userId = user._id

    try {
        const userFromDB = await UserModel.findById(userId)
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

        return Response.json(
            {
                success: true,
                isAcceptingMessage: userFromDB.isAcceptingMessage
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.error("Error getting isAcceptingMessages status", error);
        
        return Response.json(
            {
                success: false,
                message: "Error getting isAcceptingMessages status"
            },
            {
                status: 500
            }
        )
    }
}