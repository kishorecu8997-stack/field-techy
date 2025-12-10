import axiosInstance from "@/axiosInstance";
import { CLIENT_ROUTER_PATHS } from "./clientRouterPaths";
import type { LoginFormData } from "@/pages/engineer/auth/components/types";

export interface ClientData {
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

export interface ClientPaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: "ASC" | "DESC";
}

export class ClientAdapter {
  static async signup(data: ClientData): Promise<ClientData> {
    const response = await axiosInstance.post(CLIENT_ROUTER_PATHS.SIGNUP, data);
    return response.data;
  }

  static async signin(data: LoginFormData) {
    const payload = {
       phoneOrEmail: data.email,
       password: data.password
    }
    const response = await axiosInstance.post(CLIENT_ROUTER_PATHS.SIGNIN, payload);
    return response.data;
 }

  static async getById(id: string): Promise<ClientData> {
    const response = await axiosInstance.get(CLIENT_ROUTER_PATHS.GET_BY_ID(id));
    return response.data;
  }

  static async getAll(params: ClientPaginationParams = {}): Promise<any> {
    const { page = 0, size = 10, sortBy = "createdAt", direction = "DESC" } = params;
    const response = await axiosInstance.get(CLIENT_ROUTER_PATHS.GET_PAGED, {
      params: { page, size, sortBy, direction },
    });
    return response.data;
  }

  static async update(id: string, data: ClientData): Promise<ClientData> {
    const response = await axiosInstance.put(CLIENT_ROUTER_PATHS.UPDATE(id), data);
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await axiosInstance.delete(CLIENT_ROUTER_PATHS.DELETE(id));
  }
}
