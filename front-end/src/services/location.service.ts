export const locationService = {
  sendLocation: async (locationData: { latitude: number; longitude: number }) => {
    // Placeholder implementation
    console.log('Sending location:', locationData);
    return Promise.resolve({ success: true });
  }
};