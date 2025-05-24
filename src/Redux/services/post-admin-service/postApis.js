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
  }),
});

export const { useGetPostQuery } = postApis;
