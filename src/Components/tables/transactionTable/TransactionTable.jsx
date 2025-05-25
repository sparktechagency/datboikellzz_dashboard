import React, { useState } from 'react';
import { Table, Space, Avatar, Button, Modal } from 'antd';
import { IoIosMail, IoIosWarning } from 'react-icons/io';
import toast from 'react-hot-toast';
import { useGetPaymentQuery } from '../../../Redux/services/dashboard apis/total-overview/payment/paymentApis';
import { imageUrl } from '../../../Utils/server';

const TransactionTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useGetPaymentQuery({ page: currentPage });
  const payments = data?.data?.result || [];
  const meta = data?.data?.meta || {};

  const tableData = payments.map((item) => ({
    id: item?._id,
    name: item?.user?.name || 'N/A',
    email: item?.user?.email || 'N/A',
    date: new Date(item.createdAt).toLocaleDateString(),
    time: item?.createdAt,
    trId: item?.payment_intent_id || 'N/A',
    amount: `$ ${item?.amount?.toFixed(2) || '0.00'}`,
    avatar: imageUrl(item?.user?.profile_image),
  }));

  const columns = [
    {
      title: 'User Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space size="middle">
          <Avatar src={record.avatar} icon={!record.avatar && undefined} />
          {text}
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => (
        <Space size="middle">
          <IoIosMail />
          {email}
        </Space>
      ),
    },
    {
      title: 'Date & Time',
      key: 'date',
      render: (_, record) => {
        const date = record.date;
        const time = new Date(record.time).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        return (
          <div className="flex items-center justify-center gap-3">
            <p className="leading-none">{date}</p> <p>/</p>
            <p className="leading-none">{time}</p>
          </div>
        );
      },
    },
    {
      title: 'TR ID',
      dataIndex: 'trId',
      key: 'trId',
      ellipsis: true,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table
        scroll={{ x: 1500 }}
        columns={columns}
        dataSource={tableData}
        rowKey="id"
        loading={isLoading}
        pagination={
          meta.total > meta.limit
            ? {
                current: meta?.page,
                pageSize: meta?.limit,
                total: meta?.total,
                onChange: handlePageChange,
                showSizeChanger: false,
                size: 'small',
              }
            : false
        }
        bordered
      />
      <Modal
        visible={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <div className="flex flex-col items-center">
          <IoIosWarning size={60} color="#f6a112" />
          <h1 className="text-2xl font-bold text-black">Warning</h1>
          <p className="text-lg text-black">
            Are you sure you want to block this user?
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Button onClick={() => setShowModal(false)} type="primary" danger>
              Cancel
            </Button>
            <Button
              type="primary"
              className="!bg-[var(--bg-green-high)] !text-white"
              onClick={() => {
                toast.success('User successfully blocked');
                setShowModal(false);
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TransactionTable;
