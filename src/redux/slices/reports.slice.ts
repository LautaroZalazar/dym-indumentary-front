import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AUTH_HEADERS } from '../constants/custom-headers';

const baseUrl = import.meta.env.VITE_BACK_URL;

export type ReportPeriod = 'day' | 'month' | 'year' | 'all';

export interface ReportParams {
  period?: ReportPeriod;
  date?: string;
}

export interface SalesSummary {
  totalRevenue: number;
  orderCount: number;
  avgOrderValue: number;
  completedOrders: number;
  cancelledOrders: number;
}

export interface SalesChartPoint {
  label: string;
  revenue: number;
  orders: number;
}

export interface SalesOrderRow {
  _id: string;
  orderNumber?: number;
  total: number;
  status: string;
  createdAt: string;
}

export interface SalesReportData {
  summary: SalesSummary;
  chart: SalesChartPoint[];
  orders: SalesOrderRow[];
}

export interface InventorySummary {
  totalProducts: number;
  totalUnits: number;
  lowStockItems: number;
  totalVariants: number;
}

export interface InventoryProductRow {
  productId: string;
  name: string;
  price: number;
  totalStock: number;
  minStock: number;
  variants: number;
  isLowStock: boolean;
}

export interface InventoryReportData {
  summary: InventorySummary;
  products: InventoryProductRow[];
}

export interface TopProductsSummary {
  totalUnitsSold: number;
  totalRevenue: number;
}

export interface TopProductRow {
  productId: string;
  name: string;
  unitsSold: number;
  revenue: number;
}

export interface TopProductsReportData {
  summary: TopProductsSummary;
  products: TopProductRow[];
}

export const reportsSlice = createApi({
  reducerPath: 'reportsSlice',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    fetchSalesReport: builder.query<SalesReportData, ReportParams>({
      query: ({ period = 'all', date }) => {
        const params = new URLSearchParams();
        params.append('period', period);
        if (date) params.append('date', date);
        return {
          url: `/v1/admin/reports/sales?${params.toString()}`,
          method: 'GET',
          headers: AUTH_HEADERS,
        };
      },
    }),
    fetchInventoryReport: builder.query<InventoryReportData, void>({
      query: () => ({
        url: '/v1/admin/reports/inventory',
        method: 'GET',
        headers: AUTH_HEADERS,
      }),
    }),
    fetchTopProductsReport: builder.query<TopProductsReportData, ReportParams>({
      query: ({ period = 'all', date }) => {
        const params = new URLSearchParams();
        params.append('period', period);
        if (date) params.append('date', date);
        return {
          url: `/v1/admin/reports/top-products?${params.toString()}`,
          method: 'GET',
          headers: AUTH_HEADERS,
        };
      },
    }),
  }),
});

export const {
  useFetchSalesReportQuery,
  useFetchInventoryReportQuery,
  useFetchTopProductsReportQuery,
} = reportsSlice;
