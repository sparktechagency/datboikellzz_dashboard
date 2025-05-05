import React, { useState } from "react";
import {
  Table,
  Space,
  Avatar,
  Button,
  Modal,
  Select,
  Tabs,
  Form,
  Input,
} from "antd";
import { UserOutlined, PhoneOutlined } from "@ant-design/icons";
import { CgBlock } from "react-icons/cg";
import { IoIosWarning, IoIosMail } from "react-icons/io";
import toast from "react-hot-toast";
import "./alluserVanila.css";
const AllUsers = ({ recentUser }) => {
  const [showModal, setShowModal] = useState(false);
  const [userDetailsModal, setUserDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [blockUserId, setBlockUserId] = useState(null);
  const [isUserBlock, setUserBlock] = useState(false);

  const users = [
    {
      key: "1",
      id: "1",
      name: "Theodore Mosciski",
      contactNumber: "901-474-6265",
      email: "maka@yandex.ru",
      joined: "2025-01-10",
      status: true,
      role: "Gold User",
      isBlocked: false,
      avatar: null,
    },
    {
      key: "2",
      id: "2",
      name: "Russell Veum",
      contactNumber: "983-842-7095",
      email: "Nigell6@hotmail.com",
      joined: "2025-01-10",
      status: false,
      role: "Bronze User",
      isBlocked: true,
      avatar: null,
    },
    {
      key: "3",
      id: "3",
      name: "Tracy Grady",
      contactNumber: "564-667-5097",
      email: "rrian@yandex.ru",
      joined: "2025-01-10",
      status: true,
      role: "Silver User",
      isBlocked: false,
      avatar: null,
    },
    {
      key: "4",
      id: "4",
      name: "Dana Daniel",
      contactNumber: "443-393-4346",
      email: "rrian@yandex.ru",
      joined: "2025-01-10",
      status: false,
      role: "Gold User",
      isBlocked: true,
      avatar: null,
    },
    {
      key: "5",
      id: "5",
      name: "Gerardo Barrows",
      contactNumber: "344-223-4982",
      email: "cido@gmail.com",
      joined: "2025-01-10",
      status: true,
      role: "Bronze User",
      isBlocked: false,
      avatar: null,
    },
    {
      key: "6",
      id: "6",
      name: "Sheryl Gusikowski",
      contactNumber: "752-792-1071",
      email: "cedennar@gmail.com",
      joined: "2025-01-10",
      status: false,
      role: "Silver User",
      isBlocked: true,
      avatar: null,
    },
    {
      key: "7",
      id: "7",
      name: "Lana Kiehn",
      contactNumber: "234-567-8901",
      email: "lana.kiehn@example.com",
      joined: "2025-01-11",
      status: true,
      role: "Gold User",
      isBlocked: false,
      avatar: null,
    },
    {
      key: "8",
      id: "8",
      name: "Sammy Bednar",
      contactNumber: "345-678-9012",
      email: "sammy.bednar@example.com",
      joined: "2025-01-12",
      status: false,
      role: "Bronze User",
      isBlocked: true,
      avatar: null,
    },
    {
      key: "9",
      id: "9",
      name: "Kory Spinka",
      contactNumber: "456-789-0123",
      email: "kory.spinka@example.com",
      joined: "2025-01-13",
      status: true,
      role: "Silver User",
      isBlocked: false,
      avatar: null,
    },
    {
      key: "10",
      id: "10",
      name: "Rosa Kertzmann",
      contactNumber: "567-890-1234",
      email: "rosa.kertzmann@example.com",
      joined: "2025-01-14",
      status: false,
      role: "Gold User",
      isBlocked: true,
      avatar: null,
    },
    {
      key: "11",
      id: "11",
      name: "Hollis Parisian",
      contactNumber: "678-901-2345",
      email: "hollis.parisian@example.com",
      joined: "2025-01-15",
      status: true,
      role: "Bronze User",
      isBlocked: false,
      avatar: null,
    },
    {
      key: "12",
      id: "12",
      name: "Kip Stark",
      contactNumber: "789-012-3456",
      email: "kip.stark@example.com",
      joined: "2025-01-16",
      status: false,
      role: "Silver User",
      isBlocked: true,
      avatar: null,
    },
  ];

  const handleUnblockUser = async () => {
    if (!blockUserId) {
      return toast.error("Please select a user to block");
    }
    toast.success("User successfully unblocked");
    setShowModal(false);
  };

  const handleBlockUser = async () => {
    if (!blockUserId) {
      return toast.error("Please select a user to block");
    }
    toast.success("User successfully blocked");
    setShowModal(false);
  };
  const [filteredUsers, setFilteredUsers] = useState(users);

  const columns = [
    {
      title: "User Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space size="middle">
          <Avatar icon={<UserOutlined />} src={record.avatar} />
          {text}
        </Space>
      ),
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
      key: "contactNumber",
      render: (phone) => (
        <Space>
          <PhoneOutlined />
          {phone}
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => (
        <Space>
          <IoIosMail />
          {email}
        </Space>
      ),
    },
    {
      title: "Joined",
      dataIndex: "joined",
      key: "joined",
    },
    {
      title: "User Type",
      dataIndex: "role",
      width: 200,
      key: "role",
      render: (role) => (
        <span
          className={`${
            role === "Gold User"
              ? "gold px-3 rounded-md py-1  font-bold"
              : role === "Silver User"
              ? "silver px-5 rounded-md py-1"
              : "bronze px-5 rounded-md py-1"
          } font-bold text-[var(--bg-green-high)] flex items-center justify-center`}
        >
          {role}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
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
              record?.isBlocked ? "bg-red-300" : "bg-green-200"
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
      case "1":
        setFilteredUsers(users);
        break;
      case "2":
        setFilteredUsers(users.filter((user) => user.role === "Gold User"));
        break;
      case "3":
        setFilteredUsers(users.filter((user) => user.role === "Silver User"));
        break;
      case "4":
        setFilteredUsers(users.filter((user) => user.role === "Bronze User"));
        break;
      case "5":
        setFilteredUsers(users.filter((user) => user.isBlocked === true));
        break;
      default:
        setFilteredUsers(users);
    }
  };

  const handleSearch = (value) => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(value.toLowerCase()) ||
        user.email.toLowerCase().includes(value.toLowerCase()) ||
        user.contactNumber.includes(value)
    );
    setFilteredUsers(filtered);
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="max-w-[400px]">
        <Form>
          <Form.Item>
            <Input.Search
              placeholder="Search by name, email, or contact number"
              onSearch={handleSearch}
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
        pagination={true}
        bordered
      />

      {/* Modal to confirm block/unblock */}
      <Modal
        visible={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <div className="flex flex-col items-center">
          <IoIosWarning size={60} color="#f6a112" />
          <h1 className="text-2xl font-bold text-black">Warning</h1>
          <p className="text-lg text-black">
            Are you sure you want to {isUserBlock ? "unblock" : "block"} this
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
        visible={userDetailsModal}
        onCancel={() => setUserDetailsModal(false)}
        footer={null}
        className="user-details-modal"
      >
        <div className="flex flex-col items-center">
          <Avatar
            className="!w-24 !h-24"
            src="https://xsgames.co/randomusers/avatar.php?g=male"
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
                toast.success("User blocked");
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
