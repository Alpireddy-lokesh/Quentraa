import axios, { AxiosInstance } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT if present (stub; real impl reads from localStorage/cookies)
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface TokenDTO {
  id: string;
  branchId?: string;
  serviceId?: string;
  tokenNumber: string;
  status: string;
  visitorName?: string;
  visitorPhone?: string;
  counterId?: string;
  calledAt?: string;
  servingAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BranchDTO {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  active: boolean;
}

export interface ServiceDTO {
  id: string;
  departmentId?: string;
  name: string;
  description?: string;
  avgServiceMinutes: number;
  active: boolean;
}

export interface UserDTO {
  id: string;
  email: string;
  fullName: string;
  role: string;
  branchId?: string;
}

export function mapTokenFromApi(data: any): TokenDTO {
  return {
    id: data.id,
    branchId: data.branchId,
    serviceId: data.serviceId,
    tokenNumber: data.tokenNumber,
    status: data.status,
    visitorName: data.visitorName,
    visitorPhone: data.visitorPhone,
    counterId: data.counterId,
    calledAt: data.calledAt,
    servingAt: data.servingAt,
    completedAt: data.completedAt,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}
