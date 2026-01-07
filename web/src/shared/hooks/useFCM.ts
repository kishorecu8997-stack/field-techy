import { useState, useCallback } from 'react';
import { getToken } from 'firebase/messaging';
import { messaging } from '@/shared/config/firebaseConfig';
import { useDeviceStore } from '@/shared/store/useDeviceStore';
import { config } from '../config/configService';


/**
 * Custom hook to manage Firebase Cloud Messaging (FCM) permissions and token retrieval.
 * 
 * @returns {Object} An object containing:
 * - `requestNotificationPermission`: Function to request notification access. Returns a Promise resolving to true/false.
 * - `checkPermission`: Function to check the current permission status without prompting.
 * - `loading`: Boolean indicating if a token request is in progress.
 * - `error`: String containing any error message if the request fails.
 */
export const useFCM = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const setFcmToken = useDeviceStore((state) => state.setFcmToken);
    const setNotificationPermission = useDeviceStore((state) => state.setNotificationPermission);

    /**
     * Requests notification permission from the user.
     * If granted, retrieves the FCM token and updates the store.
     * 
     * @returns {Promise<boolean>} Resolves to true if permission granted and token retrieved, false otherwise.
     */
    const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            const permission = await Notification.requestPermission();
            setNotificationPermission(permission);

            if (permission === 'granted') {
                const token = await getToken(messaging, {
                    vapidKey: config.firebase.vapidKey
                });
                if (token) {
                    setFcmToken(token);
                    setLoading(false);
                    return true;
                } else {
                    setError('No registration token available. Request permission to generate one.');
                    setLoading(false);
                    return false;
                }
            } else {
                setError('Notification permission denied');
                setLoading(false);
                return false;
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred while retrieving token');
            setLoading(false);
            return false;
        }
    }, [setFcmToken, setNotificationPermission]);

    /**
     * Checks the current notification permission status.
     * Updates the store with the current permission state.
     * Does NOT automatically request tokens - only syncs permission state.
     */
    const checkPermission = useCallback(async () => {
        if (!('Notification' in window)) return;

        const permission = Notification.permission;
        // Only sync the permission state, don't auto-request token
        setNotificationPermission(permission);
    }, [setNotificationPermission]);

    return { requestNotificationPermission, checkPermission, loading, error };
};
