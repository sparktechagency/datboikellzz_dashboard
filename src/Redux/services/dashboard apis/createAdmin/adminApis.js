import baseApis from '../../../baseApis/baseApis';

export const adminApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getAllAdmins: builder.query({
      query: ({ searchTerm, page }) => ({
        url: '/admin/get-all-admins',
        method: 'GET',
        params: { searchTerm, page },
      }),
      providesTags: ['admin'],
    }),
    createNewAdmin: builder.mutation({
      query: (data) => {
        console.log('createNewAdmin data:', data);
        return {
          url: '/admin/post-admin',
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['admin'],
    }),
    updateAdmin: builder.mutation({
      query: ({ data }) => {
        console.log('updateAdmin data:', data);
        return {
          url: '/admin/update-admin',
          method: 'PATCH',
          body: data,
        };
      },
      invalidatesTags: ['admin'],
    }),
    passwordChange: builder.mutation({
      query: ({ data }) => ({
        url: '/admin/update-admin-password',
        method: 'PATCH',
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateNewAdminMutation,
  useGetAllAdminsQuery,
  useUpdateAdminMutation,
  usePasswordChangeMutation,
} = adminApis;
