import baseApis from '../../baseApis/baseApis';

export const faqApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    allFaq: builder.query({
      query: () => ({
        url: '/manage/get-faq',
        method: 'GET',
      }),
      providesTags: ['faq'],
    }),
    createFaq: builder.mutation({
      query: ({ data }) => ({
        url: '/manage/add-faq',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['faq'],
    }),
    updateFaq: builder.mutation({
      query: ({ faqId, data }) => ({
        url: '/manage/update-faq',
        method: 'PATCH',
        body: { faqId, ...data },
      }),
      invalidatesTags: ['faq'],
    }),
    deleteFaq: builder.mutation({
      query: ({ faqId }) => ({
        url: '/manage/delete-faq',
        method: 'DELETE',
        params: {faqId},
      }),
      invalidatesTags: ['faq'],
    }),
  }),
});

export const {
  useAllFaqQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = faqApis;
