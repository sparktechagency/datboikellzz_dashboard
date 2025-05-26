import React, { useState } from 'react';
import {
  Table,
  Tag,
  Space,
  Avatar,
  Button,
  Modal,
  Form,
  Input,
  Popconfirm,
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { FaLock, FaRegCircle } from 'react-icons/fa6';
import { IoIosWarning } from 'react-icons/io';
import toast from 'react-hot-toast';
import Success from '../../Shared/Success';
import CreateNewAdmin from './CreateNewAdmin';
import UpdateAdminInformatio from './UpdateAdminInformatio';
import {
  useAdminBlockMutation,
  useGetAllAdminsQuery,
} from '../../../Redux/services/dashboard apis/createAdmin/adminApis';
import { imageUrl } from '../../../Utils/server';
import AdminPasswordChange from './AdminPasswordChange';
import debounce from 'debounce';
const AdminsTable = () => {
  const [createNewAdminModal, setCreateNewAdminModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [updateAdminInfo, setUpdateAdminInfo] = useState(false);
  const [selectAdmin, setSelectAdmin] = useState(null);
  const [userDetailsModal, setUserDetailsModal] = useState(false);

  const [paramsData, setParamsData] = useState({
    searchTerm: '',
  });
  const { data: adminData, isLoading: dataLoading } = useGetAllAdminsQuery({
    searchTerm: paramsData.searchTerm,
    page: currentPage,
  });
  const [updateAdminStatus] = useAdminBlockMutation();
  const [passwordModal, setPasswordModal] = useState(false);
  const adminsData = adminData?.data?.admins?.map((admin) => ({
    _id: admin?._id,
    auth_id: admin?.authId?._id || 'N/A',
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
        <Tag color={record.auth_isBlocked === true ? 'red' : 'green'}>
          {record.auth_isBlocked === true ? 'Blocked' : 'unblocked'}
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
            onClick={() => {
              setSelectAdmin(record);
              setPasswordModal(true);
            }}
            className="!bg-[var(--bg-green-high)]"
            type="default"
            icon={<FaLock className="!text-white" />}
            size="small"
          />
          {/* <Popconfirm
            placement="bottomRight"
            title="Are you sure you want to delete this user?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => deleteUser(record?._id)}
          >
            <Button
              danger
              type="default"
              icon={<DeleteOutlined />}
              size="small"
            />
          </Popconfirm> */}
          <Popconfirm
            placement="bottomRight"
            title={`Are you sure you want to ${
              record.auth_isBlocked === true ? 'unblock' : 'block'
            } this user?`}
            okText="Yes"
            cancelText="No"
            onConfirm={() => blockUser(record?.auth_id, record?.auth_isBlocked)}
          >
            <Button
              className={`${
                record?.auth_isBlocked === true
                  ? '!text-red-500'
                  : '!text-green-500'
              }`}
              type="default"
              icon={<FaRegCircle />}
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // const deleteUser = async (id) => {
  //   try {
  //     if (!id) {
  //       return;
  //     }
  //     const res = await deleteAdmin({ id });
  //     if (res?.data?.success) {
  //       toast.success(res?.data?.message || 'User deleted successfully');
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const blockUser = async (id, status) => {
    try {
      if (!id && !status) {
        return;
      }

      const data = {
        authId: id,
        isBlocked: `${status === true ? 'no' : 'yes'}`,
      };
      const res = await updateAdminStatus({ data });
      if (res?.data?.success) {
        toast.success(res?.data?.message || 'User updated successfully');
      } else {
        toast.error(res?.data?.message || 'something went wrong!');
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || 'something went wrong!');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const debouncedSearch = debounce((searchTerm) => {
    setCurrentPage(1);
    setParamsData({ searchTerm });
  }, 500);

  const handleSearch = (e) => {
    debouncedSearch(e.target.value);
  };
  return (
    <div className="admin-table">
      <h1 className="text-2xl font-bold">Admins</h1>
      <div className="flex !items-start justify-between">
        <div className="max-w-[400px] min-w-[400px]">
          <Form className="!w-full !h-fit">
            <Form.Item>
              <Input.Search
                placeholder="Search by name or email"
                onChange={handleSearch}
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
        scroll={{ x: 1500 }}
        loading={dataLoading}
        pagination={{
          pageSize: metaData?.limit,
          current: currentPage,
          total: metaData?.total,
          onChange: handlePageChange,
          size: 'small',
        }}
      />

      <Modal open={createNewAdminModal} footer={null} closeIcon={false}>
        <CreateNewAdmin closeModal={setCreateNewAdminModal} />
      </Modal>
      <Modal centered open={updateAdminInfo} footer={null} closeIcon={false}>
        <UpdateAdminInformatio
          data={selectAdmin}
          closeModal={setUpdateAdminInfo}
        />
      </Modal>
      <Modal centered open={passwordModal} footer={null} closeIcon={false}>
        <AdminPasswordChange data={selectAdmin} closeModal={setPasswordModal} />
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
                {/* <Popconfirm
                  placement="bottomRight"
                  title={`Are you sure you want to ${
                    selectAdmin.auth_isBlocked === true ? 'unblock' : 'block'
                  } this user?`}
                  onConfirm={() =>
                    blockUser(selectAdmin.auth_id, selectAdmin.auth_isBlocked)
                  }
                >
                  <Button
                    type="primary"
                    danger
                    className="!w-full !border !bg-white !text-red-500 !border-red-500 hover:!text-white hover:!bg-red-500"
                  >
                    {selectAdmin.auth_isBlocked
                      ? 'Block This User'
                      : 'Unblock This User'}
                  </Button>
                </Popconfirm> */}
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
