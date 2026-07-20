import { apiSlice } from '../api/apiSlice';

export const reportsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAttendanceReports: builder.query({
      query: (params) => ({
        url: '/reports/attendance',
        params: params // This will automatically append ?startDate=...&status=...
      }),
      providesTags: ['Attendance'], // So it refetches when attendance changes
    }),
  }),
});

export const { useGetAttendanceReportsQuery } = reportsApi;
