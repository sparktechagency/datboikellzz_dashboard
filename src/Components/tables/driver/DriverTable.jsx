import React, { useState } from 'react';
import { Table, Tag, Space, Avatar, Button, Modal, Select } from 'antd';
import { UserOutlined, PhoneOutlined } from '@ant-design/icons';
import { CgBlock } from 'react-icons/cg';
import { IoIosMail, IoIosWarning } from 'react-icons/io';
import { Link } from 'react-router-dom';
import DriverInfotmation from '../../page component/DriverInfotmation';
import {
  useGetAllUserOrDriverQuery,
  useUpdateUserStatusMutation,
} from '../../../Redux/services/dashboard apis/userApis/userApis';
import { imageUrl } from '../../../Utils/server';
import toast from 'react-hot-toast';

const DriverTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [blockUserId, setBlockUserId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [userBlock, setUserBlock] = useState(false);
  console.log(selectedId);
  const roleData = {
    role: 'DRIVER',
  };

  const {
    data: driverData,
    isLoading: driverDataLoading,
    refetch,
  } = useGetAllUserOrDriverQuery({
    params: roleData,
    page: pagination.current,
    limit: pagination.pageSize,
  });

  const [updateUserStatus] = useUpdateUserStatusMutation();

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const drivers = driverData?.data?.result?.map((driver) => ({
    id: driver?._id,
    key: driver?._id,
    name: driver?.name,
    email: driver?.email,
    contactNumber: driver?.phoneNumber,
    joined: new Date(driver.createdAt).toLocaleDateString(),
    status: driver?.isOnline ? 'Active' : 'Inactive',
    avatar: driver?.profile_image,
    isAvailable: driver?.isAvailable,
    authId: driver?.authId?._id,
    isBlocked: driver?.authId?.isBlocked,
    userAccountStatus: driver?.userAccountStatus,
    ...driver,
    formattedLicenseExpiry: driver?.licenseExpiry
      ? new Date(driver.licenseExpiry).toLocaleDateString()
      : 'N/A',
    formattedCoordinates: driver?.locationCoordinates?.coordinates
      ? `${driver.locationCoordinates.coordinates[0]}, ${driver.locationCoordinates.coordinates[1]}`
      : 'Not available',
  }));

  const columns = [
    {
      title: 'Talent Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <img
            src={imageUrl(record.avatar)}
            alt="User"
            className="w-10 h-10 object-cover rounded-full"
          />
          <div className="flex flex-col">
            <span>{text}</span>
            <span>{record.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Contact Number',
      dataIndex: 'contactNumber',
      key: 'contactNumber',
      render: (phone) => (
        <Space>
          <PhoneOutlined />
          {phone}
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => (
        <Space>
          <IoIosMail />
          {email}
        </Space>
      ),
    },
    {
      title: 'Joined',
      dataIndex: 'joined',
      key: 'joined',
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Space>
          <Tag color={record.status === 'Active' ? 'green' : 'red'}>
            {record.status}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => {
              setShowDriverModal(true);
              setSelectedId(record?.key);
            }}
            className="ant-btn ant-btn-primary"
          >
            <UserOutlined />
          </Button>
          <Link
            to={`https://mail.google.com/mail/?view=cm&fs=1&to=${record.email}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="ant-btn ant-btn-primary">
              <IoIosMail />
            </Button>
          </Link>
          <Button
            onClick={() => {
              setBlockUserId(record.authId);
              setUserBlock(record.isBlocked);
              setShowModal(true);
            }}
            className={`ant-btn ant-btn-default ${
              record.isBlocked ? '!bg-red-300' : '!bg-green-300'
            }`}
          >
            <CgBlock />
          </Button>
        </Space>
      ),
    },
  ];

  const handleUnblockUser = async () => {
    if (!blockUserId) {
      return toast.error('Please select a user to unblock');
    }
    try {
      const data = {
        authId: blockUserId,
        isBlocked: false,
      };
      const res = await updateUserStatus({ data }).unwrap();
      if (res?.success) {
        toast.success('User successfully unblocked');
        setShowModal(false);
      }
      refetch();
    } catch (error) {
      toast.error('Failed to unblock user');
      console.error('Update error:', error);
    }
  };

  const handleBlockUser = async () => {
    if (!blockUserId) {
      return toast.error('Please select a user to block');
    }
    try {
      const data = {
        authId: blockUserId,
        isBlocked: true,
      };
      const res = await updateUserStatus({ data }).unwrap();
      if (res?.success) {
        toast.success('User successfully blocked');
        setShowModal(false);
      }
      refetch();
    } catch (error) {
      toast.error('Failed to block user');
      console.error('Update error:', error);
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table
        columns={columns}
        dataSource={drivers}
        loading={driverDataLoading}
        rowKey="id"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: driverData?.data?.meta?.total || 0,
        }}
        onChange={handleTableChange}
        bordered
      />

      <Modal
        visible={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        className="modal-container"
      >
        <div className="flex flex-col items-center">
          <IoIosWarning size={60} color="#f6a112" />
          <h1 className="text-2xl font-bold text-black">Warning</h1>
          <p className="text-lg text-black">
            Are you sure you want to {userBlock ? 'unblock' : 'block'} this
            driver?
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Button
              type="primary"
              className="!bg-[var(--bg-green-high)] !text-white"
              onClick={userBlock ? handleUnblockUser : handleBlockUser}
            >
              Yes
            </Button>
            <Button onClick={() => setShowModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={showDriverModal}
        onCancel={() => setShowDriverModal(false)}
        footer={null}
        width={800}
      >
        <DriverInfotmation id={selectedId} />
      </Modal>
    </div>
  );
};

export default DriverTable;
