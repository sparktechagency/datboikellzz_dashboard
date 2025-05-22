import baseApis from '../../../baseApis/baseApis';

export const adminApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getAllAdmins: builder.query({
      query: () => ({
        url: '/admin/get-all-admins',
        method: 'GET',
      }),
      providesTags: ['admin'],
    }),
    createNewAdmin: builder.mutation({
      query: (data) => ({
        url: '/admin/post-admin',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['admin'],
    }),
    updateAdmin: builder.mutation({
      query: ({ data }) => ({
        url: '/admin/update-admin',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['admin'],
    }),
  }),
});

export const {
  useCreateNewAdminMutation,
  useGetAllAdminsQuery,
  useUpdateAdminMutation,
} = adminApis;
