import baseApis from '../baseApis/baseApis';

export const profileApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getProfileData: builder.query({
      query: () => ({
        url: '/admin/get-profile-admin',
        method: 'GET',
      }),
      providesTags: ['profile'],
    }),
  }),
});

export const { useGetProfileDataQuery } =
  profileApis;
