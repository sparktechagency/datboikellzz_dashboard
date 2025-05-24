import React from 'react';
import { Form, Input, Button, Divider, Spin } from 'antd';
import toast from 'react-hot-toast';
import { usePasswordChangeMutation } from '../../../Redux/services/dashboard apis/createAdmin/adminApis';

function AdminPasswordChange({ data, closeModal }) {
  const [upadteAdminPassword, { isLoading }] = usePasswordChangeMutation();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const formData = {
      adminId: data?._id,
      password: values.password,
      confirmPassword: values.confirmPassword,
    };
    const res = await upadteAdminPassword({ data: formData }).unwrap();
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
          <h1 className="text-3xl font-semibold">Change Admin Password</h1>
        </Divider>
        <Divider />
      </div>

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={onFinish}
      >
        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Password is required' },
            { min: 6, message: 'Password must be at least 6 characters' },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="new password" />
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
                return Promise.reject(new Error('The passwords do not match'));
              },
            }),
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Confirm your password" />
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

export default AdminPasswordChange;
