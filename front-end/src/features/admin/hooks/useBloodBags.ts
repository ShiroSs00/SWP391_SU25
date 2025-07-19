import { useState, useEffect } from 'react';
import type { BloodBag, UpdateBloodBagRequest } from '../types/blood-bags.types';
import { bloodBagsService } from '../services/blood-bags.services';

export const useBloodBags = () => {
  const [bloodBags, setBloodBags] = useState<BloodBag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchBloodBags = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bloodBagsService.getAllBloodBags();
      
      if (response.success) {
        setBloodBags(response.data);
      } else {
        setError(response.message || 'Failed to fetch blood bags');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateBloodBag = async (bagId: string, data: Omit<UpdateBloodBagRequest, 'bagId'>) => {
    try {
      setUpdating(true);
      setError(null);
      
      const response = await bloodBagsService.updateBloodBag(bagId, data);
      
      if (response.success) {
        // Cập nhật local state
        setBloodBags(prev => 
          prev.map(bag => 
            bag.bagId === bagId 
              ? { ...bag, ...data, bagId } 
              : bag
          )
        );
        return response;
      } else {
        throw new Error(response.message || 'Failed to update blood bag');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while updating';
      setError(errorMessage);
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  const deleteBloodBags = async (bagIds: string[]) => {
    try {
      setDeleting(true);
      setError(null);
      
      const response = await bloodBagsService.deleteMultipleBloodBags(bagIds);
      
      if (response.success) {
        // Cập nhật local state
        setBloodBags(prev => prev.filter(bag => !bagIds.includes(bag.bagId)));
        return response;
      } else {
        throw new Error(response.message || 'Failed to delete blood bags');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while deleting';
      setError(errorMessage);
      throw err;
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchBloodBags();
  }, []);

  return {
    bloodBags,
    loading,
    updating,
    deleting,
    error,
    refetch: fetchBloodBags,
    updateBloodBag,
    deleteBloodBags
  };
};
    