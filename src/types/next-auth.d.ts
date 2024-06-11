import "next-auth";
import { DefaultSession } from "next-auth";


interface CustomUser {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string
}


declare module "next-auth" {
    interface User extends CustomUser {}

    interface Session {
        user: CustomUser & DefaultSession['user']
    }
}

declare module "next-auth/jwt" {
    interface JWT extends CustomUser {}
}