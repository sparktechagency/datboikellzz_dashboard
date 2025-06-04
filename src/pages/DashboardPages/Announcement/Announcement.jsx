import React, { useEffect, useState } from 'react';
import PageHeading from '../../../Components/Shared/PageHeading';
import {
  Card,
  Form,
  Input,
  Switch,
  Button,
  Skeleton,
  ConfigProvider,
} from 'antd';
import {
  useGetAllAnnouncementQuery,
  useUpdateAnnouncementMutation,
  useUpdateToggleMutation,
} from '../../../Redux/services/announcement/AnnouncementApis';
import toast from 'react-hot-toast';

function Announcement() {
  const { data, isLoading } = useGetAllAnnouncementQuery();
  const [updateAnnouncement, { isLoading: updateAnnouncementLoading }] =
    useUpdateAnnouncementMutation();
  const [updateToggle, { isLoading: updateToggleLoading }] =
    useUpdateToggleMutation();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    console.log(data?.data?.isActive);
    if (data?.data) {
      setIsActive(data?.data?.isActive);
    }
  }, [data]);

  const handleSwitchChange = async (checked) => {
    const data = {
      isActive: checked ? 'yes' : 'no',
    };
    const res = await updateToggle({ data }).unwrap();
    if (res?.success) {
      toast.success(res?.message || 'Announcement updated successfully!');
    }
    setIsActive(checked);
  };

  const onFinish = async (values) => {
    try {
      const updatedData = {
        title: values.title,
        description: values.description,
      };

      const res = await updateAnnouncement({ data: updatedData }).unwrap();

      if (res?.success) {
        toast.success(res?.message);
      }
    } catch (error) {
      console.error('Failed to update announcement:', error);
    }
  };

  const initialValues = {
    title: data?.data?.title,
    description: data?.data?.description,
    isActive: data?.data?.isActive,
  };

  const [form] = Form.useForm();

  return (
    <div>
      <PageHeading title="Announcement" />
      <Card
        style={{
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : (
          <Form
            requiredMark={false}
            layout="vertical"
            form={form}
            initialValues={initialValues}
            onFinish={onFinish}
            disabled={isLoading}
          >
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please input the title!' }]}
            >
              <Input type="text" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: 'Please input the description!' },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item label="Active" name="isActive" valuePropName="checked">
              <ConfigProvider theme={{ token: { colorPrimary: '#022C22' } }}>
                <Switch
                  loading={updateToggleLoading}
                  checked={isActive}
                  onChange={handleSwitchChange}
                />
              </ConfigProvider>
            </Form.Item>

            <Form.Item>
              <Button
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-green-high)',
                  color: 'var(--text-light)',
                }}
                htmlType="submit"
                block
                loading={isLoading}
              >
                {updateAnnouncementLoading ? (
                  <div class="flex flex-row gap-2">
                    <div class="w-2 h-2 rounded-full bg-white animate-bounce"></div>
                    <div class="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.3s]"></div>
                    <div class="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-.5s]"></div>
                  </div>
                ) : (
                  'Update Announcement'
                )}
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
}

export default Announcement;
