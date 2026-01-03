import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Client Registration Store State Interface
 * 
 * Manages all data collected during the client registration flow:
 * 1. Signup (email/phone)
 * 2. OTP Verification
 * 3. Account Type Selection
 * 4. Profile Setup
 * 5. Document Upload
 */
interface ClientRegistrationState {
    // ===== Step 1 & 2: Signup + OTP Verification =====
    signupEmail: string | null;
    signupPhone: string | null;
    emailVerified: boolean;
    mobileVerified: boolean;

    // ===== Step 3: Account Type =====
    accountType: 'corporate' | 'home' | null;

    // ===== Step 4: Profile Setup - Common Fields =====
    fullName: string;
    email: string;
    phone: string;
    country: string;
    state: string;
    city: string;
    postalCode: string;
    address: string;
    password: string;
    confirmPassword: string;

    // ===== Step 4: Profile Setup - Corporate Only =====
    companyName: string;
    contactPersonName: string;
    industry: string;
    vat: string;
    vatRegistrationNumber: string;

    // ===== Step 4: Payment (if needed later) =====
    paymentMethodId: string;

    // ===== Step 5: Documents (File references) =====
    profileImageUrl: string;
    resumeUrl: string;
    governmentIdUrl: string;
    certificateUrl: string;

    // ===== Meta Information =====
    currentStep: number; // 1-5
    completedSteps: number[]; // Array of completed step numbers
    isEnableNotifications: boolean;
    clientId: string | null; // Registered client ID from signup
    registrationComplete: boolean; // True when basic profile is submitted (documents optional)

    // ===== Actions =====

    /**
     * Set signup data from Step 1 (Email/Phone signup)
     */
    setSignupData: (data: {
        email?: string;
        phone?: string;
        emailVerified?: boolean;
        mobileVerified?: boolean;
    }) => void;

    /**
     * Set account type from Step 3
     */
    setAccountType: (type: 'corporate' | 'home') => void;

    /**
     * Update profile data (Step 4)
     * Can be called multiple times to update partial data
     */
    updateProfileData: (data: Partial<{
        fullName: string;
        email: string;
        phone: string;
        country: string;
        state: string;
        city: string;
        postalCode: string;
        address: string;
        password: string;
        confirmPassword: string;
        companyName: string;
        contactPersonName: string;
        industry: string;
        vat: string;
        vatRegistrationNumber: string;
        paymentMethodId: string;
        isEnableNotifications: boolean;
    }>) => void;

    /**
     * Update document URLs (Step 5)
     */
    updateDocuments: (data: Partial<{
        profileImageUrl: string;
        resumeUrl: string;
        governmentIdUrl: string;
        certificateUrl: string;
    }>) => void;

    /**
     * Update current step
     */
    setCurrentStep: (step: number) => void;

    /**
     * Mark a step as completed
     */
    markStepCompleted: (step: number) => void;

    /**
     * Clear all store data (after successful registration)
     */
    clearStore: () => void;

    /**
     * Set the registered client ID
     */
    setClientId: (id: string) => void;

    /**
     * Mark registration as complete (basic profile submitted)
     */
    markRegistrationComplete: () => void;

    /**
     * Get data formatted for API submission
     */
    getApiData: () => {
        phoneNumber: string;
        email: string;
        password: string;
        clientType: "home" | "corporate" | "";
        companyName?: string;
        contactPersonName?: string;
        businessType?: string;
        industry?: string;
        address: string;
        country: string;
        state: string;
        city: string;
        postalCode: string;
        enableNotifications: boolean;
        isApproved: boolean;
    };
}

const initialState = {
    // Signup data
    signupEmail: null,
    signupPhone: null,
    emailVerified: false,
    mobileVerified: false,

    // Account type
    accountType: null,

    // Profile data - common
    fullName: '',
    email: '',
    phone: '',
    country: '',
    state: '',
    city: '',
    postalCode: '',
    address: '',
    password: '',
    confirmPassword: '',

    // Profile data - corporate
    companyName: '',
    contactPersonName: '',
    industry: '',
    vat: '',
    vatRegistrationNumber: '',

    // Payment
    paymentMethodId: '',

    // Documents
    profileImageUrl: '',
    resumeUrl: '',
    governmentIdUrl: '',
    certificateUrl: '',

    // Meta
    currentStep: 1,
    completedSteps: [],
    isEnableNotifications: true,
    clientId: null,
    registrationComplete: false,
};

