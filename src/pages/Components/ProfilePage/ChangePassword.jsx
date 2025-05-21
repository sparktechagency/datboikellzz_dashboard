import React from 'react';
import { Button, Form, Input, Spin } from 'antd';
import toast from 'react-hot-toast';
import { useChangePasswordMutation } from '../../../Redux/services/AuthApis/authApis';

const ChangePassword = () => {
  const [form] = Form.useForm();
  const [setNewPassword, { isLoading: isNewPassChange }] =
    useChangePasswordMutation({});

  const onFinish = async (values) => {
    const ChangePasswordDatas = {
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    };
    try {
      const res = await setNewPassword(ChangePasswordDatas).unwrap();
      if (res?.success) {
        toast.success(res?.message || 'Password Changed successfully.');
      }
    } catch (error) {
      if (!error?.data?.success) {
        toast.error(error?.data?.message || 'Failed to change Password.');
      }
    }
  };
  return (
    <Form
      requiredMark={false}
      form={form}
      onFinish={onFinish}
      layout="vertical"
    >
      <Form.Item
        name="oldPassword"
        label={<span className="text-black">Old Password</span>}
        rules={[
          {
            required: true,
            message: 'old password is requird ',
          },
        ]}
      >
        <Input.Password
          placeholder="*****************"
          style={{
            width: '100%',
            height: 40,
            border: '1px solid #222',
            borderRadius: '5px',
            color: '#111',
            backgroundColor: '#fff',
            outline: 'none',
          }}
          className=" p-2 w-full outline-none"
        />
      </Form.Item>

      <Form.Item
        name="newPassword"
        label={<span className="text-black">New Password</span>}
        rules={[
          {
            required: true,
            message: 'new password is requird',
          },
        ]}
      >
        <Input.Password
          placeholder="*****************"
          style={{
            width: '100%',
            height: 40,
            border: '1px solid #222',
            borderRadius: '5px',
            color: '#111',
            backgroundColor: '#fff',
            outline: 'none',
          }}
          className=" p-2 w-full outline-none"
        />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label={<span className="text-black">Confirm Password</span>}
        rules={[
          {
            required: true,
            message: 'confirm password is requird',
          },
        ]}
      >
        <Input.Password
          placeholder="*****************"
          style={{
            width: '100%',
            height: 40,
            border: '1px solid #222',
            borderRadius: '5px',
            color: '#111',
            backgroundColor: '#fff',
            outline: 'none',
          }}
          className=" p-2 w-full outline-none"
        />
      </Form.Item>

      <Button
        type="primary"
        htmlType="submit"
        disabled={isNewPassChange}
        style={{
          backgroundColor: 'var(--bg-green-high)',
          color: '#fff',
          height: 40,
        }}
        className=" w-full"
      >
        {isNewPassChange ? <Spin /> : 'Update password'}
      </Button>
    </Form>
  );
};

export default ChangePassword;
