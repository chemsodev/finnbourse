/**
 * stockService.ts
 * -----------------------
 * Service for stock-related API calls
 */

import { clientFetchREST } from "@/app/actions/fetchREST";

// Define the Stock type
export interface Stock {
  id: string;
  name: string;
  issuer?: string;
  isincode?: string;
  isinCode?: string;
  facevalue?: number;
  faceValue?: number;
  quantity?: number;
  emissiondate?: string;
  emissionDate?: string;
  maturitydate?: string;
  maturityDate?: string;
  enjoymentdate?: string;
  fixedRate?: number;
  variableRate?: number;
  yieldRate?: number;
  dividendRate?: number;
  commission?: number;
  couponschedule?: any[];
  issuer_name?: string;
  marketMetadata?: {
    faceValue: number;
  };
  type?: string;
  price?: number;
  status?: string;
}

// Legacy API interfaces for compatibility
export const stockAPI = {
  getAll: (token?: string) => clientFetchREST("/api/v1/stock", { token }),
  getById: (id: string, token?: string) =>
    clientFetchREST(`/api/v1/stock/${id}`, { token }),
  getPrimaryClosing: (token?: string) =>
    clientFetchREST("/api/v1/stock/primary-closing", { token }),
  moveToSecondary: (id: string, token?: string) =>
    clientFetchREST(`/api/v1/stock/${id}/move-to-secondary`, {
      method: "PUT",
      token,
    }),
  suspend: (id: string, token?: string) =>
    clientFetchREST(`/api/v1/stock/${id}/suspend`, { method: "PUT", token }),
  activate: (id: string, token?: string) =>
    clientFetchREST(`/api/v1/stock/${id}/activate`, { method: "PUT", token }),
  update: (id: string, data: any, token?: string) =>
    clientFetchREST(`/api/v1/stock/${id}`, {
      method: "PUT",
      body: data,
      token,
    }),
};

export const stockTypeAPI = {
  action: {
    getAll: (token?: string) =>
      clientFetchREST("/api/v1/stock/action", { token }),
    getById: (id: string, token?: string) =>
      clientFetchREST(`/api/v1/stock/action/${id}`, { token }),
    getPrimaryClosing: (token?: string) =>
      clientFetchREST("/api/v1/stock/action/primary-closing", { token }),
    moveToSecondary: (id: string, token?: string) =>
      clientFetchREST(`/api/v1/stock/action/${id}/move-to-secondary`, {
        method: "PUT",
        token,
      }),
    suspend: (id: string, token?: string) =>
      clientFetchREST(`/api/v1/stock/action/${id}/suspend`, {
        method: "PUT",
        token,
      }),
    activate: (id: string, token?: string) =>
      clientFetchREST(`/api/v1/stock/action/${id}/activate`, {
        method: "PUT",
        token,
      }),
    update: (id: string, data: any, token?: string) =>
      clientFetchREST(`/api/v1/stock/action/${id}`, {
        method: "PUT",
        body: data,
        token,
      }),
    create: (data: any, token?: string) =>
      clientFetchREST("/api/v1/stock/action", {
        method: "POST",
        body: data,
        token,
      }),
  },
  obligation: {
    getAll: (token?: string) =>
      clientFetchREST("/api/v1/stock/obligation", { token }),
    getById: (id: string, token?: string) =>
      clientFetchREST(`/api/v1/stock/obligation/${id}`, { token }),
    getPrimaryClosing: (token?: string) =>
      clientFetchREST("/api/v1/stock/obligation/primary-closing", { token }),
    moveToSecondary: (id: string, token?: string) =>
      clientFetchREST(`/api/v1/stock/obligation/${id}/move-to-secondary`, {
        method: "PUT",
        token,
      }),
    suspend: (id: string, token?: string) =>
      clientFetchREST(`/api/v1/stock/obligation/${id}/suspend`, {
        method: "PUT",
        token,
      }),
    activate: (id: string, token?: string) =>
      clientFetchREST(`/api/v1/stock/obligation/${id}/activate`, {
        method: "PUT",
        token,
      }),
    update: (id: string, data: any, token?: string) =>
      clientFetchREST(`/api/v1/stock/obligation/${id}`, {
        method: "PUT",
        body: data,
        token,
      }),
    create: (data: any, token?: string) =>
      clientFetchREST("/api/v1/stock/obligation", {
        method: "POST",
        body: data,
        token,
      }),
  },
  sukuk: {
    getAll: (token?: string) =>
      clientFetchREST("/api/v1/stock/sukuk", { token }),
    getById: (id: string, token?: string) =>
      clientFetchREST(`/api/v1/stock/sukuk/${id}`, { token }),
    getPrimaryClosing: (token?: string) =>
      clientFetchREST("/api/v1/stock/sukuk/primary-closing", { token }),
    moveToSecondary: (id: string, token?: string) =>
      clientFetchREST(`/api/v1/stock/sukuk/${id}/move-to-secondary`, {
        method: "PUT",
        token,
      }),
    suspend: (id: string, token?: string) =>
      clientFetchREST(`/api/v1/stock/sukuk/${id}/suspend`, {
        method: "PUT",
        token,
      }),
    activate: (id: string, token?: string) =>
      clientFetchREST(`/api/v1/stock/sukuk/${id}/activate`, {
        method: "PUT",
        token,
      }),
    update: (id: string, data: any, token?: string) =>
      clientFetchREST(`/api/v1/stock/sukuk/${id}`, {
        method: "PUT",
        body: data,
        token,
      }),
    create: (data: any, token?: string) =>
      clientFetchREST("/api/v1/stock/sukuk", {
        method: "POST",
        body: data,
        token,
      }),
  },
  participatif: {
    getAll: (token?: string) =>
      clientFetchREST("/api/v1/stock/participatif", { token }),
    getById: (id: string, token?: string) =>
      clientFetchREST(`/api/v1/stock/participatif/${id}`, { token }),
    getPrimaryClosing: (token?: string) =>
      clientFetchREST("/api/v1/stock/participatif/primary-closing", { token }),
    moveToSecondary: (id: string, token?: string) =>
      clientFetchREST(`/api/v1/stock/participatif/${id}/move-to-secondary`, {
        method: "PUT",
        token,
      }),
    suspend: (id: string, token?: string) =>
      clientFetchREST(`/api/v1/stock/participatif/${id}/suspend`, {
        method: "PUT",
        token,
      }),
    activate: (id: string, token?: string) =>
      clientFetchREST(`/api/v1/stock/participatif/${id}/activate`, {
        method: "PUT",
        token,
      }),
    update: (id: string, data: any, token?: string) =>
      clientFetchREST(`/api/v1/stock/participatif/${id}`, {
        method: "PUT",
        body: data,
        token,
      }),
    create: (data: any, token?: string) =>
      clientFetchREST("/api/v1/stock/participatif", {
        method: "POST",
        body: data,
        token,
      }),
  },
};

