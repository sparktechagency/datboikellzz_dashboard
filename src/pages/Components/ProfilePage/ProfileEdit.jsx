import React from 'react';
import { Button, Form, Spin } from 'antd';
import toast from 'react-hot-toast';
import { useUpdateProfileDataMutation } from '../../../Redux/services/superAdminProfileApis';

const ProfileEdit = ({ image, data, adminRole }) => {
  const [form] = Form.useForm();
  const [setProfileUpdate, { isLoading: isProfileUpdate }] =
    useUpdateProfileDataMutation();
  const onFinish = async (values) => {
    if (adminRole === 'ADMIN') {
      return toast.error('You are not allowed to update your profile');
    }
    const updateData = {
      name: values?.name,
      phoneNumber: values?.phoneNumber,
    };
    const formData = new FormData();
    Object.keys(updateData).forEach((key) => {
      formData.append(key, updateData[key]);
    });

    if (image === null) {
      formData.delete('profile_image', image);
    } else {
      formData.append('profile_image', image);
    }

    try {
      const res = await setProfileUpdate(formData);
      if (res?.data?.success) {
        toast.success(res?.data?.message || 'Profile updated successfully');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };
  return (
    <div>
      <p className="text-[var(--bg-green-high)] text-3xl text-center">
        Edit Your Profile
      </p>
      <Form
        className="text-white"
        requiredMark={false}
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          name: data?.name || '',
          email: data?.email || '',
          phoneNumber: data?.phoneNumber || '',
        }}
      >
        <Form.Item name="name" label={<span className="text-black">Name</span>}>
          <input
            style={{
              width: '100%',
              height: 40,
              border: '1px solid #222',
              borderRadius: '5px',
              color: '#111',
              backgroundColor: '#fff',
              outline: 'none',
            }}
            disabled={adminRole === 'ADMIN'}
            placeholder="Name"
            className={`p-2 w-full outline-none border-none h-11 text-[var(--white-600)] ${
              adminRole === 'ADMIN' ? 'cursor-not-allowed' : ''
            }`}
          />
        </Form.Item>

        <Form.Item
          name="email"
          label={<span className="text-black">Email</span>}
        >
          <input
            style={{
              width: '100%',
              height: 40,
              border: '1px solid #222',
              borderRadius: '5px',
              color: '#111',
              backgroundColor: '#fff',
              outline: 'none',
            }}
            disabled
            type="email"
            placeholder="Email"
            className="cursor-not-allowed p-2 w-full outline-none border-none h-11 text-[var(--white-600)]"
          />
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          label={<span className="text-black">Phone Number</span>}
        >
          <input
            style={{
              width: '100%',
              height: 40,
              border: '1px solid #222',
              borderRadius: '5px',
              color: '#111',
              backgroundColor: '#fff',
              outline: 'none',
            }}
            disabled={adminRole === 'ADMIN'}
            placeholder="Phone Number"
            className={`p-2 w-full outline-none border-none h-11 text-[var(--white-600)] ${
              adminRole === 'ADMIN' ? 'cursor-not-allowed' : ''
            }`}
          />
        </Form.Item>

        {adminRole === 'SUPER_ADMIN' && (
          <Button
            htmlType="submit"
            disabled={isProfileUpdate}
            style={{
              backgroundColor: 'var(--bg-green-high)',
              color: '#fff',
              height: 40,
            }}
            className="!bg-[var(--bg-green-high] !hover:bg-[var(--bg-green-low] w-full"
          >
            {isProfileUpdate ? <Spin /> : 'Update Profile'}
          </Button>
        )}
      </Form>
    </div>
  );
};

export default ProfileEdit;
