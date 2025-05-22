import React, { useState } from 'react';
import { Table, Tag, Space, Avatar, Button, Modal, Form, Input } from 'antd';
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { FaRegCircle } from 'react-icons/fa6';
import { IoIosWarning } from 'react-icons/io';
import toast from 'react-hot-toast';
import Success from '../../Shared/Success';
import CreateNewAdmin from './CreateNewAdmin';
import UpdateAdminInformatio from './UpdateAdminInformatio';
import { useGetAllAdminsQuery } from '../../../Redux/services/dashboard apis/createAdmin/adminApis';
import { imageUrl } from '../../../Utils/server';

const AdminsTable = () => {
  const [showModal, setShowModal] = useState();
  const [isUserBlock, setUserBlock] = useState(false);
  const [blockUserId, setBlockUserId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createNewAdminModal, setCreateNewAdminModal] = useState(false);
  const [updateAdminInfo, setUpdateAdminInfo] = useState(false);
  const [selectAdmin, setSelectAdmin] = useState(null);
  const [userDetailsModal, setUserDetailsModal] = useState(false);
  const { data: adminData, isLoading: dataLoading } = useGetAllAdminsQuery();

  const adminsData = adminData?.data?.admins?.map((admin) => ({
    _id: admin?._id,
    auth_name: admin?.authId?.name || 'N/A',
    auth_email: admin?.authId?.email || 'N/A',
    auth_role: admin?.authId?.role || 'N/A',
    auth_isBlocked: admin?.authId?.isBlocked || 'N/A',
    auth_isActive: admin?.authId?.isActive || 'N/A',
    auth_createdAt: admin?.authId?.createdAt || 'N/A',
    name: admin?.name || 'N/A',
    email: admin?.email || 'N/A',
    profile_image: admin?.profile_image || 'N/A',
    phoneNumber: admin?.phoneNumber || 'N/A',
    joined: admin?.createdAt,
  }));

  const metaData = adminData?.data?.meta;
  console.log(metaData);
  const columns = [
    {
      title: 'Admin Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center">
          <Avatar
            size="small"
            style={{ marginRight: 8 }}
            src={imageUrl(record.profile_image)}
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: 'Contact Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Joined',
      dataIndex: 'joined',
      key: 'joined',
    },
    {
      title: 'Status',
      dataIndex: 'auth_isActive',
      key: 'auth_isActive',
      render: (_, record) => (
        <Tag color={record.auth_isActive ? 'green' : 'red'}>
          {record.auth_isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',

      render: (_, record) => (
        <Space size="small">
          <Button
            onClick={() => {
              setSelectAdmin(record);
              setUserDetailsModal(true);
            }}
            className="!bg-[var(--bg-green-high)]"
            type="default"
            icon={<UserOutlined className="!text-white" />}
            size="small"
          />
          <Button
            onClick={() => {
              setSelectAdmin(record);
              setUpdateAdminInfo(true);
            }}
            className="!bg-[var(--bg-green-high)]"
            type="default"
            icon={<EditOutlined className="!text-white" />}
            size="small"
          />
          <Button
            danger
            type="default"
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => toast.success('Admin delete successfully')}
          />
          <Button
            onClick={() => {
              setShowModal(true);
              setUserBlock(record.status === 'Active');
              setBlockUserId(record.key);
            }}
            type="default"
            icon={<FaRegCircle />}
            size="small"
          />
        </Space>
      ),
    },
  ];
  const handleUnblockUser = async () => {
    if (!blockUserId) {
      return toast.error('Please select a user to block');
    }
    setShowSuccessModal(true);
    setShowModal(false);
  };

  const handleBlockUser = async () => {
    if (!blockUserId) {
      return toast.error('Please select a user to block');
    }
    toast.success('User successfully blocked');
    setShowModal(false);
  };
  const handleSearch = () => {};
  return (
    <div className="admin-table">
      <h1 className="text-2xl font-bold">Admins</h1>
      <div className="flex !items-start justify-between">
        <div className="max-w-[400px] min-w-[400px]">
          <Form className="!w-full !h-fit">
            <Form.Item>
              <Input.Search
                placeholder="Search by name"
                onSearch={handleSearch}
                allowClear
              />
            </Form.Item>
          </Form>
        </div>
        <Button
          onClick={() => setCreateNewAdminModal(true)}
          icon={<PlusOutlined />}
          className="!bg-[var(--bg-green-high)] !text-white"
        >
          Add New Admin
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={adminsData}
        loading={dataLoading}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: false,
          defaultPageSize: 10,
          showQuickJumper: false,
          size: 'small',
        }}
      />
      <Modal
        open={showModal}
        centered
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <div className="flex flex-col items-center">
          <IoIosWarning size={60} color="#f6a112" />
          <h1 className="text-2xl font-bold text-black">Warning</h1>
          <p className="text-sm text-black">
            Are you sure you want to {isUserBlock ? 'unblock' : 'block'} this
            Admin?
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
      <Modal
        open={showSuccessModal}
        centered
        closeIcon={false}
        okButtonProps={{
          style: {
            backgroundColor: 'var(--bg-green-high)',
          },
        }}
        footer={null}
      >
        <Success
          title={isUserBlock ? 'Unblocked' : 'Blocked'}
          description={
            isUserBlock
              ? 'User successfully unblocked'
              : 'User successfully blocked'
          }
        />
        <div className="flex items-center justify-center w-full">
          <Button
            type="primary"
            className="!bg-[var(--bg-green-high)] !text-white"
            onClick={() => setShowSuccessModal(false)}
          >
            Ok
          </Button>
        </div>
      </Modal>
      <Modal open={createNewAdminModal} footer={null} closeIcon={false}>
        <CreateNewAdmin closeModal={setCreateNewAdminModal} />
      </Modal>
      <Modal centered open={updateAdminInfo} footer={null} closeIcon={false}>
        <UpdateAdminInformatio
          data={selectAdmin}
          closeModal={setUpdateAdminInfo}
        />
      </Modal>
      <Modal
        visible={userDetailsModal}
        onCancel={() => setUserDetailsModal(false)}
        footer={null}
        className="user-details-modal"
      >
        {selectAdmin && (
          <div className="flex flex-col items-center">
            <Avatar
              className="!w-24 !h-24"
              src={imageUrl(selectAdmin.profile_image)}
            />
            <h1 className="text-2xl font-bold">{selectAdmin.name}</h1>
            <div className="!w-full p-1 border-1 border-[var(--vg-green-high)] rounded-md">
              <div className="p-2 bg-[var(--bg-green-high)] !text-white flex items-center justify-center font-semibold text-base rounded-md">
                Admin Profile
              </div>
            </div>
            <div className="mt-4 !w-full">
              <p className="font-semibold">Admin Full Name</p>
              <p className="p-2 border border-[#64748B] rounded-md">
                {selectAdmin.name}
              </p>
              <p className="font-semibold mt-2">Email</p>
              <p className="p-2 border border-[#64748B] rounded-md">
                {selectAdmin.email}
              </p>
              <p className="font-semibold mt-2">Phone Number</p>
              <p className="p-2 border border-[#64748B] rounded-md">
                {selectAdmin.phoneNumber}
              </p>
              <p className="font-semibold mt-2">Status</p>
              <p className="p-2 border border-[#64748B] rounded-md">
                {selectAdmin.auth_isActive ? 'Active' : 'Inactive'}
              </p>
              <p className="font-semibold mt-2">Joined Date</p>
              <p className="p-2 border border-[#64748B] rounded-md">
                {new Date(selectAdmin.joined).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-4 !w-full">
              <div className="flex items-center justify-between gap-3">
                <Button
                  type="primary"
                  danger
                  onClick={() => {
                    setUserBlock(selectAdmin.auth_isActive);
                    setBlockUserId(selectAdmin._id);
                    setUserDetailsModal(false);
                    setShowModal(true);
                  }}
                  className="!w-full !border !bg-white !text-red-500 !border-red-500 hover:!text-white hover:!bg-red-500"
                >
                  {selectAdmin.auth_isActive
                    ? 'Block This User'
                    : 'Unblock This User'}
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    setUserDetailsModal(false);
                    setUpdateAdminInfo(true);
                  }}
                  className="!w-full !border !bg-[var(--bg-green-high)] !text-white"
                >
                  Update
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminsTable;
