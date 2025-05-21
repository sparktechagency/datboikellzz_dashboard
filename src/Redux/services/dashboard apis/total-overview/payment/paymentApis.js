import baseApis from '../../../../baseApis/baseApis';

export const paymentApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getPayment: builder.query({
      query: ({ searchTerm, page }) => ({
        url: '/payment/get-all-payment',
        method: 'GET',
        params: { searchTerm, page },
      }),
      providesTags: ['payment'],
    }),
  }),
});

export const { useGetPaymentQuery } = paymentApis;
