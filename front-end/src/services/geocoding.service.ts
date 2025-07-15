import axios from 'axios';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';

export interface GeocodingResult {
  lat: string;
  lon: string;
  display_name: string;
}

/**
 * Convert an address to geographic coordinates (latitude and longitude) using Nominatim API.
 * @param address The address to geocode.
 * @returns A promise resolving to the geocoding result.
 */
export const geocodeAddress = async (address: string): Promise<GeocodingResult[]> => {
  try {
    const response = await axios.get(NOMINATIM_BASE_URL, {
      params: {
        q: address,
        format: 'json',
        addressdetails: 1,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error while geocoding address:', error);
    throw new Error('Failed to fetch geocoding data.');
  }
};
