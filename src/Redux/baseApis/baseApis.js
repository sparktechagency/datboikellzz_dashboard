import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseApis = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
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
  ],
  endpoints: () => ({}),
});

export default baseApis;
