import { apiSlice } from '../api/apiSlice';

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeDashboard: builder.query({
      query: () => '/dashboard/employee',
      providesTags: ['Dashboard'],
    }),
    getManagerDashboard: builder.query({
      query: () => '/dashboard/manager',
      providesTags: ['Dashboard'],
    }),
    getAdminDashboard: builder.query({
      query: () => '/dashboard/admin',
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { 
  useGetEmployeeDashboardQuery, 
  useGetManagerDashboardQuery, 
  useGetAdminDashboardQuery 
} = dashboardApi;
