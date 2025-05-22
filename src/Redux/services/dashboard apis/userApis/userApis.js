import baseApis from '../../../baseApis/baseApis';

export const userApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getAllUser: builder.query({
      query: ({ searchTerm }) => ({
        url: '/user/get-all-users',
        method: 'GET',
        params: { searchTerm },
      }),
    }),
    updateUserStatus: builder.mutation({
      query: ({ data }) => ({
        url: `/dashboard/block-unblock-user-driver`,
        method: 'PATCH',
        body: data,
      }),
    }),
    getSingleUserOrDriver: builder.query({
      query: ({ id }) => ({
        url: `/dashboard/get-user`,
        method: 'GET',
        params: { userId: id },
      }),
    }),
  }),
});

export const {
  useGetAllUserQuery,
  useUpdateUserStatusMutation,
  useGetSingleUserOrDriverQuery,
} = userApis;
