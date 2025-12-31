import axiosInstance from "@/axiosInstance";
import { CLIENT_PROFILE_ROUTER_PATHS } from "./clientProfileRouterPaths";

/**
 * Client Profile Data Response
 *
 * Response type for GET /api/v1/clients/<clientId>
 * The <clientId> is the slug parameter in the URL path.
 */
export interface ClientProfileData {
  id: string;
  phoneNumber: string;
  email: string;
  password: string | null;
  clientType: "HOME" | "CORPORATE";
  companyName: string;
  contactPersonName: string;
  businessType: string;
  industry: string;
  address: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  taxDocumentVat: string;
  vatRegistrationNumber: string;
  profilePicture: string;
  governmentIdProofDocument: string;
  certificationQualificationsDocument: string;
  enableNotifications: boolean;
  isApproved: boolean;
  // Optional fields that may be used in forms but not in API response
  vat?: string;
  fullName?: string;
  confirmPassword?: string;
}

export interface ClientProfilePaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: "ASC" | "DESC";
}

/*
 * ClientProfileAdapter
 *
 * Responsible for making API calls to the client profile endpoints.
 */
export class ClientProfileAdapter {
  static async create(data: ClientProfileData): Promise<ClientProfileData> {
    const response = await axiosInstance.post(
      CLIENT_PROFILE_ROUTER_PATHS.SIGNUP,
      data
    );
    return response.data;
  }

  static async getById(id: string): Promise<ClientProfileData> {
    const response = await axiosInstance.get(
      CLIENT_PROFILE_ROUTER_PATHS.GET_BY_ID(id)
    );
    return response.data;
  }

  /**
   * Get client profile by ID
   *
   * Endpoint: GET /api/v1/clients/<clientId>
   * The <clientId> is the slug parameter in the URL path.
   *
   * @param clientId - The client ID (slug) to fetch profile for
   * @returns Client profile data
   */
  static async getProfileById(clientId: string): Promise<ClientProfileData> {
    const response = await axiosInstance.get(
      CLIENT_PROFILE_ROUTER_PATHS.GET_PROFILE_BY_ID(clientId)
    );
    return response.data;
  }

  /**
   * Get current logged-in client profile
   *
   * Endpoint: GET /api/v1/clients/<clientId>
   * Uses a hardcoded client ID for testing. In production, this should extract
   * the client ID from the authentication token.
   *
   * @returns Client profile data for the currently authenticated client
   */
  static async getCurrentClient(): Promise<ClientProfileData> {
    // TODO: Extract client ID from authentication token in production
    // Hardcoded client ID for testing: 9f034ed8-2ea5-44b6-a410-973e559e2c47
    const CLIENT_ID = "9f034ed8-2ea5-44b6-a410-973e559e2c47";
    const response = await axiosInstance.get(
      CLIENT_PROFILE_ROUTER_PATHS.GET_PROFILE_BY_ID(CLIENT_ID)
    );
    return response.data;
  }

  static async getAll(
    params: ClientProfilePaginationParams = {}
  ): Promise<unknown> {
    const {
      page = 0,
      size = 10,
      sortBy = "createdAt",
      direction = "DESC",
    } = params;
    const response = await axiosInstance.get(
      CLIENT_PROFILE_ROUTER_PATHS.GET_PAGED,
      {
        params: { page, size, sortBy, direction },
      }
    );
    return response.data;
  }

  static async update(
    id: string,
    data: ClientProfileData
  ): Promise<ClientProfileData> {
    const response = await axiosInstance.put(
      CLIENT_PROFILE_ROUTER_PATHS.UPDATE(id),
      data
    );
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await axiosInstance.delete(CLIENT_PROFILE_ROUTER_PATHS.DELETE(id));
  }
}
