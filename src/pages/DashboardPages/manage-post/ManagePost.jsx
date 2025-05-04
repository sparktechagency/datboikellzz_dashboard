import React from 'react';
import PageHeading from '../../../Components/Shared/PageHeading';
import PostTable from '../../../Components/tables/post-table/PostTable';
import { Button, Upload } from 'antd';
import { CiCirclePlus } from 'react-icons/ci';
import { UploadOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
function ManagePost() {
  return (
    <div>
      <PageHeading title="Manage post" />
      <div className="flex mb-4 items-center justify-end w-full">
        <Link to="/create-post">
          <Button
            onClick={() => {}}
            className="!bg-[var(--bg-green-high)] !text-[var(--color-white)] "
          >
            <CiCirclePlus /> Add New Post
          </Button>
        </Link>
      </div>
      <PostTable />
    </div>
  );
}

export default ManagePost;
