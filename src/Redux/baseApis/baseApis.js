import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { url } from '../../Utils/server';

const baseApis = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: url,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  }),
  tagTypes: [
    'profile',
    'privacyPolicy',
    'termsAndConditions',
    'faq',
    'payment',
    'notification',
    'subscription',
    'admin',
    'user',
    'post',
    'postType',
    'announcement'
  ],
  endpoints: () => ({}),
});

export default baseApis;
