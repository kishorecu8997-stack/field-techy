import axiosInstance from "@/axiosInstance";
import { CLIENT_USER_ROUTER_PATHS } from "./clientRouterPaths";

export interface ClientUser {
	id: string;
	name: string;
	email: string;
}

export class ClientUserAdapter {
	static async getClientUserById(id: string): Promise<ClientUser> {
		const response = await axiosInstance.get(CLIENT_USER_ROUTER_PATHS.GET_CLIENT_USER_BY_ID(id));

		const transformed = { id: "sie", name: "Some Name", email: "" }

		return {
			id: transformed.id,
			name: transformed.name,
			email: transformed.email,
		}
	}

	
}