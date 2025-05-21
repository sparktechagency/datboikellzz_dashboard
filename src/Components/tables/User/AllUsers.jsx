/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Table, Space, Avatar, Button, Modal, Tabs, Form, Input } from 'antd';
import { UserOutlined, PhoneOutlined } from '@ant-design/icons';
import { CgBlock } from 'react-icons/cg';
import { IoIosWarning, IoIosMail } from 'react-icons/io';
import toast from 'react-hot-toast';
import './alluserVanila.css';
import { useGetAllUserQuery } from '../../../Redux/services/dashboard apis/userApis/userApis';
import { imageUrl } from '../../../Utils/server';

const AllUsers = ({ recentUser }) => {
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [userDetailsModal, setUserDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [blockUserId, setBlockUserId] = useState(null);
  const [isUserBlock, setUserBlock] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  console.log(selectedUser);
  const { data: userData, isLoading: userDataLoading } = useGetAllUserQuery();

  const transformUserData = (apiUsers) => {
    console.log(apiUsers);
    if (!apiUsers) return [];
    return apiUsers.map((user) => ({
      id: user._id,
      name: user.name || user.authId?.name || 'N/A',
      contactNumber: user.phoneNumber || 'N/A',
      email: user.email || user.authId?.email || 'N/A',
      joined: new Date(user.createdAt).toLocaleDateString(),
      role: mapRole(user.authId?.role),
      isBlocked: user.authId?.isBlocked || false,
      profile_image: null,
    }));
  };

  const mapRole = (role) => {
    switch (role) {
      case 'USER':
        return 'Gold User';
      case 'ADMIN':
        return 'Silver User';
      case 'MODERATOR':
        return 'Bronze User';
      default:
        return role || 'User';
    }
  };

  const handlePageChange = (page) => {
    setPage(page);
  };
  const users = transformUserData(userData?.data?.users);

  useEffect(() => {
    setFilteredUsers(users);
  }, [userData]);

  const columns = [
    {
      title: 'User Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space size="middle">
          <Avatar icon={<UserOutlined />} src={imageUrl(record.profile_image)} />
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
      width: 200,
      key: 'role',
      render: (role) => (
        <span
          className={`${
            role === 'Gold User'
              ? 'gold px-3 rounded-md py-1  font-bold'
              : role === 'Silver User'
              ? 'silver px-5 rounded-md py-1'
              : 'bronze px-5 rounded-md py-1'
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
          <Button
            onClick={() => {
              setBlockUserId(record?.id);
              setUserBlock(record?.isBlocked);
              setShowModal(true);
            }}
            className={`${
              record?.isBlocked ? 'bg-red-300' : 'bg-green-200'
            } ant-btn ant-btn-default`}
          >
            <CgBlock />
          </Button>
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
        setFilteredUsers(users.filter((user) => user.role === 'Gold User'));
        break;
      case '3':
        setFilteredUsers(users.filter((user) => user.role === 'Silver User'));
        break;
      case '4':
        setFilteredUsers(users.filter((user) => user.role === 'Bronze User'));
        break;
      case '5':
        setFilteredUsers(users.filter((user) => user.isBlocked === true));
        break;
      default:
        setFilteredUsers(users);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilteredUsers(e.target.value);
  };

  const handleUnblockUser = async () => {
    if (!blockUserId) {
      return toast.error('Please select a user to unblock');
    }
    toast.success('User successfully unblocked');
    setShowModal(false);
  };

  const handleBlockUser = async () => {
    if (!blockUserId) {
      return toast.error('Please select a user to block');
    }
    toast.success('User successfully blocked');
    setShowModal(false);
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="max-w-[400px]">
        <Form>
          <Form.Item>
            <Input.Search
              placeholder="Search by name, email, or contact number"
              onChange={(value) => handleSearch(value)}
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
          pageSize: 4,
          defaultCurrent: parseInt(page),
          onChange: (page) => handlePageChange(page),
        }}
        bordered
        loading={userDataLoading}
      />

      {/* Modal to confirm block/unblock */}
      <Modal
        centered
        visible={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <div className="flex flex-col items-center">
          <IoIosWarning size={60} color="#f6a112" />
          <h1 className="text-2xl font-bold text-black">Warning</h1>
          <p className="text-lg text-black">
            Are you sure you want to {isUserBlock ? 'unblock' : 'block'} this
            user?
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Button
              type="primary"
              className="!bg-[var(--bg-green-high)] !text-white"
              onClick={isUserBlock ? handleUnblockUser : handleBlockUser}
            >
              Yes
            </Button>
            <Button onClick={() => setShowModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

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
          <div className="mt-4 !w-full">
            <Button
              type="primary"
              danger
              onClick={() => {
                toast.success('User blocked');
                setUserDetailsModal(false);
              }}
              className="!w-full !border !bg-white !text-red-500 !border-red-500 hover:!text-white hover:!bg-red-500"
            >
              Block This User
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AllUsers;
