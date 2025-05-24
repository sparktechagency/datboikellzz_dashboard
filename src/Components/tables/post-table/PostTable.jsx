import { Avatar, Space, Table, Tabs, Button, Modal } from 'antd';
import React, { useState } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { FaEye } from 'react-icons/fa';
import AddTipModal from '../../../pages/DashboardPages/manage-post/AddtipModal';
import toast from 'react-hot-toast';
import { useGetPostQuery } from '../../../Redux/services/post-admin-service/postApis';
import { imageUrl } from '../../../Utils/server';

function PostTable() {
  // Controlled params for query
  const [targetUser, setTargetUser] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Modal and edit states
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Fetch posts from API with query params
  const { data, isLoading } = useGetPostQuery({
    targetUser,
    page,
    limit,
  });

  // Transform API data to table format
  const posts = (data?.data?.posts || []).map((post) => ({
    key: post._id,
    postInfo: post.postTitle,
    img: imageUrl(post.post_image),
    postedBy: {
      name: post.postedBy?.name || 'Unknown',
      img: imageUrl(post.postedBy?.img),
      email: post.postedBy?.email || 'N/A',
    },
    inoformation: {
      sprtType: post.sportType,
      pradictionType: post.predictionType,
    },
    prediction: {
      win_rate: post.winRate + '%',
      odds_range: post.oddsRange,
    },
    email: post.postedBy?.email || '',
    postedOn: new Date(post.createdAt).toLocaleDateString(),
    targetUser:
      post.targetUser.charAt(0).toUpperCase() +
      post.targetUser.slice(1) +
      ' User',
    role:
      post.targetUser.charAt(0).toUpperCase() +
      post.targetUser.slice(1) +
      ' User',
  }));

  const columns = [
    {
      title: 'Post Info',
      dataIndex: 'postInfo',
      key: 'postInfo',
      render: (text, record) => (
        <div className="flex items-center">
          <div className="w-24 h-14 overflow-hidden rounded-md bg-[var(--bg-green-high)]">
            <img src={record.img} alt={record.postInfo} />
          </div>
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
            text.includes('Gold')
              ? 'gold px-3 rounded-md py-1 font-bold'
              : text.includes('Silver')
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
            onClick={() => {
              setSelectedPost(record);
              setIsModalVisible(true);
            }}
          />
          <Button
            className="!bg-[var(--bg-green-high)] !text-white"
            icon={<EditOutlined />}
            onClick={() => setDetailsVisible(true)}
          />
          <Button
            className="!border-red-500 !text-red-500"
            icon={<DeleteOutlined />}
            onClick={() => toast.success('Post deleted successfully')}
          />
        </Space>
      ),
    },
  ];

  // Tab handler sets targetUser string for query params
  const handleTabChange = (key) => {
    setPage(1); // reset page when tab changes
    switch (key) {
      case '1':
        setTargetUser('');
        break;
      case '2':
        setTargetUser('gold');
        break;
      case '3':
        setTargetUser('silver');
        break;
      case '4':
        setTargetUser('bronze');
        break;
      default:
        setTargetUser('');
    }
  };

  // Handle pagination change from Ant Table
  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setLimit(pagination.pageSize);
  };

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
        dataSource={posts}
        loading={isLoading}
        rowKey="key"
        pagination={{
          current: data?.data?.meta?.page || page,
          pageSize: data?.data?.meta?.limit || limit,
          total: data?.data?.meta?.total || 0,
          showSizeChanger: false,
        }}
        onChange={handleTableChange}
        bordered
      />

      <Modal
        title={selectedPost?.postInfo}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedPost(null);
        }}
        centered
        footer={
          <div className="w-full flex gap-3 items-center justify-end">
            <Button
              key="delete"
              className="!w-full"
              danger
              onClick={() => {
                toast.success('Post deleted successfully');
                setIsModalVisible(false);
                setSelectedPost(null);
              }}
            >
              Delete Post
            </Button>
            <Button
              key="modify"
              className="!w-full !bg-[var(--bg-green-high)] !text-white"
              onClick={() => {
                setDetailsVisible(true);
                setIsModalVisible(false);
              }}
            >
              Modify Post
            </Button>
          </div>
        }
      >
        <div className="flex items-start flex-col mb-3">
          <div className="w-full h-48 overflow-hidden rounded-md">
            <img className='w-full h-full object-cover' src={selectedPost?.img} alt={selectedPost?.postInfo} />
          </div>
          <div className="mt-3 text-2xl">
            <h2 className="font-bold">{selectedPost?.postInfo}</h2>
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
              selectedPost?.targetUser.includes('Gold')
                ? 'gold'
                : selectedPost?.targetUser.includes('Silver')
                ? 'silver'
                : 'bronze'
            } px-3 py-1 text-xs rounded-md`}
          >
            {selectedPost?.targetUser}
          </div>
        </div>
      </Modal>

      <AddTipModal
        visible={detailsVisible}
        onCancel={() => setDetailsVisible(false)}
        details={true}
      />
    </div>
  );
}

export default PostTable;
