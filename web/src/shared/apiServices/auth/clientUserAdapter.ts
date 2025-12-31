import axiosInstance from "@/axiosInstance";
import { CLIENT_USER_ROUTER_PATHS } from "./clientRouterPaths";

/**
 * Client User data structure
 */
export interface ClientUser {
  id: string;
  name: string;
  email: string;
}

/**
 * ClientUserAdapter
 *
 * Handles API calls for client user operations.
 * Provides methods to retrieve client user information by ID.
 */
export class ClientUserAdapter {
  /**
   * Retrieves a client user by their unique identifier.
   *
   * Endpoint: GET /client-user/{id}
   *
   * @param id - Unique identifier of the client user
   * @returns Promise resolving to client user data (id, name, email)
   * @throws {Error} If the client user is not found or request encounters an error
   */
  static async getClientUserById(id: string): Promise<ClientUser> {
    const response = await axiosInstance.get(
      CLIENT_USER_ROUTER_PATHS.GET_CLIENT_USER_BY_ID(id)
    );

    const { id: userId, name, email } = response.data;

    return {
      id: userId,
      name,
      email,
    };
  }
}
