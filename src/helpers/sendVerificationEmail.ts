import { resend } from "@/lib/resend";
import { VerificationEmailTemplate } from "../../emails/VerificationEmailTemplate";
import { ApiResponse } from "@/types/ApiResponse";

export const sendVerificationEmail = async (
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> => {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: "Maou messenger | Verification Code",
            react: VerificationEmailTemplate({ username, otp: verifyCode }),
        });

        return {success: true, message: "Verification Email sent successfully"}
    } catch (emailError) {
        console.error("Error sending Verification Email", emailError)
        return {success: false, message: "Error sending Verification Email"}
    }
}