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
    singlePostGet: builder.query({
      query: ({ postId }) => ({
        url: '/post/get-post',
        method: 'GET',
        params: { postId },
      }),
      providesTags: ['post'],
    }),
    createPost: builder.mutation({
      query: ({ data }) => ({
        url: '/post/post-post',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['post'],
    }),
    updatePost: builder.mutation({
      query: ({ data }) => ({
        url: '/post/update-post',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['post'],
    }),
    postType: builder.query({
      query: () => ({
        url: '/post/get-all-unique-types',
        method: 'GET',
      }),
      providesTags: ['postType'],
    }),
  }),
});

export const {
  useGetPostQuery,
  useDeletePostMutation,
  useSinglePostGetQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  usePostTypeQuery
} = postApis;
