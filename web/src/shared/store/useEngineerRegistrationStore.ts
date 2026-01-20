import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { EngineerData } from "@/shared/apiServices/engineer/engineerTypes";

/**
 * Engineer Registration Store State Interface
 */
interface EngineerRegistrationState {
  // ===== Step 1 & 2: Signup + OTP Verification =====
  signupEmail: string | null;
  signupPhone: string | null;
  emailVerified: boolean;
  mobileVerified: boolean;

  // ===== Step 3: Profile Setup =====
  fullName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  address: string;

  // Professional Details
  skills: (string | number)[]; // IDs or Names
  portfolioLink: string;
  serviceCategory: string | number; // ID or Name
  amount: string; // Rate/Budget
  designation: string;
  company: string;
  experienceYears: string;

  password: string;
  confirmPassword: string;

  // ===== Step 4: Documents =====
  resumeUrl: string;
  governmentIdUrl: string;
  certificateUrl: string;
  profileImageUrl: string;

  // ===== Meta Information =====
  currentStep: number;
  completedSteps: number[];
  isEnableNotifications: boolean;
  engineerId: string | null; // Registered engineer ID
  registrationComplete: boolean;

  // ===== Actions =====
  setSignupData: (data: {
    email?: string;
    phone?: string;
    emailVerified?: boolean;
    mobileVerified?: boolean;
  }) => void;

  updateProfileData: (
    data: Partial<{
      fullName: string;
      email: string;
      phone: string;
      country: string;
      state: string;
      city: string;
      postalCode: string;
      address: string;
      skills: (string | number)[];
      portfolioLink: string;
      serviceCategory: string | number;
      amount: string;
      designation: string;
      company: string;
      experienceYears: string;
      password: string;
      confirmPassword: string;
      isEnableNotifications: boolean;
    }>,
  ) => void;

  updateDocuments: (
    data: Partial<{
      resumeUrl: string;
      governmentIdUrl: string;
      certificateUrl: string;
      profileImageUrl: string;
    }>,
  ) => void;

  setCurrentStep: (step: number) => void;
  markStepCompleted: (step: number) => void;
  clearStore: () => void;
  setEngineerId: (id: string) => void;
  markRegistrationComplete: () => void;
  getApiData: () => EngineerData;
}

const initialState = {
  signupEmail: null,
  signupPhone: null,
  emailVerified: false,
  mobileVerified: false,

  fullName: "",
  email: "",
  phone: "",
  country: "",
  state: "",
  city: "",
  postalCode: "",
  address: "",

  skills: [],
  portfolioLink: "",
  serviceCategory: "",
  amount: "",
  designation: "",
  company: "",
  experienceYears: "",

  password: "",
  confirmPassword: "",

  resumeUrl: "",
  governmentIdUrl: "",
  certificateUrl: "",
  profileImageUrl: "",

  currentStep: 1,
  completedSteps: [],
  isEnableNotifications: true,
  engineerId: null,
  registrationComplete: false,
};

export const useEngineerRegistrationStore = create<EngineerRegistrationState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setSignupData: (data) => {
        set((state) => ({
          signupEmail: data.email ?? state.signupEmail,
          signupPhone: data.phone ?? state.signupPhone,
          emailVerified: data.emailVerified ?? state.emailVerified,
          mobileVerified: data.mobileVerified ?? state.mobileVerified,
          email: data.email ?? state.email,
          phone: data.phone ?? state.phone,
          currentStep: 2,
          completedSteps: [...new Set([...state.completedSteps, 1])],
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

      setEngineerId: (id) => {
        set({ engineerId: id });
      },

      markRegistrationComplete: () => {
        set({ registrationComplete: true });
      },

      getApiData: () => {
        const state = get();

        return {
          password: state.password,
          phoneNumber: state.phone || state.signupPhone || "",
          email: state.email || state.signupEmail || "",
          fullName: state.fullName,
          address: state.address,

          portfolioLink: state.portfolioLink,
          serviceCategory: state.serviceCategory,

          budget: state.amount,
          rate: parseFloat(state.amount.replace(/[^0-9.]/g, "")) || 0,

          experienceYears: parseFloat(state.experienceYears) || 0,

          preferredWorkType: "REMOTE HYBRID",
          enableNotifications: state.isEnableNotifications,
          location: `${state.city}, ${state.state}, ${state.country}`,
          averageRating: 0.0,
          status: "PENDING",

          jobSkills: state.skills,
          tools: [],

          experiences:
            state.company && state.designation
              ? [
                  {
                    designation: state.designation,
                    employer: state.company,
                    workLocationType: "REMOTE",
                    employmentType: "FULL_TIME",
                    startDate: new Date().toISOString(),
                    isCurrent: true,
                  },
                ]
              : [],

          educations: [],

          files: null,
        };
      },
    }),
    {
      name: "engineer-registration-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        signupEmail: state.signupEmail,
        signupPhone: state.signupPhone,
        emailVerified: state.emailVerified,
        mobileVerified: state.mobileVerified,
        fullName: state.fullName,
        email: state.email,
        phone: state.phone,
        country: state.country,
        state: state.state,
        city: state.city,
        postalCode: state.postalCode,
        address: state.address,
        skills: state.skills,
        portfolioLink: state.portfolioLink,
        serviceCategory: state.serviceCategory,
        amount: state.amount,
        designation: state.designation,
        company: state.company,
        experienceYears: state.experienceYears,
        currentStep: state.currentStep,
        completedSteps: state.completedSteps,
        isEnableNotifications: state.isEnableNotifications,
      }),
    },
  ),
);
