import baseApis from '../../../baseApis/baseApis';

const totalOverviewApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getTotalOverview: builder.query({
      query: () => ({
        url: '/dashboard/get-total-overview',
        method: 'GET',
      }),
    }),
    growthOverview: builder.query({
      query: ({ role, year }) => ({
        url: '/dashboard/get-growth',
        method: 'GET',
        params: {
          role,
          year,
        },
      }),
    }),
  }),
});

export const { useGetTotalOverviewQuery, useGrowthOverviewQuery } =
  totalOverviewApis;
