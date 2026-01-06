import axiosInstance from "@/axiosInstance";
import { ENGINEER_USER_AUTH_ROUTER_PATHS } from "./engineerAuthRouterPaths";
import type { EngineerSignUpData } from "./engineerAuthTypes";
import type { UserSession } from "@/shared/store/useUserSessionStore";
import { AxiosError } from "axios";
import { UserRole } from "@/shared/enums/users";
import { GlobalApiErrorHandler } from "@/shared/apiServices/utils";

/**
 * EngineerAuthAdapter
 *
 * Handles authentication-related API calls for engineer users.
 * Provides methods for sign-in, sign-up, OTP verification, and related operations.
 */
export class EngineerAuthAdapter {
  /**
   * Authenticates an engineer user with phone/email and password.
   *
   * Endpoint: POST /user/api/v1/users/eng/signin
   *
   * @param args - Authentication credentials
   * @param args.phoneOrEmail - Phone number or email address of the engineer
   * @param args.password - User's password
   * @returns Promise resolving to the authentication response data
   * @throws {Error} If authentication fails or request encounters an error
   */
  static async signIn(args: { phoneOrEmail: string; password: string }) {
    try {
      const response = await axiosInstance.post(
        ENGINEER_USER_AUTH_ROUTER_PATHS.LOGIN,
        args
      );

      // Axios normalizes all response header names to lowercase, so accessing
      // them with lowercase keys (e.g. "authorization", "x-user", "x-user-type")
      // is intentional and safe here.
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
          undefined,
          response.config,
          response.request,
          {
            ...response,
            status: 401,
            statusText: "Unauthorized",
          }
        );
      }

      if (!Object.values(UserRole).includes(role as unknown as UserRole)) {
        throw new AxiosError(
          "Authentication failed, invalid role",
          undefined,
          response.config,
          response.request,
          {
            ...response,
            status: 401,
            statusText: "Unauthorized",
          }
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
   * Registers a new engineer user.
   *
   * Endpoint: POST /engineer/api/v1/engineers/signup
   *
   * @param data - Engineer sign-up data including personal information
   * @returns Promise resolving to the created engineer data
   * @throws {Error} If registration fails or request encounters an error
   */
  static async signup(data: EngineerSignUpData): Promise<unknown> {
    try {
      const response = await axiosInstance.post(
        ENGINEER_USER_AUTH_ROUTER_PATHS.SIGNUP,
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
        ENGINEER_USER_AUTH_ROUTER_PATHS.OTPREQUEST(phoneOrEmail)
      );
      return response.data;
    } catch (error) {
      GlobalApiErrorHandler.handleAndThrow(error);
    }
  }

  /**
   * Verifies an OTP code for engineer authentication.
   *
   * Endpoint: POST /user/api/v1/users/eng/signin/by-otp/{otp}
   *
   * @param phoneOrEmail - Phone number or email address used for OTP request
   * @param otp - One-time password code to verify
   * @returns Promise resolving to authentication payload with userId, role, and accessToken
   * @throws {Error} If OTP verification fails or request encounters an error
   * @remarks
   * Currently uses hardcoded userId and role. The API response headers should be updated
   * to include x-user and x-user-type headers for proper user identification.
   */
  static async verifyOtp(phoneOrEmail: string, otp: string) {
    try {
      const response = await axiosInstance.post(
        ENGINEER_USER_AUTH_ROUTER_PATHS.VERIFYOTPENGINEER(otp),
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
          undefined,
          response.config,
          response.request,
          {
            ...response,
            status: 401,
            statusText: "Unauthorized",
          }
        );
      }

      if (!Object.values(UserRole).includes(role as unknown as UserRole)) {
        throw new AxiosError(
          "Authentication failed, invalid role",
          undefined,
          response.config,
          response.request,
          {
            ...response,
            status: 401,
            statusText: "Unauthorized",
          }
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

export default EngineerAuthAdapter;
