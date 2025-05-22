import baseApis from '../../../baseApis/baseApis';

export const adminApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getAllAdmins: builder.query({
      query: () => ({
        url: '/admin/get-all-admins',
        method: 'GET',
      }),
    }),
    createNewAdmin: builder.mutation({
      query: (data) => ({
        url: '/admin/post-admin',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useCreateNewAdminMutation, useGetAllAdminsQuery } = adminApis;
