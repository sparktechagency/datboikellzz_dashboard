import React, { useState } from 'react';
import {
  Table,
  Modal,
  // Form,
  // Input,
  Button,
  Space,
  Popconfirm,
  Image,
} from 'antd';
import {
  useGetAllFeedbackQuery,
  useDeleteFeedbackMutation,
  // useCreateFeedbackMutation,
} from '../../../Redux/services/dashboard apis/feedback/feedbackApis';
import PageHeading from '../../../Components/Shared/PageHeading';
import { FaEye, FaPlus, FaTrash } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import { imageUrl } from '../../../Utils/server';

function Feedback() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const {
    data: feedbackData,
    isLoading,
    refetch,
  } = useGetAllFeedbackQuery({ page, limit: pageSize });

  const [deleteFeedback, { isLoading: deleteLoading }] =
    useDeleteFeedbackMutation();

  // const [createFeedback, { isLoading: createLoading }] =
  //   useCreateFeedbackMutation();

  // const [form] = Form.useForm();

  const onView = (record) => {
    setSelectedFeedback(record);
    setIsViewModalVisible(true);
  };

  const onDelete = async (id) => {
    try {
      const data = {
        feedbackId: id,
      };
      const res = await deleteFeedback({ data }).unwrap();
      if (res?.success) {
        toast.success(res?.message || 'Feedback deleted');
        refetch();
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete feedback');
    }
  };

  // const openCreateModal = () => {
  //   form.resetFields();
  //   setIsCreateModalVisible(true);
  // };

  // const onCreateSubmit = async (values) => {
  //   try {
  //     await createFeedback(values).unwrap();
  //     toast.success('Feedback created');
  //     setIsCreateModalVisible(false);
  //     refetch();
  //   } catch (error) {
  //     toast.error(error?.data?.message || 'Failed to create feedback');
  //   }
  // };

  const columns = [
    {
      title: 'User Name',
      dataIndex: ['user', 'name', 'profile_image', 'email'],
      key: 'userName',
      render: (text, record) => (
        <div className="flex items-center gap-1">
          <Image
            src={imageUrl(record.user.profile_image)}
            alt="user"
            className="!w-10 !h-10 !rounded-full !object-cover"
          />
          <div>
            <h4 className="leading-none">{record.user.name}</h4>
            <h4 className="opacity-70 leading-none">{record.user.email}</h4>
          </div>
        </div>
      ),
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      ellipsis: true,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            className="!bg-[var(--bg-green-high)] !text-white"
            size="small"
            icon={<FaEye />}
            onClick={() => onView(record)}
          ></Button>
          <Popconfirm
            title="Are you sure to delete this feedback?"
            onConfirm={() => onDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              size="small"
              icon={<FaTrash />}
              danger
              loading={deleteLoading}
            ></Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center rounded-md bg-white mb-3 justify-between">
        <PageHeading title="Feedback" />
        {/* <Button
          icon={<FaPlus />}
          className="!bg-[var(--bg-green-high)] !text-white"
          onClick={openCreateModal}
          style={{ marginBottom: 16 }}
        >
          Create New Feedback
        </Button> */}
      </div>
      <Table
        columns={columns}
        dataSource={feedbackData?.data?.feedbacks}
        loading={isLoading}
        bordered
        rowKey={(record) => record._id}
        pagination={{
          size: 'small',
          current: page,
          pageSize: pageSize,
          total: feedbackData?.data?.total,
          onChange: (page) => setPage(page),
        }}
      />

      {/* View Feedback Modal */}
      <Modal
        closeIcon={false}
        title="Feedback Details"
        visible={isViewModalVisible}
        onCancel={false}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedFeedback && (
          <>
            <div className="w-full border border-gray-300 flex gap-3 items-center rounded-md p-1">
              <div className="w-24 h-24 ">
                <img
                  src={imageUrl(selectedFeedback.user.profile_image)}
                  alt=""
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div className="flex items-start flex-col">
                <span>
                  <strong>User Name:</strong> {selectedFeedback.user.name}
                </span>
                <span>
                  <strong>User Email:</strong> {selectedFeedback.user.email}
                </span>
                <span>
                  <strong>Date:</strong>{' '}
                  {new Date(selectedFeedback.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
            <p className="!mt-3 leading-none">
              <strong>Subject:</strong> {selectedFeedback.subject}
            </p>
            <p>
              <strong>Feedback:</strong> {selectedFeedback.feedback}
            </p>
          </>
        )}
      </Modal>

      {/* Create Feedback Modal */}
      {/* <Modal
        title="Create New Feedback"
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        footer={null}
      >
        <Form
          requiredMark={false}
          form={form}
          layout="vertical"
          onFinish={onCreateSubmit}
        >
          <Form.Item
            label="User Name"
            name={['user', 'name']}
            rules={[{ required: true, message: 'Please input user name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="User Email"
            name={['user', 'email']}
            rules={[
              { required: true, message: 'Please input user email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Subject"
            name="subject"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Feedback"
            name="feedback"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={() => setIsCreateModalVisible(false)}>
                Cancel
              </Button>
              <Button
                className="!bg-[var(--bg-green-high)] !text-white"
                htmlType="submit"
                loading={createLoading}
              >
                Create
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal> */}
    </div>
  );
}

export default Feedback;
