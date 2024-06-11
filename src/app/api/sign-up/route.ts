import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.models";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";


export const POST = async (request: Request) => {
    await dbConnect()

    try {
        const {username, email, password} = await request.json()

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username already exists"
                },
                {
                    status: 400
                }
            )
        }

        const existingUserByEmail = await UserModel.findOne({
            email
        })

        // Create new OTP
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10)

        // OTP Expiry (1 Hour)
        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours() + 1)


        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "Email already exists"
                    },
                    {
                        status: 400
                    }
                )
            } else {
                existingUserByEmail.username = username
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = expiryDate
                await existingUserByEmail.save()
            }

        } else {
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save()
        }

        // Send Verification Email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode)

        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message
                },
                {
                    status: 500
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "User registered successfully. Please verify your email."
            },
            {
                status: 201
            }
        )

    } catch (error) {
        console.error("Error registering User", error);
        return Response.json(
            {
                success: false,
                message: "Error registering User"
            },
            {
                status: 500
            }
        )
    }

}