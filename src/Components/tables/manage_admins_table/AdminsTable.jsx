import React, { useState } from "react";
import { Table, Tag, Space, Avatar, Button } from "antd";
import { UserOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { FaRegCircle } from "react-icons/fa6";

const AdminsTable = () => {
  const admins = [
    {
      key: "1",
      name: "Theodore Mosciski",
      contactNumber: "901-474-6265",
      email: "maka@yandex.ru",
      joined: "2025-01-10",
      status: "Active",
    },
    {
      key: "2",
      name: "Russell Veum",
      contactNumber: "983-842-7095",
      email: "Nigel16@hotmail.com",
      joined: "2025-01-10",
      status: "Active",
    },
    {
      key: "3",
      name: "Tracy Grady",
      contactNumber: "564-667-5097",
      email: "rrian@yandex.ru",
      joined: "2025-01-10",
      status: "Active",
    },
    {
      key: "4",
      name: "Dana Daniel",
      contactNumber: "443-393-4346",
      email: "rrian@yandex.ru",
      joined: "2025-01-10",
      status: "Inactive",
    },
    {
      key: "5",
      name: "Gerardo Barrows",
      contactNumber: "344-223-4982",
      email: "cido@gmail.com",
      joined: "2025-01-10",
      status: "Inactive",
    },
    {
      key: "6",
      name: "Sheryl Gusikowski",
      contactNumber: "752-792-1071",
      email: "cedennar@gmail.com",
      joined: "2025-01-10",
      status: "Active",
    },
  ];

  // Define columns for the Ant Design Table
  const columns = [
    {
      title: "Admin Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <div className="flex items-center">
          <Avatar
            size="small"
            style={{ marginRight: 8 }}
            src={`https://avatarfiles.alphacoders.com/364/364731.png`}
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
      key: "contactNumber",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Joined",
      dataIndex: "joined",
      key: "joined",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Active" ? "success" : "error"}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button
            className="!bg-[var(--bg-green-high)]"
            type="default"
            icon={<UserOutlined className="!text-white" />}
            size="small"
          />
          <Button
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
          />
          <Button type="default" icon={<FaRegCircle />} size="small" />
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-table">
      <Table
        columns={columns}
        dataSource={admins}
        pagination={{
          position: ["bottomCenter"],
          showSizeChanger: false,
          defaultPageSize: 10,
          showQuickJumper: false,
          size: "small",
        }}
      />
    </div>
  );
};

export default AdminsTable;
