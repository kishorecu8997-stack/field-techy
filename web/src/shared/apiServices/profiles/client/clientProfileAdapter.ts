import axiosInstance from "@/axiosInstance";
import { CLIENT_PROFILE_ROUTER_PATHS } from "./clientProfileRouterPaths";

export interface ClientProfileData {
    id?: string;
    phoneNumber?: string;
    email?: string;
    password?: string | null;
    clientType?: string;
    companyName?: string;
    contactPersonName?: string;
    businessType?: string;
    industry?: string;
    address?: string;
    country?: string;
    state?: string;
    city?: string;
    postalCode?: string;
    taxDocumentVat?: string;
    vatRegistrationNumber?: string;
    profilePicture?: string;
    governmentIdProofDocument?: string;
    certificationQualificationsDocument?: string;
    enableNotifications?: boolean;
    isApproved?: boolean;
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
        const response = await axiosInstance.post(CLIENT_PROFILE_ROUTER_PATHS.SIGNUP, data);
        return response.data;
    }

    static async getById(id: string): Promise<ClientProfileData> {
        const response = await axiosInstance.get(CLIENT_PROFILE_ROUTER_PATHS.GET_BY_ID(id));
        return response.data;
    }

    static async getAll(params: ClientProfilePaginationParams = {}): Promise<unknown> {
        const { page = 0, size = 10, sortBy = "createdAt", direction = "DESC" } = params;
        const response = await axiosInstance.get(CLIENT_PROFILE_ROUTER_PATHS.GET_PAGED, {
            params: { page, size, sortBy, direction },
        });
        return response.data;
    }

    static async update(id: string, data: ClientProfileData): Promise<ClientProfileData> {
        const response = await axiosInstance.put(CLIENT_PROFILE_ROUTER_PATHS.UPDATE(id), data);
        return response.data;
    }

    static async delete(id: string): Promise<void> {
        await axiosInstance.delete(CLIENT_PROFILE_ROUTER_PATHS.DELETE(id));
    }
}
