import axiosInstance from "@/axiosInstance";
import { ENGINEER_ROUTER_PATHS } from "./engineerRouterPaths";
import type {
  CompleteRegistrationData,
  LoginFormData,
} from "@/pages/engineer/auth/components/types";

/*
 * EngineerAdapter
 *
 * Responsible for making API calls to the engineer-related endpoints.
 * Provides methods for signing up, signing in, getting an engineer by ID,
 * deleting an engineer.
 *
 * The adapter also includes a helper function for converting pagination
 * parameters into the expected format for the API.
 *
 */
export class EngineerAdapter {
  static async signup(data: CompleteRegistrationData) {
    const engineerPayload = {
      password: data.password,
      phoneNumber: data.phone,
      email: data.email,
      fullName: `${data.firstName} ${data.lastName}`,
      address: data.address,
      portfolioLink: data.portfolio ?? "",
      serviceCategory: data.serviceCategory ?? "",
      budget: "Negotiable", // Defaulting as per example
      rate: data.amount ? parseFloat(data.amount) : 0,
      experienceYears: data.experience ? parseInt(data.experience) : 0,
      preferredWorkType: "REMOTE HYBRID", // Defaulting as per example
      enableNotifications: true,
      location: data.country ? `${data.country}, ${data.postalCode}` : "",
      averageRating: 0,
      status: "PENDING",
      jobSkills: data.skills || [],
      tools: [], // Add tools if collected in form
      experiences: [], // Add experiences if collected
      educations: [], // Add educations if collected
      files: null, // As per example
    };

    const response = await axiosInstance.post(
      ENGINEER_ROUTER_PATHS.SIGNUP,
      engineerPayload
    );
    return response.data;
  }

  static async signin(data: LoginFormData) {
    const payload = {
      phoneOrEmail: data.email, // LoginFormData has email, API expects phoneOrEmail
      password: data.password,
    };
    const response = await axiosInstance.post(
      ENGINEER_ROUTER_PATHS.SIGNIN,
      payload
    );
    return response.data;
  }

  static async getById(id: string) {
    const response = await axiosInstance.get(
      ENGINEER_ROUTER_PATHS.GET_BY_ID(id)
    );
    return response.data;
  }

  static async delete(id: string) {
    await axiosInstance.delete(ENGINEER_ROUTER_PATHS.DELETE(id));
  }
}
