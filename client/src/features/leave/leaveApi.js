import { apiSlice } from '../api/apiSlice';

export const leaveApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    applyLeave: builder.mutation({
      query: (data) => ({
        url: '/leaves',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Leave'],
    }),
    getMyLeaves: builder.query({
      query: () => '/leaves/my-leaves',
      providesTags: ['Leave'],
    }),
    getPendingLeaves: builder.query({
      query: () => '/leaves/pending',
      providesTags: ['Leave'],
    }),
    updateLeaveStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/leaves/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Leave', 'Dashboard'],
    }),
  }),
});

export const { useApplyLeaveMutation, useGetMyLeavesQuery, useGetPendingLeavesQuery, useUpdateLeaveStatusMutation } = leaveApi;
