import { apiSlice } from '../api/apiSlice';

export const attendanceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    punchIn: builder.mutation({
      query: (data) => ({
        url: '/attendance/punch-in',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Attendance'],
    }),
    punchOut: builder.mutation({
      query: (data) => ({
        url: '/attendance/punch-out',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Attendance'],
    }),
    getTodayAttendance: builder.query({
      query: () => '/attendance/today',
      providesTags: ['Attendance'],
    }),
    getAttendanceHistory: builder.query({
      query: () => '/attendance/history',
      providesTags: ['Attendance'],
    }),
    getAllAttendance: builder.query({
      query: () => '/attendance/all',
      providesTags: ['Attendance'],
    })
  }),
});

export const { usePunchInMutation, usePunchOutMutation, useGetTodayAttendanceQuery, useGetAttendanceHistoryQuery, useGetAllAttendanceQuery } = attendanceApi;