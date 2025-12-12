import axiosInstance from "@/axiosInstance";
import { CLIENT_USER_AUTH_ROUTER_PATHS } from "./clientAuthRouterPaths";
import type { ClientSignUpData } from "./clientAuthTypes";



export class ClientAuthAdapter {
	static async signIn(args: { phoneOrEmail: string, password: string }) {
		const response = await axiosInstance.post(CLIENT_USER_AUTH_ROUTER_PATHS.LOGIN, args);
		return response.data
	}

	static async signup(data: ClientSignUpData): Promise<unknown> {
		const response = await axiosInstance.post(CLIENT_USER_AUTH_ROUTER_PATHS.SIGNUP, data);
		return response.data;
	}

	static async requestEmailVerificationOtp(email: string) {
		console.log(`[Fake] Requesting OTP for email: ${email}, Fake delay of 2 seconds`)
		const response = new Promise((res) => {
			setTimeout(() => {
				res(true);
			}, 2000);
		})
		return response;
	}

	static async verifyEmailVerificationOtp(email: string, otp: string) {
		console.log(`[Fake] Verifying OTP for email: ${email} and otp: ${otp}, Fake delay of 2 seconds`)
		const response = new Promise((res) => {
			setTimeout(() => {
				console.log(`OTP verified successfully`)
				res(true);
			}, 2000);
		})
		return response;
	}

	static async requestMobileVerificationOtp(mobile: string) {
		console.log(`[Fake] Requesting OTP for mobile: ${mobile}, Fake delay of 1 seconds`)
		const response = new Promise((res) => {
			setTimeout(() => {
				res(true);
			}, 1000);
		})
		return response;
	}

	static async verifyMobileVerificationOtp(mobile: string, otp: string) {
		console.log(`[Fake] Verifying OTP for mobile: ${mobile} and otp: ${otp}, Fake delay of 1 seconds`)
		const response = new Promise((res) => {
			setTimeout(() => {
				console.log(`OTP verified successfully`)
				res(true);
			}, 1000);
		})
		return response;
	}
}

export default ClientAuthAdapter