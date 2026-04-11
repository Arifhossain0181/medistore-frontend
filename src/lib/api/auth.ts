import axios from 'axios';

export const getUserProfile = async () => {
    try {
        const response = await axios.get(`/api/user/me`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to fetch profile');
        }
        throw error;
    }
};

// Profile management functions
export const updateUserProfile = async (data: { name?: string; email?: string; image?: string }) => {
    try {
        const response = await axios.patch(
            `/api/user/me`,
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

export const getCustomerDashboardStats = async () => {
    try {
        const response = await axios.get(`/api/user/me/dashboard-stats`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Failed to fetch dashboard stats');
        }
        throw error;
    }
};

export const changeUserPassword = async (data: { currentPassword: string; newPassword: string }) => {
    try {
        const response = await axios.patch(
            `/api/user/me/changed-password`,
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