import { createAuthClient } from 'better-auth/react'
import { nextCookies } from "better-auth/next-js";
import axios from 'axios';

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL ,
    credentials:"include",
    plugins:[
       nextCookies()
    ],

})

// Profile management functions
export const updateUserProfile = async (data: { name?: string; email?: string; image?: string }) => {
    try {
        const response = await axios.patch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/me`,
            data,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to update profile');
        }
        throw error;
    }
};

export const changeUserPassword = async (data: { currentPassword: string; newPassword: string }) => {
    try {
        const response = await axios.patch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/me/changed-password`,
            data,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to change password');
        }
        throw error;
    }
};