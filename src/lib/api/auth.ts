import { createAuthClient } from 'better-auth/react'
import { nextCookies } from "better-auth/next-js";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL , 
    credentials:"include",
    plugins:[
       nextCookies()
    ],
    
})