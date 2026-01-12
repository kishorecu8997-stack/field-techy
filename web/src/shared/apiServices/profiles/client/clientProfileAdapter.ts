import axiosInstance from "@/axiosInstance";
import { CLIENT_PROFILE_ROUTER_PATHS } from "./clientProfileRouterPaths";
import { GlobalApiErrorHandler } from "../../utils";

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
  /**
   * Creates a new client profile.
   *
   * Endpoint: POST /client/api/v1/clients/signup
   *
   * @param data - Client profile data including personal and company information
   * @returns Promise resolving to the created client profile data
   * @throws {Error} If profile creation fails or request encounters an error
   */
  static async create(data: ClientProfileData): Promise<ClientProfileData> {
    try {
      const response = await axiosInstance.post(
        CLIENT_PROFILE_ROUTER_PATHS.SIGNUP,
        data,
      );
      return response.data;
    } catch (error) {
      throw GlobalApiErrorHandler.handle(error);
    }
  }

  /**
   * Retrieves a client profile by ID.
   *
   * Endpoint: GET /client/api/v1/clients/{id}
   *
   * @param id - Unique identifier of the client
   * @returns Promise resolving to client profile data
   * @throws {Error} If the client profile is not found or request encounters an error
   */
  static async getById(id: string): Promise<ClientProfileData> {
    try {
      const response = await axiosInstance.get(
        CLIENT_PROFILE_ROUTER_PATHS.GET_BY_ID(id),
      );
      return response.data;
    } catch (error) {
      throw GlobalApiErrorHandler.handle(error);
    }
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
    try {
      const response = await axiosInstance.get(
        CLIENT_PROFILE_ROUTER_PATHS.GET_PROFILE_BY_ID(clientId),
      );
      return response.data;
    } catch (error) {
      throw GlobalApiErrorHandler.handle(error);
    }
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
    try {
      // TODO: Extract client ID from authentication token in production
      // Hardcoded client ID for testing: 9f034ed8-2ea5-44b6-a410-973e559e2c47
      const CLIENT_ID = "ce1dece0-78e4-4076-b73c-4060b718c8a9";
      const response = await axiosInstance.get(
        CLIENT_PROFILE_ROUTER_PATHS.GET_PROFILE_BY_ID(CLIENT_ID),
      );
      return response.data;
    } catch (error) {
      throw GlobalApiErrorHandler.handle(error);
    }
  }

  /**
   * Retrieves a paginated list of client profiles.
   *
   * Endpoint: GET /client/api/v1/clients/paged
   *
   * @param params - Pagination and sorting parameters
   * @param params.page - Page number (default: 0)
   * @param params.size - Number of items per page (default: 10)
   * @param params.sortBy - Field to sort by (default: "createdAt")
   * @param params.direction - Sort direction: "ASC" or "DESC" (default: "DESC")
   * @returns Promise resolving to paginated client profile data
   * @throws {Error} If the request encounters an error
   */
  static async getAll(
    params: ClientProfilePaginationParams = {},
  ): Promise<unknown> {
    try {
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
        },
      );
      return response.data;
    } catch (error) {
      throw GlobalApiErrorHandler.handle(error);
    }
  }

  /**
   * Updates an existing client profile.
   *
   * Endpoint: PUT /client/api/v1/clients/update/{id}
   *
   * @param id - Unique identifier of the client to update
   * @param data - Updated client profile data
   * @returns Promise resolving to the updated client profile data
   * @throws {Error} If the update fails or request encounters an error
   */
  static async update(
    id: string,
    data: ClientProfileData,
  ): Promise<ClientProfileData> {
    try {
      const response = await axiosInstance.put(
        CLIENT_PROFILE_ROUTER_PATHS.UPDATE(id),
        data,
      );
      return response.data;
    } catch (error) {
      throw GlobalApiErrorHandler.handle(error);
    }
  }

  /**
   * Deletes a client profile by ID.
   *
   * Endpoint: DELETE /client/api/v1/clients/delete/{id}
   *
   * @param id - Unique identifier of the client to delete
   * @returns Promise that resolves when the deletion is complete
   * @throws {Error} If the deletion fails or request encounters an error
   */
  static async delete(id: string): Promise<void> {
    try {
      await axiosInstance.delete(CLIENT_PROFILE_ROUTER_PATHS.DELETE(id));
    } catch (error) {
      GlobalApiErrorHandler.handleAndThrow(error);
    }
  }
}
