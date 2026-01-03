import axiosInstance from "@/axiosInstance";
import { CLIENT_USER_AUTH_ROUTER_PATHS } from "./clientAuthRouterPaths";
import type { ClientSignUpData } from "./clientAuthTypes";
import type { UserSession } from "@/shared/store/useUserSessionStore";
import { AxiosError } from "axios";
import { UserRole } from "@/shared/enums/users";
import { GlobalApiErrorHandler } from "@/shared/apiServices/utils";

/**
 * ClientAuthAdapter
 *
 * Handles authentication-related API calls for client users.
 * Provides methods for sign-in, sign-up, OTP verification, and related operations.
 */
export class ClientAuthAdapter {
  /**
   * Authenticates a client user with phone/email and password.
   *
   * Endpoint: POST /user/api/v1/users/clt/signin
   *
   * @param args - Authentication credentials
   * @param args.phoneOrEmail - Phone number or email address of the client
   * @param args.password - User's password
   * @returns Promise resolving to the authentication response data
   * @throws {Error} If authentication fails or request encounters an error
   */
  static async signIn(args: { phoneOrEmail: string; password: string }) {
    try {
      const response = await axiosInstance.post(
        CLIENT_USER_AUTH_ROUTER_PATHS.LOGIN,
        args
      );

      const authorization = response.headers["authorization"];
      const userId = response.headers["x-user"];
      const role = response.headers["x-user-type"];

      if (!authorization || !userId || !role) {
        console.error(
          "Authentication failed, missing headers:",
          response.headers
        );
        throw new AxiosError(
          "Authentication failed",
          "401",
          response.config,
          response.data,
          response
        );
      }

      if (!Object.values(UserRole).includes(role as unknown as UserRole)) {
        throw new AxiosError(
          "Authentication failed, invalid role",
          "401",
          response.config,
          response.data,
          response
        );
      }

      const authResponsePayload: UserSession = {
        accessToken: authorization,
        userId: userId,
        role: role as UserRole,
        initiatedAt: Date.now(),
      };

      return authResponsePayload;
    } catch (error) {
      GlobalApiErrorHandler.handleAndThrow(error);
    }
  }

  /**
   * Registers a new client user.
   *
   * Endpoint: POST /client/api/v1/clients/signup
   *
   * @param data - Client sign-up data including personal and company information
   * @returns Promise resolving to the created client data
   * @throws {Error} If registration fails or request encounters an error
   */
  static async signup(data: ClientSignUpData): Promise<unknown> {
    try {
      const response = await axiosInstance.post(
        CLIENT_USER_AUTH_ROUTER_PATHS.SIGNUP,
        data
      );
      return response.data;
    } catch (error) {
      GlobalApiErrorHandler.handleAndThrow(error);
    }
  }

  /**
   * Requests an OTP (One-Time Password) for phone or email verification.
   *
   * Endpoint: POST /user/api/v1/users/signin/req/otp/{phoneOrEmail}
   *
   * @param phoneOrEmail - Phone number or email address to send OTP to
   * @returns Promise resolving to the OTP request response data
   * @throws {Error} If OTP request fails or request encounters an error
   */
  static async requestVerificationOtp(phoneOrEmail: string) {
    try {
      const response = await axiosInstance.post(
        CLIENT_USER_AUTH_ROUTER_PATHS.OTPREQUEST(phoneOrEmail)
      );
      return response.data;
    } catch (error) {
      GlobalApiErrorHandler.handleAndThrow(error);
    }
  }

  // static async verifyOtp(otp: string) {
  //   const response = await axiosInstance.post(
  //     CLIENT_USER_AUTH_ROUTER_PATHS.VERIFYOTPCLIENT(otp)
  //   );
  //   return response.headers;
  // }

