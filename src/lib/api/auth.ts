import { createAuthClient } from 'better-auth/react'
import { nextCookies } from "better-auth/next-js";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
    credentials:"include",
    plugins:[
       nextCookies()
    ],
    
})