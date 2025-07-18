import {useState, useEffect, useCallback} from 'react';
import {
    createAfterDonation,
    getAfterDonation,
    updateAfterDonation,
    deleteAfterDonation,
    deleteMultipleAfterDonations,
    manualseparateAfterDonation,
} from '../services/after-donation.services';
import type { AfterDonationData, ManualSeparateData } from '../types/after-donation.types';

/**
 * Custom hook to handle after donation operations.
 */
export const useAfterDonation = () => {
    const [afterDonationData, setAfterDonationData] = useState<AfterDonationData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Create a new after donation record.
     * @param healthCheckId ID of the health check
     * @param data AfterDonationData object
     */
    const fetchAfterDonationData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAfterDonation();
            setAfterDonationData(data);
        } catch (err) {
            setError((err as Error).message || 'An error occurred while fetching after donation data.');
        } finally {
            setLoading(false);
        }
    };
    const addAfterDonation = async (healthCheckId: string, data: AfterDonationData) => {
        setLoading(true);
        setError(null);
        try {
            const newData = await createAfterDonation(healthCheckId, data);
            setAfterDonationData((prev) => [...prev, newData]);
        } catch (err) {
            setError((err as Error).message || 'An error occurred while adding after donation data.');
        } finally {
            setLoading(false);
        }
    };
    const updateAfterDonationData = async (id: string, data: AfterDonationData) => {
        setLoading(true);
        setError(null);
        try {
            const updatedData = await updateAfterDonation(id, data);
            setAfterDonationData((prev) =>
                prev.map((item) => (item.idAfterDonation === id ? updatedData : item))
            );
        } catch (err) {
            setError((err as Error).message || 'An error occurred while updating after donation data.');
        } finally {
            setLoading(false);
        }
    };
    const deleteAfterDonationData = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await deleteAfterDonation(id);
            setAfterDonationData((prev) => prev.filter((item) => item.idAfterDonation   !== id));
        } catch (err) {
            setError((err as Error).message || 'An error occurred while deleting after donation data.');
        } finally {
            setLoading(false);
        }
    };
    const deleteMultipleAfterDonationsData = async (ids: string[]) => {
        setLoading(true);
        setError(null);
        try {
            const deletedData = await deleteMultipleAfterDonations(ids);
            setAfterDonationData((prev) => prev.filter((item) => !deletedData.includes(item.idAfterDonation)));
        } catch (err) {
            setError((err as Error).message || 'An error occurred while deleting multiple after donation data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAfterDonationData();
    }, []);
    return {
        afterDonationData,
        loading,
        error,
        addAfterDonation,
        fetchAfterDonationData,
        updateAfterDonationData,
        deleteAfterDonationData,
        deleteMultipleAfterDonationsData,
    };
};

/**
 * Custom hook to handle manual blood separation.
 */
export const useManualSeparate = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Separate blood manually.
     * @param data ManualSeparateData object
     */
    const separateBlood = useCallback(async (data: ManualSeparateData) => {
        setLoading(true);
        setError(null);

        try {
            const result = await manualseparateAfterDonation(data);
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tách máu';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Clear error state.
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        loading,
        error,
        separateBlood,
        clearError
    };
};