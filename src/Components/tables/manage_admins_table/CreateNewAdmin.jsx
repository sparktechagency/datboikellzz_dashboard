import React, { useState } from 'react';
import { Form, Input, Button, Divider, Upload, Spin } from 'antd';
import { useCreateNewAdminMutation } from '../../../Redux/services/dashboard apis/createAdmin/adminApis';
import { FaImage } from 'react-icons/fa6';
import toast from 'react-hot-toast';

function CreateNewAdmin({ closeModal }) {
  const [fileList, setFileList] = useState([]);
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createAdmin] = useCreateNewAdminMutation();
  const [form] = Form.useForm();
  const initialValues = {
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  };
  const onFinish = async (values) => {
    if (!file) {
      toast.error('Please upload a profile image');
      return;
    }

    const formData = new FormData();
    formData.append('profile_image', file);
    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('confirmPassword', values.confirmPassword);
    formData.append('phoneNumber', values.phoneNumber);

    setIsSubmitting(true);
    try {
      const res = await createAdmin(formData).unwrap();
      console.log(res);
      toast.success('Admin created successfully');
      form.resetFields();
      setFile(null);
      setFileList([]);
      closeModal();
    } catch (error) {
      console.error('Error creating admin:', error);
      toast.error(
        error.data?.message || 'Failed to create admin. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCancel = () => {
    form.resetFields();
    setFileList([]);
    setFile(null);
    closeModal();
  };

  const handleFileChange = ({ fileList }) => {
    const isImage = fileList[0]?.type?.includes('image');
    if (!isImage && fileList.length > 0) {
      toast.error('You can only upload image files!');
      return;
    }

    setFileList(fileList.slice(0, 1));
    setFile(fileList.length ? fileList[0].originFileObj : null);
  };

  const uploadButton = (
    <div className="flex flex-col items-center justify-center">
      <FaImage className="text-xl" />
      <p className="mt-2">Upload Profile Image</p>
    </div>
  );

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold">Add New Admin</h1>
        <p className="text-sm text-gray-600 mt-2">
          Create a new admin account by filling in the required information.
        </p>
      </div>

      <Spin spinning={isSubmitting} tip="Creating admin...">
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={onFinish}
          initialValues={initialValues}
          autoComplete="off"
        >
          <Form.Item
            name="profile_image"
            rules={[{ required: true, message: 'Profile image is required' }]}
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList}
          >
            <Upload
              listType="picture-card"
              beforeUpload={() => false}
              onChange={handleFileChange}
              maxCount={1}
              accept="image/*"
              fileList={fileList}
              showUploadList={{
                showPreviewIcon: false,
                showRemoveIcon: true,
              }}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
          </Form.Item>

          <Form.Item
            name="name"
            label="Full Name"
            rules={[
              { required: true, message: 'Please input the full name' },
              { min: 3, message: 'Name must be at least 3 characters' },
            ]}
          >
            <Input placeholder="John Doe" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input the email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder="john.doe@example.com" />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[
              { required: true, message: 'Phone number is required' },
            ]}
          >
            <Input placeholder="+1234567890" />
          </Form.Item>

          <Divider orientation="left" plain>
            Security
          </Divider>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Password is required' },
              { min: 6, message: 'Password must be at least 8 characters' },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Create a strong password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('The passwords do not match')
                  );
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Confirm your password" />
          </Form.Item>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              onClick={onCancel}
              className="min-w-[120px]"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="min-w-[120px] bg-blue-600"
              loading={isSubmitting}
            >
              Create Admin
            </Button>
          </div>
        </Form>
      </Spin>
    </div>
  );
}

export default CreateNewAdmin;
