import { Button } from 'antd';
import React from 'react';
import { imageUrl } from '../../../Utils/server';

function Documents({ data }) {
  return (
    <div>
      <h1 className="text-base text-[#222]]">
        National ID/Passport :: <br />{' '}
        <div className="w-48 h-28 rounded-md overflow-hidden mb-3">
          <img
            className="w-full h-full object-cover"
            src={imageUrl(data?.id_or_passport_image)}
            alt=""
          />
        </div>
      </h1>
      <h1 className="text-base text-[#222]]">
        PSV License :
        <br />{' '}
        <div className="w-48 h-28 rounded-md overflow-hidden mb-3">
          <img
            className="w-full h-full object-cover"
            src={imageUrl(data?.psv_license_image)}
            alt=""
          />
        </div>
      </h1>
      <h1 className="text-base text-[#222]]">
        Driving License : <br />
        <div className="w-48 h-28 rounded-md overflow-hidden mb-3">
          <img
            className="w-full h-full object-cover"
            src={imageUrl(data?.driving_license_image)}
            alt=""
          />
        </div>
      </h1>
    </div>
  );
}

export default Documents;
