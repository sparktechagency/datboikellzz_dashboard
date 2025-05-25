import baseApis from '../../../baseApis/baseApis';

const feedbackApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getAllFeedback: builder.query({
      query: ({ searchTerm, limit, page }) => ({
        url: '/feedback/get-all-feedbacks',
        method: 'GET',
        params: { searchTerm, limit, page },
      }),
    }),
    deleteFeedback: builder.mutation({
      query: ({ data }) => ({
        url: '/feedback/delete-feedback',
        method: 'DELETE',
        body: data,
      }),
    }),
    createFeedback: builder.mutation({
      query: ({ data }) => ({
        url: '/feedback/create-feedback',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAllFeedbackQuery,
  useDeleteFeedbackMutation,
  useCreateFeedbackMutation,
} = feedbackApis;
