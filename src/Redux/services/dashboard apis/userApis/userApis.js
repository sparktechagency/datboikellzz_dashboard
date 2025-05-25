import baseApis from '../../../baseApis/baseApis';

export const userApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getAllUser: builder.query({
      query: ({ searchTerm, limit }) => ({
        url: '/user/get-all-users',
        method: 'GET',
        params: { searchTerm, limit },
      }),
      providesTags: ['user'],
    }),
    blockUser: builder.mutation({
      query: ({ data }) => ({
        url: '/user/update-block-unblock-user',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['user'],
    }),
  }),
});

export const { useGetAllUserQuery, useBlockUserMutation } = userApis;
