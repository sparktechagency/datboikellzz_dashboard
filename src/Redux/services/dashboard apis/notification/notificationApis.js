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
    }),
    // updateProfileData: builder.mutation({
    //   query: (data) => {
    //     return {
    //       url: '/admin/edit-profile',
    //       method: 'PATCH',
    //       body: data,
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    //       },
    //     };
    //   },
    //   invalidatesTags: ['profile'],
    // }),
  }),
});

export const { useGetNotificationQuery, useUpdateStatusMutation } =
  notificationApis;
