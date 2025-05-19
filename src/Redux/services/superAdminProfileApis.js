import baseApis from '../baseApis/baseApis';

export const superAdminProfileApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getSuperAdminProfile: builder.query({
      query: () => ({
        url: '/super-admin/profile',
        method: 'GET',
      }),
      providesTags: ['profile'],
    }),
    updateProfileData: builder.mutation({
      query: (data) => {
        return {
          url: '/super-admin/profile',
          method: 'PATCH',
          body: data,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        };
      },
      invalidatesTags: ['profile'],
    }),
  }),
});

export const { useGetSuperAdminProfileQuery, useUpdateProfileDataMutation } =
  superAdminProfileApis;
