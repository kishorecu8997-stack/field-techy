/**
 * Firebase Configuration
 * 
 * This file initializes the Firebase application and exports the messaging instance
 * used for Firebase Cloud Messaging (FCM).
 * 
 * @module FirebaseConfig
 */

import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { config } from "@/shared/config/configService";

// Your web app's Firebase configuration
// Values are now sourced from the centralized config service
const firebaseConfig = config.firebase;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

/**
 * Firebase Messaging instance.
 * Used to retrieve FCM tokens and handle incoming messages.
 */
export const messaging = getMessaging(app);
