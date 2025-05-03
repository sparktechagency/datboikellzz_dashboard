import React from 'react';
import { imageUrl } from '../../../../Utils/server';
import { Avatar } from 'antd';
import DocumentCard from './DocumentCard';
import { UserOutlined } from '@ant-design/icons';
const DriverDetailsTab = ({ driver }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  if (!driver) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-64">
        <UserOutlined style={{ fontSize: '48px', color: '#f9ca24' }} />
        <p className="text-lg mt-4 font-medium">
          No Driver Assigned To This Car
        </p>
        <p className="text-gray-500">
          This vehicle is currently not assigned to any driver.
        </p>
      </div>
    );
  }
  const DetailField = ({ label, value }) => (
    <div className="flex justify-between border-b border-[#dadada] pb-2">
      <span className="text-gray-500 leading-none">{label}:</span>
      <span className="font-medium leading-none">{value}</span>
    </div>
  );
  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <Avatar
          src={imageUrl(driver.profile_image)}
          size={64}
          className="mr-4"
        />
        <div>
          <h3 className="text-xl font-medium">{driver.name}</h3>
          <p className="text-gray-500">{driver.role}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DetailField label="Phone" value={driver.phoneNumber} />
        <DetailField label="Email" value={driver.email} />
        <DetailField label="License Number" value={driver.drivingLicenseNo} />
        <DetailField label="License Type" value={driver.licenseType} />
        <DetailField
          label="License Expiry"
          value={formatDate(driver.licenseExpiry)}
        />
        <DetailField label="ID/Passport Number" value={driver.idOrPassportNo} />
        <DetailField label="Address" value={driver.address} />
        <DetailField label="Account Status" value={driver.userAccountStatus} />
      </div>

      <div className="mt-6">
        <h4 className="font-medium mb-4">Driver Documents</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DocumentCard
            title="ID/Passport"
            imageSrc={driver.id_or_passport_image}
          />
          <DocumentCard
            title="PSV License"
            imageSrc={driver.psv_license_image}
          />
          <DocumentCard
            title="Driving License"
            imageSrc={driver.driving_license_image}
          />
        </div>
      </div>
    </div>
  );
};

export default DriverDetailsTab;
