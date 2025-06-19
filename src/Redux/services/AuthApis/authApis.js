import baseApis from '../../baseApis/baseApis';

export const authApis = baseApis.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: ({ data }) => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: '/auth/change-password',
        method: 'PATCH',
        body: data,
      }),
    }),
    forgetEmailPost: builder.mutation({
      query: ({ data }) => {
        return {
          url: '/auth/forgot-password',
          method: 'POST',
          body: data,
        };
      },
    }),
    verifyOtpCode: builder.mutation({
      query: ({ data }) => ({
        url: '/auth/forget-pass-otp-verify',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ data }) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('resetToken')}`,
        },
      }),
    }),
    resendResetOtp: builder.mutation({
      query: (data) => ({
        url: '/auth/resend-reset-code',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useChangePasswordMutation,
  useForgetEmailPostMutation,
  useVerifyOtpCodeMutation,
  useResetPasswordMutation,
  useResendResetOtpMutation,
} = authApis;

export default authApis;
