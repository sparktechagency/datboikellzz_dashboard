import React from 'react';
import { Form, Button, Input, Card } from 'antd';
import 'antd/dist/reset.css';
import { EyeTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import BrandLogo from '../../Components/Shared/BrandLogo';
import Logo from '../../assets/icons/DUDU.svg';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useResetPasswordMutation } from '../../Redux/services/AuthApis/authApis';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const route = useNavigate();
  const onFinish = async (values) => {
    try {
      if (values.password !== values.confirmPassword) {
        return Promise.reject(new Error('Passwords do not match!'));
      }
      const data = {
        email: localStorage.getItem('email'),
        newPassword: values?.password,
        confirmPassword: values?.confirmPassword,
      };
      const res = await resetPassword({ data }).unwrap();
      if (res?.success) {
        toast.success('Password reset successfully');
        route('/login');
      } else {
        toast.error('Password reset failed');
      }
    } catch (error) {
      console.error('Reset Password Error:', error);
      toast.error(
        error?.data?.message || error?.message || 'An unexpected error occurred'
      );
    }
  };
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  return (
    <div className="flex justify-center items-center min-h-screen bg-[var(--color-white)] p-4">
      <Card className="bg-white shadow-lg relative rounded-2xl p-6 w-full max-w-lg text-start">
        <BrandLogo
          img={Logo}
          status="Create new password"
          information="To secure your account, please create a new password."
        />
        <Form requiredMark={false} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please enter your password' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password
              iconRender={(visible) => (
                <EyeTwoTone
                  twoToneColor={
                    visible ? 'var(--color-white)' : 'var(--color-white)'
                  }
                />
              )}
              value={password}
              onChange={handlePasswordChange}
              placeholder="Password"
              style={{
                width: '100%',
                marginTop: 10,
                marginBottom: 10,
                textAlign: 'start',
              }}
            />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              iconRender={(visible) => (
                <EyeTwoTone
                  twoToneColor={
                    visible ? 'var(--color-white)' : 'var(--color-white)'
                  }
                />
              )}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm Password"
              style={{
                width: '100%',
                marginTop: 10,
                marginBottom: 10,
                textAlign: 'start',
              }}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            className="w-full !bg-[var(--bg-green-high)] hover:!bg-[var(--bg-green-high)] !text-white"
            style={{ marginTop: 10 }}
          >
            {isLoading ? <span className="loader"></span> : 'Confirm'}
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPassword;
