import React, { useState } from 'react';
import { Typography, Input, Button, Card } from 'antd';
import { useNavigate } from 'react-router';
import BrandLogo from '../../Components/Shared/BrandLogo';
import toast from 'react-hot-toast';
import Logo from '../../assets/icons/DUDU.svg';
import {
  useForgetEmailPostMutation,
  useVerifyOtpCodeMutation,
} from '../../Redux/services/AuthApis/authApis';

const { Title, Text } = Typography;

const Otp = () => {
  const router = useNavigate();
  const [verifyOtp, { isLoading }] = useVerifyOtpCodeMutation();
  const [resendOtp] = useForgetEmailPostMutation();
  const [otp, setOtp] = useState('');
  const handleContinue = async () => {
    try {
      const email = localStorage.getItem('email');
      if (!email) {
        toast.error('Email not found');
        return;
      }
      const data = {
        email,
        code: otp,
      };
      await verifyOtp({ data })
        .unwrap()
        .then((res) => {
          if (res?.success) {
            toast.success('OTP verified successfully');
            localStorage.setItem('resetToken', res?.data?.resetToken);
            router('/reset-password');
          } else {
            toast.error('Invalid OTP');
          }
        });
    } catch (error) {
      console.error('Verify OTP Error:', error);
      toast.error(
        error?.data?.message || error?.message || 'An unexpected error occurred'
      );
    }
  };
  const resendOtpHandler = async () => {
    const email = localStorage.getItem('email');
    const data = {
      email: email,
    };
    await resendOtp({ data })
      .unwrap()
      .then((res) => {
        if (res?.success) {
          toast.success('please check your email for otp');
        } else {
          console.log('error', res);
        }
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen  p-4">
      <Card className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg text-center">
        <BrandLogo
          img={Logo}
          status="Reset Password"
          information="Please check your email for the otp. If you don't receive an email, check your spam folder or try again."
        />
        <div className="flex justify-center my-4">
          <Input.OTP
            length={6}
            value={otp}
            onChange={setOtp}
            className="text-center text-xl w-full"
          />
        </div>

        <Button
          type="primary"
          className="w-full !bg-[var(--bg-green-high)] hover:!bg-[var(--bg-green-high)] !text-white"
          disabled={otp.length < 6}
          loading={isLoading}
          onClick={handleContinue}
        >
          Continue
        </Button>

        <div className="mt-3">
          <div>
            <Text>Didn&apos;t receive the OTP? </Text>
            <Text
              onClick={() => resendOtpHandler()}
              className="text-[#3872F0] cursor-pointer hover:underline"
            >
              {isLoading ? (
                <div class="flex flex-row gap-2">
                  <div class="w-2 h-2 rounded-full bg-white animate-bounce"></div>
                  <div class="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.3s]"></div>
                  <div class="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.5s]"></div>
                </div>
              ) : (
                'Resend OTP'
              )}
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Otp;
