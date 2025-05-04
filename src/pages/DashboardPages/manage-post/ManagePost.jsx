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
      <PageHeading title="Manage post" />
      <div className="flex mb-4 items-center justify-end w-full">
        <Button
          onClick={showModal}
          className="!bg-[var(--bg-green-high)] !text-[var(--color-white)]"
        >
          <CiCirclePlus /> Add New Post
        </Button>
      </div>
      <PostTable />
      <AddTipModal visible={isModalVisible} onCancel={handleCancel} />
    </div>
  );
}

export default ManagePost;