  /**
   * Verifies an OTP code for client authentication.
   *
   * Endpoint: POST /user/api/v1/users/clt/signin/by-otp/{otp}
   *
   * @param phoneOrEmail - Phone number or email address used for OTP request
   * @param otp - One-time password code to verify
   * @returns Promise resolving to authentication payload with userId, role, and accessToken
   * @throws {Error} If OTP verification fails or request encounters an error
   * @remarks
   * Currently uses hardcoded userId and role. The API response headers should be updated
   * to include user-id and x-user-type headers for proper user identification.
   */
  static async verifyOtp(phoneOrEmail: string, otp: string) {
    try {
      const response = await axiosInstance.post(
        CLIENT_USER_AUTH_ROUTER_PATHS.VERIFYOTPCLIENT(otp),
        { phoneOrEmail, password: "" }
      );

      const authorization = response.headers["authorization"];
      const userId = response.headers["x-user"];
      const role = response.headers["x-user-type"];

      if (!authorization || !userId || !role) {
        console.error(
          "Authentication failed, missing headers:",
          response.headers
        );
        throw new AxiosError(
          "Authentication failed",
          "401",
          response.config,
          response.data,
          response
        );
      }

      if (!Object.values(UserRole).includes(role as unknown as UserRole)) {
        throw new AxiosError(
          "Authentication failed, invalid role",
          "401",
          response.config,
          response.data,
          response
        );
      }

      const authResponsePayload: UserSession = {
        accessToken: authorization,
        userId: userId,
        role: role as UserRole,
        initiatedAt: Date.now(),
      };

      return authResponsePayload;
    } catch (error) {
      GlobalApiErrorHandler.handleAndThrow(error);
    }
  }

  /**
   * Requests an email verification OTP (stub implementation).
   *
   * @param email - Email address to send verification OTP to
   * @returns Promise resolving to true after a simulated delay
   * @remarks This is a stub implementation for testing. Replace with actual API call when backend is ready.
   */
  static async requestEmailVerificationOtp(email: string) {
    console.log(
      `[Fake] Requesting OTP for email: ${email}, Fake delay of 2 seconds`
    );
    const response = new Promise((res) => {
      setTimeout(() => {
        res(true);
      }, 2000);
    });
    return response;
  }

  /**
   * Verifies an email verification OTP (stub implementation).
   *
   * @param email - Email address that received the OTP
   * @param otp - One-time password code to verify
   * @returns Promise resolving to true after a simulated delay
   * @remarks This is a stub implementation for testing. Replace with actual API call when backend is ready.
   */
  static async verifyEmailVerificationOtp(email: string, otp: string) {
    console.log(
      `[Fake] Verifying OTP for email: ${email} and otp: ${otp}, Fake delay of 2 seconds`
    );
    const response = new Promise((res) => {
      setTimeout(() => {
        console.log(`OTP verified successfully`);
        res(true);
      }, 2000);
    });
    return response;
  }

  /**
   * Requests a mobile verification OTP (stub implementation).
   *
   * @param mobile - Mobile phone number to send verification OTP to
   * @returns Promise resolving to true after a simulated delay
   * @remarks This is a stub implementation for testing. Replace with actual API call when backend is ready.
   */
  static async requestMobileVerificationOtp(mobile: string) {
    console.log(
      `[Fake] Requesting OTP for mobile: ${mobile}, Fake delay of 1 seconds`
    );
    const response = new Promise((res) => {
      setTimeout(() => {
        res(true);
      }, 1000);
    });
    return response;
  }

  /**
   * Verifies a mobile verification OTP (stub implementation).
   *
   * @param mobile - Mobile phone number that received the OTP
   * @param otp - One-time password code to verify
   * @returns Promise resolving to true after a simulated delay
   * @remarks This is a stub implementation for testing. Replace with actual API call when backend is ready.
   */
  static async verifyMobileVerificationOtp(mobile: string, otp: string) {
    console.log(
      `[Fake] Verifying OTP for mobile: ${mobile} and otp: ${otp}, Fake delay of 1 seconds`
    );
    const response = new Promise((res) => {
      setTimeout(() => {
        console.log(`OTP verified successfully`);
        res(true);
      }, 1000);
    });
    return response;
  }
}

export default ClientAuthAdapter;
