import { useState, useCallback } from 'react';
import { useDeviceStore } from '@/shared/store/useDeviceStore';

/**
 * Custom hook to manage geolocation permissions and retrieval.
 * 
 * @returns {Object} An object containing:
 * - `requestLocation`: Function to request location access from the user. Returns a Promise resolving to true/false.
 * - `checkPermission`: Function to check the current permission status without prompting.
 * - `loading`: Boolean indicating if a location request is in progress.
 * - `error`: String containing any error message if the request fails.
 */
export const useGeolocation = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setLocation, setLocationPermission } = useDeviceStore();

    /**
     * Requests the current position from the browser.
     * Updates the store with the location and permission status.
     * 
     * @returns {Promise<boolean>} Resolves to true if location was successfully retrieved, false otherwise.
     */
    const requestLocation = useCallback((): Promise<boolean> => {
        setLoading(true);
        setError(null);

        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                setError('Geolocation is not supported by your browser');
                setLoading(false);
                resolve(false);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ lat: latitude, lng: longitude });
                    setLocationPermission('granted');
                    setLoading(false);
                    resolve(true);
                },
                (err) => {
                    setError(err.message);
                    setLocationPermission('denied');
                    setLoading(false);
                    resolve(false);
                }
            );
        });
    }, [setLocation, setLocationPermission]);

    /**
     * Checks the current geolocation permission status.
     * Updates the store with the current permission state.
     * Does NOT automatically fetch location - only syncs permission state.
     */
    const checkPermission = useCallback(async () => {
        if (!navigator.permissions || !navigator.permissions.query) return;

        try {
            const result = await navigator.permissions.query({ name: 'geolocation' });
            // Only sync the permission state, don't auto-fetch location
            setLocationPermission(result.state);
        } catch (error) {
            console.error("Error checking geolocation permission:", error);
        }
    }, [setLocationPermission]);

    return { requestLocation, checkPermission, loading, error };
};
