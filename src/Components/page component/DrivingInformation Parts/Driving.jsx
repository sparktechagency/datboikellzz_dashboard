import { Button } from 'antd';
import React from 'react';

  function Driving({ data }) {
    return (
      <div>
        <h1 className="text-base text-[#222]]">
          National ID/Passport :: <br />{' '}
          <span className="text-gray-500">{data?.idOrPassportNo || 'N/A'}</span>
        </h1>
        <h1 className="text-base text-[#222]]">
          Driving License No :
          <br /> <span className="text-gray-500">{data?.drivingLicenseNo || 'N/A'}</span>
        </h1>
        <h1 className="text-base text-[#222]]">
          License Type : <br />
          <span className="text-gray-500">{data?.licenseType || 'N/A'}</span>
        </h1>
        <h1 className="text-base text-[#222]]">
          License Expire : <br />
          <span className="text-gray-500">{data?.licenseExpiry || 'N/A'}</span>
        </h1>
      </div>
    );
  }


export default Driving;
