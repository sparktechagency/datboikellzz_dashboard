import baseApis from '../../../baseApis/baseApis';

export const subscriptionApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubscription: builder.query({
      query: () => ({
        url: '/subscription-plan/get-all-subscriptionPlans',
        method: 'GET',
      }),
      providesTags: ['subscription'],
    }),
    updateSubscription: builder.mutation({
      query: ({ data }) => ({
        url: '/subscription-plan/update-subscriptionPlan',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['subscription'],
    }),
  }),
});

export const { useGetAllSubscriptionQuery, useUpdateSubscriptionMutation } =
  subscriptionApis;
