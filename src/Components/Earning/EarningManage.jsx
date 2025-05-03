import React from 'react';
import earningImage from '../../assets/icons/earning.svg';
import { FaDollarSign } from 'react-icons/fa6';

function EarningManage() {
  return (
    <div>
      <div className="relative w-full flex z-[999] overflow-hidden h-[250px] items-center justify-between bg-gradient-to-tr from-[#F6F6F6] via-white to-[var(--bg-green-high)]/70 p-12 rounded-xl">
        <div className="absolute top-0 -z-1 left-0 w-full h-full">
          <img
            className="w-full h-full object-cover"
            src={earningImage}
            alt=""
          />
        </div>
        <div className='flex flex-col items-start'>
          <div className='bg-[#FAE8FF] rounded-md p-4 '>
            <FaDollarSign />
          </div>
          <h2 className='text-xl font-semibold !mt-6 leading-none'>Total Earnings</h2>
          <h1 className='text-3xl leading-none'>$23,0900</h1>
        </div>
      </div>
    </div>
  );
}

export default EarningManage;
