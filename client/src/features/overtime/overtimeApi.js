import { apiSlice } from '../api/apiSlice';

export const overtimeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    submitOvertime: builder.mutation({
      query: (data) => ({
        url: '/overtime',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Overtime'],
    }),
    getMyOvertime: builder.query({
      query: () => '/overtime/my-overtime',
      providesTags: ['Overtime'],
    }),
    getPendingOvertime: builder.query({
      query: () => '/overtime/pending',
      providesTags: ['Overtime'],
    }),
    updateOvertimeStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/overtime/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Overtime', 'Dashboard'],
    }),
  }),
});

export const { useSubmitOvertimeMutation, useGetMyOvertimeQuery, useGetPendingOvertimeQuery, useUpdateOvertimeStatusMutation } = overtimeApi;