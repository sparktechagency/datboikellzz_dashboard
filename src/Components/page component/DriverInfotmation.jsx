import React from 'react';
import { Divider, Tabs } from 'antd';
import General from './DrivingInformation Parts/General';
import Driving from './DrivingInformation Parts/Driving';
import Car from './DrivingInformation Parts/Car';
import Documents from './DrivingInformation Parts/Documents';
import Statics from './DrivingInformation Parts/Statics';
import { useGetDriverQuery } from '../../Redux/services/dashboard apis/userApis/driverApis';
import { imageUrl } from '../../Utils/server';
const onChange = (key) => {
  console.log(key);
};
function DriverInfotmation({ id }) {
  const { data, isLoading } = useGetDriverQuery({ id });

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center flex-col justify-center">
          <div className="w-24 h-24 bg-gray-200 animate-pulse rounded-full"></div>
          <div className="w-full">
            <Divider></Divider>
            <div className=" flex items-start gap-2 justify-start">
              {Array.from({ length: 7 }).map((_, x) => (
                <div
                  key={x}
                  className="w-12 h-3 bg-gray-200 animate-pulse rounded-md mb-2"
                ></div>
              ))}
            </div>
            <div className="w-56 mt-7 h-4 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="w-32 mt-2  h-4 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="w-56 mt-7 h-4 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="w-32 mt-2  h-4 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="w-56 mt-7 h-4 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="w-32 mt-2  h-4 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="w-56 mt-7 h-4 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="w-32 mt-2  h-4 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="w-56 mt-7 h-4 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="w-32 mt-2  h-4 bg-gray-200 animate-pulse rounded-md"></div>
          </div>
        </div>
      </div>
    );
  }

  const driver_data = data?.data;
  console.log(driver_data);
  const driver_data_genarale = {
    name: driver_data?.name || 'N/A',
    email: driver_data?.email || 'N/A',
    role: driver_data?.role || 'N/A',
    profile_image: driver_data?.profile_image || 'N/A',
    phone_number: driver_data?.phoneNumber || 'N/A',
    address: driver_data?.address || 'N/A',
    isOnline: driver_data?.isOnline || 'N/A',
  };

  const driver_data_driving = {
    idOrPassportNo: driver_data?.idOrPassportNo || 'N/A',
    drivingLicenseNo: driver_data?.drivingLicenseNo || 'N/A',
    licenseType: driver_data?.licenseType || 'N/A',
    licenseExpiry: driver_data?.licenseExpiry || 'N/A',
  };

  const items = [
    {
      key: '1',
      label: 'Genaral',
      children: <General data={driver_data_genarale} />,
    },
    {
      key: '2',
      label: 'Driving',
      children: <Driving data={driver_data_driving} />,
    },
    {
      key: '3',
      label: 'Car',
      children: <Car data={driver_data} />,
    },
    {
      key: '4',
      label: 'Documents',
      children: <Documents data={driver_data} />,
    },
    {
      key: '5',
      label: 'Statics',
      children: <Statics data={driver_data} />,
    },
  ];
  return (
    <div>
      <div className="w-full flex items-center justify-center">
        <div className="w-24 h-24 rounded-full overflow-hidden shadow">
          <img
            className="w-full h-full object-cover"
            src={imageUrl(driver_data_genarale.profile_image)}
            alt="Profile"
          />
        </div>
      </div>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
}

export default DriverInfotmation;
