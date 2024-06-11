import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.models";
import { verifySchema } from "@/schemas/verifySchema";

export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, verifyCode } = await request.json()

        const decodedUsername = decodeURIComponent(username)

        const existingUserByUsername = await UserModel.findOne({
            username: decodedUsername
        })

        if (!existingUserByUsername) {
            return Response.json(
                {
                 success: false,
                 message: "User not found"
                },
                {
                 status: 400
                }
            )
        }

        const isCodeValid = existingUserByUsername.verifyCode === verifyCode
        const isCodeExpired = new Date(existingUserByUsername.verifyCodeExpiry) < new Date()

        if (isCodeValid && !isCodeExpired) {
            existingUserByUsername.isVerified = true
            await existingUserByUsername.save()

            return Response.json(
                {
                 success: true,
                 message: "Account verification successful"
                },
                {
                 status: 200
                }
            )
        } else if (isCodeExpired) {
            return Response.json(
                {
                 success: false,
                 message: "Verification code expired. Please sign-up again to get a new code"
                },
                {
                 status: 400
                }
            )
        } else {
            return Response.json(
                {
                 success: false,
                 message: "Incorrect verification code"
                },
                {
                 status: 400
                }
            )
        }

    } catch (error) {
        console.error("Error verifying user", error);
        return Response.json(
            {
                success: false,
                message: "Error verifying user"
            },
            {
                status: 500
            }
        )
        
    }
}