export const stockPriceAPI = {
  getHistory: (stockId: string, token?: string) =>
    clientFetchREST(`/api/v1/stock/${stockId}/price-history`, { token }),
  add: (stockId: string, data: any, token?: string) =>
    clientFetchREST(`/api/v1/stock/${stockId}/price`, {
      method: "POST",
      body: data,
      token,
    }),
  update: (priceId: string, data: any, token?: string) =>
    clientFetchREST(`/api/v1/stock-price/${priceId}`, {
      method: "PUT",
      body: data,
      token,
    }),
  delete: (priceId: string, token?: string) =>
    clientFetchREST(`/api/v1/stock-price/${priceId}`, {
      method: "DELETE",
      token,
    }),
};

// Modern REST API service that doesn't require tokens in every call
export const stockService = {
  // Action endpoints
  action: {
    getAll: () => clientFetchREST("/stock/action", {}),
    getById: (id: string) => clientFetchREST(`/stock/action/${id}`, {}),
  },

  // Obligation endpoints
  obligation: {
    getAll: () => clientFetchREST("/stock/obligation", {}),
    getById: (id: string) => clientFetchREST(`/stock/obligation/${id}`, {}),
    moveToSecondary: (id: string) =>
      clientFetchREST(`/stock/obligation/${id}/move-to-secondary`, {
        method: "PUT",
      }),
    suspend: (id: string) =>
      clientFetchREST(`/stock/obligation/${id}/suspend`, {
        method: "PUT",
      }),
    activate: (id: string) =>
      clientFetchREST(`/stock/obligation/${id}/activate`, {
        method: "PUT",
      }),
    update: (id: string, data: any) =>
      clientFetchREST(`/stock/obligation/${id}`, {
        method: "PUT",
        body: data,
      }),
    create: (data: any) =>
      clientFetchREST("/stock/obligation", {
        method: "POST",
        body: data,
      }),
  },

  // Sukuk endpoints
  sukuk: {
    getAll: () => clientFetchREST("/stock/sukuk", {}),
    getById: (id: string) => clientFetchREST(`/stock/sukuk/${id}`, {}),
    moveToSecondary: (id: string) =>
      clientFetchREST(`/stock/sukuk/${id}/move-to-secondary`, {
        method: "PUT",
      }),
    suspend: (id: string) =>
      clientFetchREST(`/stock/sukuk/${id}/suspend`, { method: "PUT" }),
    activate: (id: string) =>
      clientFetchREST(`/stock/sukuk/${id}/activate`, { method: "PUT" }),
    update: (id: string, data: any) =>
      clientFetchREST(`/stock/sukuk/${id}`, {
        method: "PUT",
        body: data,
      }),
    create: (data: any) =>
      clientFetchREST("/stock/sukuk", { method: "POST", body: data }),
  },

  // Participatif endpoints
  participatif: {
    getAll: () => clientFetchREST("/stock/participatif", {}),
    getById: (id: string) => clientFetchREST(`/stock/participatif/${id}`, {}),
    moveToSecondary: (id: string) =>
      clientFetchREST(`/stock/participatif/${id}/move-to-secondary`, {
        method: "PUT",
      }),
    suspend: (id: string) =>
      clientFetchREST(`/stock/participatif/${id}/suspend`, {
        method: "PUT",
      }),
    activate: (id: string) =>
      clientFetchREST(`/stock/participatif/${id}/activate`, {
        method: "PUT",
      }),
    update: (id: string, data: any) =>
      clientFetchREST(`/stock/participatif/${id}`, {
        method: "PUT",
        body: data,
      }),
    create: (data: any) =>
      clientFetchREST("/stock/participatif", {
        method: "POST",
        body: data,
      }),
  },
};

export default stockService;
