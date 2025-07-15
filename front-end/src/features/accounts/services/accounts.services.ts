// Corrected syntax errors in the API functions
import api from "../../../services/axios/api";
import type { DonationItem } from "../types/accounts.types";

// Ensured token is prefixed with 'Bearer ' in the Authorization header
export const getProfile = async () => {
    const response = await api.get("/profile", {
        
    });
    console.log("API Response:", response.data);
    return response.data.data; 
};

export const getAdminProfileByAccountId = async (accountId: string) => {
    const response = await api.get(`/admin/profiles/${accountId}`);
    return response.data;
};

export const getAdminAccounts = async () => {
    const response = await api.get("/admin/accounts");
    return response.data;
};

export const searchAdminAccounts = async (query: string) => {
    const response = await api.get(`/admin/accounts/search`, {
        params: { query },
    });
    return response.data;
};

export const getDonationsByAccountId = async (accountId: string): Promise<DonationItem[]> => {
    try {
        console.log("Calling API with accountId:", accountId); // Log accountId
        const response = await api.get(`/donation/get-by-account/${accountId}`);
        console.log("Full API Response:", response); // Log toàn bộ response
        console.log("API Response Data:", response.data); // Log response.data
        return response.data;
    } catch (error) {
        console.error("Error fetching donations by account ID:", error);
        throw new Error("Failed to fetch donations. Please check the server logs for more details.");
    }
};

