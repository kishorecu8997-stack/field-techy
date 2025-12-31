import axiosInstance from "@/axiosInstance";
import { CLIENT_USER_AUTH_ROUTER_PATHS } from "./clientAuthRouterPaths";
import type { ClientSignUpData } from "./clientAuthTypes";

export class ClientAuthAdapter {
  static async signIn(args: { phoneOrEmail: string; password: string }) {
    const response = await axiosInstance.post(
      CLIENT_USER_AUTH_ROUTER_PATHS.LOGIN,
      args
    );
    return response.data;
  }

  static async signup(data: ClientSignUpData): Promise<unknown> {
    const response = await axiosInstance.post(
      CLIENT_USER_AUTH_ROUTER_PATHS.SIGNUP,
      data
    );
    return response.data;
  }

  static async requestVerificationOtp(phoneOrEmail: string) {
    const response = await axiosInstance.post(
      CLIENT_USER_AUTH_ROUTER_PATHS.OTPREQUEST(phoneOrEmail)
    );
    return response.data;
  }

  // static async verifyOtp(otp: string) {
  //   const response = await axiosInstance.post(
  //     CLIENT_USER_AUTH_ROUTER_PATHS.VERIFYOTPCLIENT(otp)
  //   );
  //   return response.headers;
  // }

  static async verifyOtp(phoneOrEmail: string, otp: string) {
    const response = await axiosInstance.post(
      CLIENT_USER_AUTH_ROUTER_PATHS.VERIFYOTPCLIENT(otp),
      { phoneOrEmail, password: "" }
    );

    //FIXME: Need to update api response header once the api is updated
    // const userID = response.headers["user-id"];
    // const role = response.headers["x-user-type"];

    const authorization = response.headers["authorization"];

    // TODO: Need to update api response header once the api is updated
    const payload = {
      userId: "1",
      role: "CLIENT",
      accessToken: authorization,
    };
    console.log("payload :", payload);

    return payload;
  }

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