/**
 * Client Registration Store
 * 
 * Manages state across the entire client registration flow.
 * Persists to localStorage to survive page refreshes.
 * 
 * @example
 * ```tsx
 * const { signupEmail, setSignupData } = useClientRegistrationStore();
 * 
 * setSignupData({
 *   email: 'user@example.com',
 *   emailVerified: true
 * });
 * ```
 */
export const useClientRegistrationStore = create<ClientRegistrationState>()(
    persist(
        (set, get) => ({
            ...initialState,

            setSignupData: (data) => {
                set((state) => ({
                    signupEmail: data.email ?? state.signupEmail,
                    signupPhone: data.phone ?? state.signupPhone,
                    emailVerified: data.emailVerified ?? state.emailVerified,
                    mobileVerified: data.mobileVerified ?? state.mobileVerified,
                    email: data.email ?? state.email, // Also set in profile
                    phone: data.phone ?? state.phone, // Also set in profile
                    currentStep: 2,
                    completedSteps: [...new Set([...state.completedSteps, 1])],
                }));
            },

            setAccountType: (type) => {
                set((state) => ({
                    accountType: type,
                    currentStep: 4, // Skip step 3, go to profile
                    completedSteps: [...new Set([...state.completedSteps, 3])],
                }));
            },

            updateProfileData: (data) => {
                set((state) => ({
                    ...state,
                    ...data,
                }));
            },

            updateDocuments: (data) => {
                set((state) => ({
                    ...state,
                    ...data,
                }));
            },

            setCurrentStep: (step) => {
                set({ currentStep: step });
            },

            markStepCompleted: (step) => {
                set((state) => ({
                    completedSteps: [...new Set([...state.completedSteps, step])],
                }));
            },

            clearStore: () => {
                set(initialState);
            },

            setClientId: (id) => {
                set({ clientId: id });
            },

            markRegistrationComplete: () => {
                set({ registrationComplete: true });
            },

            getApiData: () => {
                const state = get();
                return {
                    phoneNumber: state.phone || state.signupPhone || '',
                    email: state.email || state.signupEmail || '',
                    password: state.password,
                    clientType: state.accountType || '',
                    companyName: state.accountType === 'corporate' ? state.companyName : undefined,
                    contactPersonName: state.accountType === 'corporate' ? state.contactPersonName : undefined,
                    businessType: state.accountType || undefined,
                    industry: state.accountType === 'corporate' ? state.industry : undefined,
                    address: state.address,
                    country: state.country,
                    state: state.state,
                    city: state.city,
                    postalCode: state.postalCode,
                    enableNotifications: state.isEnableNotifications,
                    isApproved: true,
                };
            },
        }),
        {
            name: 'client-registration-storage', // localStorage key
            storage: createJSONStorage(() => localStorage),
            // Only persist essential data, not sensitive passwords or temporary states
            partialize: (state) => ({
                signupEmail: state.signupEmail,
                signupPhone: state.signupPhone,
                emailVerified: state.emailVerified,
                mobileVerified: state.mobileVerified,
                accountType: state.accountType,
                fullName: state.fullName,
                email: state.email,
                phone: state.phone,
                country: state.country,
                state: state.state,
                city: state.city,
                postalCode: state.postalCode,
                address: state.address,
                companyName: state.companyName,
                contactPersonName: state.contactPersonName,
                industry: state.industry,
                vat: state.vat,
                vatRegistrationNumber: state.vatRegistrationNumber,
                currentStep: state.currentStep,
                completedSteps: state.completedSteps,
                isEnableNotifications: state.isEnableNotifications,
                // DO NOT persist: password, confirmPassword, payment info, document URLs
            }),
        }
    )
);

// Export types for use in components
export type { ClientRegistrationState };
