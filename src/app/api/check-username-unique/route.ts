import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import UserModel from "@/models/User.models";
import { usernameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {

    await dbConnect()

    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        
        // validation using Zod
        const result = UsernameQuerySchema.safeParse(queryParam)

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json(
                {
                    success: false,
                    message: usernameErrors?.length > 0 ?
                                usernameErrors.join(', ') :
                                "invalid query parameters"
                },
                {
                    status: 400
                }
            )
        }

        const {username} = result.data

        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Username already exists"
                },
                {
                    status: 200
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Username available"
            },
            {
                status: 200
            }
        )
        
        
        
    } catch (error) {
        console.error("Error checking username", error);
        return Response.json(
            {
                success: false,
                message: "Error checking username"
            },
            {
                status: 500
            }
        )
    }
}