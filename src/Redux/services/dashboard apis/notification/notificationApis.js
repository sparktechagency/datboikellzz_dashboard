import baseApis from '../../../baseApis/baseApis';

export const notificationApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getNotification: builder.query({
      query: ({ limit }) => ({
        url: '/notification/get-all-notifications',
        method: 'GET',
        params: { limit },
      }),
      providesTags: ['notification'],
    }),
    updateStatus: builder.mutation({
      query: () => ({
        url: '/notification/update-as-mark-unread',
        method: 'PATCH',
        body: {
          isRead: true,
        },
      }),
      invalidatesTags: ['notification'],
    }),
    deleteNotification: builder.mutation({
      query: ({ data }) => ({
        url: '/notification/delete-notification',
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['notification'],
    }),
  }),
});

export const {
  useGetNotificationQuery,
  useUpdateStatusMutation,
  useDeleteNotificationMutation,
} = notificationApis;
