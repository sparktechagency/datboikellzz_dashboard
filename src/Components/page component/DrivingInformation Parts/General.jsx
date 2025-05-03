import { Button } from 'antd';
import React from 'react';

function General({ data }) {
  return (
    <div>
      <h1 className="text-base text-[#222]]">
        Name: <br /> <span className="text-gray-500">{data?.name}</span>
      </h1>
      <h1 className="text-base text-[#222]]">
        Email:
        <br /> <span className="text-gray-500">{data?.email}</span>
      </h1>
      <h1 className="text-base text-[#222]]">
        Password: <br />
        <span className="text-gray-500">{data?.password}</span>
      </h1>
      <h1 className="text-base text-[#222]]">
        Address: <br />
        <span className="text-gray-500">{data?.address}</span>
      </h1>
      <h1 className=" text-base text-[#222]]">
        Contact No :
        <br /> <span className="text-gray-500">{data?.phone_number}</span>
      </h1>
      <Button className="!w-full hover:!bg-[var(--bg-green-high !bg-[var(--bg-green-high)] !text-white">
        Edit
      </Button>
    </div>
  );
}

export default General;
