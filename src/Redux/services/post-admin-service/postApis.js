import baseApis from '../../baseApis/baseApis';

const postApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getPost: builder.query({
      query: ({ targetUser }) => ({
        url: '/post/get-all-posts-admin',
        method: 'GET',
        params: { targetUser },
      }),
      providesTags: ['post'],
    }),
    deletePost: builder.mutation({
      query: ({ postId }) => ({
        url: '/post/delete-post',
        method: 'DELETE',
        body: {
          postId: postId,
        },
      }),
      invalidatesTags: ['post'],
    }),
  }),
});

export const { useGetPostQuery, useDeletePostMutation } = postApis;
