import React, { useState, useMemo } from 'react';
import { Form, Input, Button, Divider, Spin } from 'antd';
import toast from 'react-hot-toast';
import { imageUrl } from '../../../Utils/server';
import { FaCameraRetro } from 'react-icons/fa6';
import { useUpdateAdminMutation } from '../../../Redux/services/dashboard apis/createAdmin/adminApis';

function UpdateAdminInformatio({ data, closeModal }) {
  const [image, setImage] = useState(null);
  const [upadteAdmin, { isLoading }] = useUpdateAdminMutation();
  const [form] = Form.useForm();
  const initialData = {
    fullName: data?.name || '',
    email: data?.email || '',
    phoneNumber: data?.phoneNumber || '',
  };

  const profileImage = useMemo(() => {
    if (image) return URL.createObjectURL(image);
    if (data?.data?.profile_image || data?.profile_image)
      return imageUrl(data?.data?.profile_image || data.profile_image);
    return 'https://placehold.co/400';
  }, [image, data]);

  const handleImageUpload = (e) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
    }
  };

  const onFinish = async (values) => {
    const formData = new FormData();
    if (!data?._id) {
      return;
    }
    formData.append('adminId', data?._id);
    formData.append('name', values.fullName);
    formData.append('email', values.email);
    formData.append('phoneNumber', values.phoneNumber);
    if (image) {
      formData.append('profile_image', image);
    }

    const res = await upadteAdmin({ data: formData }).unwrap();

    if (res?.success) {
      toast.success(res?.message || 'Update successfully');
      closeModal();
    }
  };

  const onCancel = () => {
    form.resetFields();
    closeModal();
  };

  return (
    <div>
      <div className="text-center">
        <Divider>
          <h1 className="text-3xl font-semibold">Update Admin</h1>
        </Divider>
        <p className="text-sm">
          Create a new admin account by filling in the required information. The
          new admin will receive access based on the assigned role.
        </p>
        <Divider />
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={initialData}
        requiredMark={false}
        onFinish={onFinish}
      >
        <div className="w-24 h-24 border-2 border-black p-1 cursor-pointer rounded-full relative mx-auto my-4">
          <img
            className="w-full h-full object-cover rounded-full"
            src={profileImage}
            alt="Profile"
          />

          <label
            htmlFor="fileInput"
            className="absolute right-0 bottom-2 rounded-full bg-[var(--bg-green-high)] p-2 cursor-pointer"
          >
            <FaCameraRetro size={12} className="text-white" />
          </label>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{
              position: 'absolute',
              borderRadius: '50%',
              width: '100%',
              height: '100%',
              cursor: 'pointer',
              opacity: 0,
              left: 0,
              top: 0,
            }}
          />
        </div>
        <Form.Item
          name="fullName"
          label="Full Name"
          rules={[{ required: true, message: 'Please input the full name!' }]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please input the email!' },
            { type: 'email', message: 'Please input a valid email!' },
          ]}
        >
          <Input
            className="cursor-not-allowed"
            readOnly
            disabled
            placeholder="Enter email"
          />
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          label="Phone Number"
          rules={[
            { required: true, message: 'Please input the phone number!' },
          ]}
        >
          <Input placeholder="Please Input the Number" />
        </Form.Item>

        <Divider />

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '8px',
          }}
        >
          <Button
            className="!w-full !h-10 !text-white !bg-[var(--bg-green-high)]"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            className="!w-full !h-10 !text-white !bg-[var(--bg-green-high)]"
            htmlType="submit"
          >
            {isLoading ? <Spin size="small">Save...</Spin> : 'Save'}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default UpdateAdminInformatio;
