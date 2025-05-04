import { Avatar, Space, Table, Tabs, Button, Modal } from 'antd';
import React, { useState } from 'react';
import {  EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { FaEye } from 'react-icons/fa';

function PostTable() {
  const posts = [
    {
      key: '1',
      postInfo: 'Los Angeles Lakers —vs— Golden State Warriors',
      img: 'https://xsgames.co/randomusers/avatar.php?g=male',
      postedBy: {
        name: 'Floyd Miles',
        img: 'https://xsgames.co/randomusers/avatar.php?g=male',
        email: 'danten@mail.ru',
      },
      inoformation: {
        sprtType: 'Basketball',
        pradictionType: 'Team',
      },
      prediction: {
        win_rate: '50%',
        odds_range: '1.5',
      },
      email: 'danten@mail.ru',
      postedOn: '2025-04-10',
      targetUser: 'Gold User',
      role: 'Gold User',
    },
    {
      key: '2',
      postInfo: 'Chicago Bulls —vs— Brooklyn Nets',
      img: 'https://xsgames.co/randomusers/avatar.php?g=male',
      postedBy: {
        name: 'Marvin McKinney',
        img: 'https://xsgames.co/randomusers/avatar.php?g=male',
        email: 'redaniel@gmail.com',
      },
      inoformation: {
        sprtType: 'Basketball',
        pradictionType: 'Team',
      },
      prediction: {
        win_rate: '50%',
        odds_range: '1.5',
      },
      email: 'redaniel@gmail.com',
      postedOn: '2025-04-10',
      targetUser: 'Bronze User',
      role: 'Bronze User',
    },
    {
      key: '3',
      postInfo: 'Real Madrid —vs— FC Barcelona',
      img: 'https://xsgames.co/randomusers/avatar.php?g=male',
      postedBy: {
        name: 'Floyd Miles',
        img: 'https://xsgames.co/randomusers/avatar.php?g=male',
        email: 'danten@mail.ru',
      },
      inoformation: {
        sprtType: 'Basketball',
        pradictionType: 'Team',
      },
      prediction: {
        win_rate: '50%',
        odds_range: '1.5',
      },
      email: 'danten@mail.ru',
      postedOn: '2025-04-10',
      targetUser: 'Silver User',
      role: 'Silver User',
    },
  ];

  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const handleTabChange = (key) => {
    switch (key) {
      case '1':
        setFilteredPosts(posts);
        break;
      case '2':
        setFilteredPosts(posts.filter((post) => post.role === 'Gold User'));
        break;
      case '3':
        setFilteredPosts(posts.filter((post) => post.role === 'Silver User'));
        break;
      case '4':
        setFilteredPosts(posts.filter((post) => post.role === 'Bronze User'));
        break;
      default:
        setFilteredPosts(posts);
    }
  };

  const handleEyeClick = (post) => {
    setSelectedPost(post);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedPost(null);
  };

  const columns = [
    {
      title: 'Post Info',
      dataIndex: 'postInfo',
      key: 'postInfo',
      render: (text, record) => (
        <div className="flex items-center">
          <Avatar src={record.img} />
          <div className="ml-3">
            <p className="text-[var(--bg-green-high)] font-bold">{text}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Posted By',
      dataIndex: 'postedBy',
      key: 'postedBy',
      render: (postedBy) => (
        <div className="flex items-center">
          <Avatar src={postedBy.img} />
          <div className="ml-3">
            <h1 className="leading-4">{postedBy.name}</h1>
            <h1 className="leading-4 opacity-70">{postedBy.email}</h1>
          </div>
        </div>
      ),
    },
    {
      title: 'Posted On',
      dataIndex: 'postedOn',
      key: 'postedOn',
    },
    {
      title: 'Target User',
      dataIndex: 'targetUser',
      key: 'targetUser',
      render: (text) => (
        <span
          className={`${
            text === 'Gold User'
              ? 'gold px-3 rounded-md py-1 font-bold'
              : text === 'Silver User'
              ? 'silver px-5 rounded-md py-1'
              : 'bronze px-5 rounded-md py-1'
          } font-bold text-[var(--bg-green-high)] flex items-center justify-center`}
        >
          {text}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            className="!bg-[var(--bg-green-high)] !text-white"
            icon={<FaEye />}
            onClick={() => handleEyeClick(record)}
          />
          <Button
            className="!bg-[var(--bg-green-high)] !text-white"
            icon={<EditOutlined />}
            onClick={() => console.log('Edit:', record.key)}
          />
          <Button
            className="!border-red-500 !text-red-500"
            icon={<DeleteOutlined />}
            onClick={() => console.log('Delete:', record.key)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="1" type="card" onChange={handleTabChange}>
        <Tabs.TabPane tab="All Posts" key="1" />
        <Tabs.TabPane tab="Gold User" key="2" />
        <Tabs.TabPane tab="Silver User" key="3" />
        <Tabs.TabPane tab="Bronze User" key="4" />
      </Tabs>
      <Table
        columns={columns}
        dataSource={filteredPosts}
        rowKey="key"
        pagination={false}
        bordered
      />

      <Modal
        title={selectedPost?.postInfo}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={
          <div className="w-full flex gap-3 items-center justify-end">
            <Button
              key="delete"
              className="!w-full"
              danger
              onClick={() => console.log('Delete Post')}
            >
              Delete Post
            </Button>
            <Button
              key="modify"
              className="!w-full !bg-[var(--bg-green-high)] !text-white"
              onClick={() => console.log('Modify Post')}
            >
              Modify Post
            </Button>
          </div>
        }
      >
        <div className="flex items-center mb-3">
          <Avatar src={selectedPost?.img} />
          <div className="ml-3">
            <h2 className="font-bold">{selectedPost?.postedBy?.name}</h2>
            <p>{selectedPost?.postedBy?.email}</p>
          </div>
        </div>
        <h3>Information</h3>
        <div className="flex items-center justify-between">
          <p>─Sport Type:</p>
          <p>{selectedPost?.inoformation?.sprtType}</p>
        </div>
        <div className="flex items-center justify-between">
          <p>─Prediction Type:</p>
          <p>{selectedPost?.inoformation?.pradictionType}</p>
        </div>
        <h3>Predictions</h3>
        <div className="flex items-center justify-between">
          <p>─Win Rate:</p>
          <p>{selectedPost?.prediction?.win_rate}</p>
        </div>
        <div className="flex items-center justify-between">
          <p>─Odds Range:</p>
          <p>{selectedPost?.prediction?.odds_range}</p>
        </div>
        <h3>Target User</h3>
        <div className="flex items-center justify-between">
          <p>{selectedPost?.targetUser}</p>
          <div
            className={`${
              selectedPost?.targetUser === 'Gold User'
                ? 'gold'
                : selectedPost?.targetUser === 'Silver User'
                ? 'silver'
                : 'bronze'
            } px-3 py-1 text-xs rounded-md`}
          >
            {selectedPost?.targetUser}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default PostTable;
