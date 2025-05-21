import baseApis from '../../../baseApis/baseApis';

const earningsGrowthApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getEarnings: builder.query({
      query: ({ role, year }) => ({
        url: '/dashboard/get-revenue',
        method: 'GET',
        params: {
          role,
          year,
        },
      }),
    }),
  }),
});

export const { useGetEarningsQuery } = earningsGrowthApis;
