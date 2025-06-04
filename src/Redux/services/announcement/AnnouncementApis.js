import baseApis from '../../baseApis/baseApis';

const AnnouncementApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    getAllAnnouncement: builder.query({
      query: () => ({
        url: '/dashboard/get-announcement',
        method: 'GET',
      }),
      providesTags: ['announcement'],
    }),
    updateAnnouncement: builder.mutation({
      query: ({ data }) => ({
        url: '/dashboard/update-announcement',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['announcement'],
    }),
    updateToggle: builder.mutation({
      query: ({ data }) => ({
        url: '/dashboard/update-toggle-announcement',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['announcement'],
    }),
  }),
});

export const {
  useGetAllAnnouncementQuery,
  useUpdateAnnouncementMutation,
  useUpdateToggleMutation,
} = AnnouncementApis;
