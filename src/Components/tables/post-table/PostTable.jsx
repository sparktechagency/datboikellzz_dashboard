import {
  Avatar,
  Space,
  Table,
  Tabs,
  Button,
  Modal,
  Image,
  Popconfirm,
} from 'antd';
import React, { useState } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { FaEye } from 'react-icons/fa';
import AddTipModal from '../../../pages/DashboardPages/manage-post/AddtipModal';
import toast from 'react-hot-toast';
import {
  useDeletePostMutation,
  useGetPostQuery,
} from '../../../Redux/services/post-admin-service/postApis';
import { imageUrl } from '../../../Utils/server';
function PostTable() {
  const [targetUser, setTargetUser] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { data, isLoading } = useGetPostQuery({ targetUser, page, limit });
  const [deletePostApi] = useDeletePostMutation();
  const postsData = data?.data?.posts || [];
  const meta = data?.data?.meta || {};
  const posts = postsData.map((post) => {
    const postImage = imageUrl(post?.post_image);
    const postedBy = post?.postedBy || {};
    const postedBySuperAdmin = post?.postedBySuperAdmin || {};
    const profileImage = imageUrl(
      postedBySuperAdmin?.profile_image || postedBy?.profile_image
    );

    return {
      key: post?._id,
      postInfo: post?.postTitle,
      img: postImage,
      postedBy: {
        name: postedBySuperAdmin?.name || postedBy?.name || 'Unknown',
        img: profileImage,
        email: postedBySuperAdmin?.email || postedBy?.email || 'N/A',
      },
      inoformation: {
        sprtType: post?.sportType,
        pradictionType: post?.predictionType,
        predictionDescription: post?.predictionDescription,
      },
      prediction: {
        win_rate: post?.winRate + '%',
        odds_range: post?.oddsRange,
      },
      email: postedBy?.email || '',
      postedOn: new Date(post?.createdAt).toLocaleDateString(),
      targetUser: post?.targetUser
        ? post?.targetUser.charAt(0).toUpperCase() +
          post?.targetUser.slice(1) +
          ' User'
        : 'Unknown',
      role: post?.targetUser
        ? post?.targetUser.charAt(0).toUpperCase() +
          post?.targetUser.slice(1) +
          ' User'
        : 'Unknown',
    };
  });

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
          <Avatar src={postedBy?.img} />
          <div className="ml-3">
            <h1 className="leading-4">{postedBy?.name}</h1>
            <h1 className="leading-4 opacity-70">{postedBy?.email}</h1>
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
            size="small"
            className="!bg-[var(--bg-green-high)] !text-white"
            icon={<FaEye />}
            onClick={() => {
              setSelectedPost(record);
              setIsModalVisible(true);
            }}
          />
          <Button
            size="small"
            className="!bg-[var(--bg-green-high)] !text-white"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedPost(record);
              setDetailsVisible(true);
            }}
          />
          <Popconfirm
            title="Are you sure you want to delete this post?"
            onConfirm={() => deletePost(record.key)}
          >
            <Button
              size="small"
              className="!border-red-500 !text-red-500"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const deletePost = async (postId) => {
    try {
      const res = await deletePostApi({ postId });

      if (res?.data?.success) {
        if (setIsModalVisible) {
          setIsModalVisible(false);
          setSelectedPost(null);
          toast.success(res?.data?.message || 'Post deleted successfully!');
        } else
          toast.success(res?.data?.message || 'Post deleted successfully!');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Tab change handler: set targetUser and reset page to 1
  const handleTabChange = (key) => {
    setPage(1);
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

  // Pagination change handler
  const handleTableChange = (pagination) => {
    if (pagination.current !== page) setPage(pagination.current);
    if (pagination.pageSize !== limit) setLimit(pagination.pageSize);
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
        scroll={{ x: 1500 }}
        loading={isLoading}
        rowKey="key"
        pagination={{
          current: meta.page || page,
          pageSize: meta.limit || limit,
          total: meta.total || 0,
          showSizeChanger: false,
          showQuickJumper: false,
          size: 'small',
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
            <Popconfirm
              title="Are you sure you want to delete this post?"
              onConfirm={() => deletePost(selectedPost?.key)}
            >
              <Button key="delete" className="!w-full" danger>
                Delete Post
              </Button>
            </Popconfirm>
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
            <Image src={selectedPost?.img} alt={selectedPost?.postInfo} />
          </div>
          <div className="mt-3 text-2xl">
            <h2 className="font-bold">{selectedPost?.postInfo}</h2>
            <p className="text-sm">
              {selectedPost?.inoformation?.predictionDescription}
            </p>
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
        postEditId={selectedPost?.key}
        details={true}
      />
    </div>
  );
}

export default PostTable;
