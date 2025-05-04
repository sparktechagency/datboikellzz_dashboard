import React, { useState } from 'react';
import PageHeading from '../../../Components/Shared/PageHeading';
import PostTable from '../../../Components/tables/post-table/PostTable';
import { Button } from 'antd';
import { CiCirclePlus } from 'react-icons/ci';
import AddTipModal from './AddtipModal';

function ManagePost() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <div className="flex mb-4 items-center justify-between bg-white shadow-sm pr-12 rounded-md w-full">
        <PageHeading title="Manage post" />
        <Button
          onClick={showModal}
          className="!bg-[var(--bg-green-high)] !text-[var(--color-white)]"
        >
          <CiCirclePlus size={20} /> Add New Post
        </Button>
      </div>
      <PostTable />
      <AddTipModal visible={isModalVisible} onCancel={handleCancel} />
    </div>
  );
}

export default ManagePost;
