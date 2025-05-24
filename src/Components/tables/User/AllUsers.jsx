import React, { useState, useEffect } from 'react';
import {
  Table,
  Space,
  Avatar,
  Button,
  Modal,
  Tabs,
  Form,
  Input,
  Popconfirm,
} from 'antd';
import { UserOutlined, PhoneOutlined } from '@ant-design/icons';
import { CgBlock } from 'react-icons/cg';
import { IoIosWarning, IoIosMail } from 'react-icons/io';
import './alluserVanila.css';
import {
  useBlockUserMutation,
  useGetAllUserQuery,
} from '../../../Redux/services/dashboard apis/userApis/userApis';
import { imageUrl } from '../../../Utils/server';
import toast from 'react-hot-toast';

const AllUsers = ({ recentUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [userDetailsModal, setUserDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { data: userData, isLoading: userDataLoading } = useGetAllUserQuery({
    searchTerm: searchQuery,
  });
  const [updateUserStatus] = useBlockUserMutation();

  const mapSubscriptionToRole = (subscriptionType) => {
    switch (subscriptionType) {
      case 'gold':
        return 'Gold User';
      case 'silver':
        return 'Silver User';
      case 'bronze':
        return 'Bronze User';
      default:
        return 'Not subscribed';
    }
  };

  const transformUserData = (apiUsers) => {
    if (!apiUsers) return [];
    return apiUsers.map((user) => ({
      id: user?._id,
      userId: user?.authId?._id,
      name: user?.name || user?.authId?.name || 'N/A',
      contactNumber: user?.phoneNumber || 'N/A',
      email: user?.email || user?.authId?.email || 'N/A',
      joined: new Date(user?.createdAt).toLocaleDateString(),
      role: mapSubscriptionToRole(user?.subscriptionPlan?.subscriptionType),
      isBlocked: user?.authId?.isBlocked || false,
      profile_image: user?.profile_image || null,
      subscriptionType: user?.subscriptionPlan?.subscriptionType || 'bronze',
    }));
  };

  const users = transformUserData(userData?.data?.users);

  const blockUser = async (id, status) => {
    try {
      if (!id) {
        return;
      }
      const data = {
        authId: id,
        isBlocked: `${status === true ? 'no' : 'yes'}`,
      };
      const res = await updateUserStatus({ data });
      if (res?.data?.success) {
        toast.success(res?.data?.message || 'User updated successfully');
      } else {
        toast.error('something went wrong!');
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setFilteredUsers(users);
  }, [userData]);

  const handlePageChange = (page) => {
    setPage(page);
  };

  const columns = [
    {
      title: 'User Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space size="middle">
          <Avatar
            icon={<UserOutlined />}
            src={imageUrl(record.profile_image)}
          />
          {text}
        </Space>
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
      title: 'User Type',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <span
          className={`${
            //   role === 'Gold User'
            //     ? 'gold px-3 rounded-md py-1 font-bold'
            //     : role === 'Silver User'
            //     ? 'silver px-5 rounded-md py-1'
            //     : 'bronze px-5 rounded-md py-1'
            // } font-bold text-[var(--bg-green-high)] flex items-center justify-center`}
            role === 'Gold User'
              ? 'gold px-3 rounded-md py-1 font-bold'
              : role === 'Silver User'
              ? 'silver px-5 rounded-md py-1'
              : role === 'Bronze User'
              ? 'bronze px-5 rounded-md py-1'
              : 'not-subscribed px-5 rounded-md py-1 font-semibold text-red-600' // new class for Not subscribed
          } font-bold text-[var(--bg-green-high)] flex items-center justify-center`}
        >
          {role}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => {
              setSelectedUser(record);
              setUserDetailsModal(true);
            }}
            className="ant-btn !bg-[var(--bg-green-high)] !text-white ant-btn-primary"
          >
            <UserOutlined />
          </Button>
          <Popconfirm
            placement="bottomRight"
            title={`Are you sure you want to ${
              record.isBlocked ? 'unblock' : 'block'
            } this user?`}
            okText="Yes"
            cancelText="No"
            onConfirm={() => blockUser(record.userId, record.isBlocked)}
          >
            <Button
              className={`${
                record.isBlocked ? '!bg-red-300' : '!bg-green-200'
              } ant-btn ant-btn-default`}
            >
              <CgBlock />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleTabChange = (key) => {
    switch (key) {
      case '1':
        setFilteredUsers(users);
        break;
      case '2':
        setFilteredUsers(users.filter((user) => user?.role === 'Gold User'));
        break;
      case '3':
        setFilteredUsers(users.filter((user) => user?.role === 'Silver User'));
        break;
      case '4':
        setFilteredUsers(users.filter((user) => user?.role === 'Bronze User'));
        break;
      case '5':
        setFilteredUsers(users.filter((user) => user?.isBlocked === true));
        break;
      default:
        setFilteredUsers(users);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="max-w-[400px]">
        <Form>
          <Form.Item>
            <Input.Search
              placeholder="Search by name"
              onChange={handleSearch}
              allowClear
            />
          </Form.Item>
        </Form>
      </div>

      {recentUser !== true && (
        <Tabs defaultActiveKey="1" type="card" onChange={handleTabChange}>
          <Tabs.TabPane tab="All Users" key="1" />
          <Tabs.TabPane tab="Gold User" key="2" />
          <Tabs.TabPane tab="Silver User" key="3" />
          <Tabs.TabPane tab="Bronze User" key="4" />
          <Tabs.TabPane tab="Blocked User" key="5" />
        </Tabs>
      )}

      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        scroll={{ x: 1500 }}
        pagination={{
          pageSize: userData?.data?.meta?.limit || 10,
          current: page,
          onChange: handlePageChange,
        }}
        bordered
        loading={userDataLoading}
      />

      {/* Modal for user details */}
      <Modal
        centered
        visible={userDetailsModal}
        onCancel={() => setUserDetailsModal(false)}
        footer={null}
        className="user-details-modal"
      >
        <div className="flex flex-col items-center">
          <Avatar
            className="!w-24 !h-24"
            src={imageUrl(selectedUser?.profile_image)}
          />
          <h1 className="text-2xl font-semibold">{selectedUser?.name}</h1>
          <div className="mt-4 !w-full">
            <p className="font-semibold">Full Name</p>
            <p className="p-2 border border-[#64748B] rounded-md">
              {selectedUser?.name}
            </p>
            <p className="font-semibold mt-2">Email</p>
            <p className="p-2 border border-[#64748B] rounded-md">
              {selectedUser?.email}
            </p>
            <p className="font-semibold mt-2">Phone Number</p>
            <p className="p-2 border border-[#64748B] rounded-md">
              {selectedUser?.contactNumber}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AllUsers;
