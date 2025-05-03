import React, { useState } from 'react';
import { Table, Space, Avatar, Button, Modal, Tabs, Popconfirm } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { imageUrl } from '../../../Utils/server';
import DocumentCard from '../../page component/CarManage/CarDetails/DocumentCard';
import DriverDetailsTab from '../../page component/CarManage/CarDetails/DriverDetailsTab';
import {
  useDeleteCarMutation,
  useGetAllCarsQuery,
} from '../../../Redux/services/carApis';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const CarImage = ({ src }) => (
  <div className="w-16 h-16 rounded-md overflow-hidden">
    <img src={imageUrl(src)} alt="Car" className="w-full h-full object-cover" />
  </div>
);

const DriverInfo = ({ driver }) => {
  if (!driver) {
    return (
      <div className="flex items-center text-yellow-600">
        <UserOutlined className="mr-2" />
        <span>No Driver Assigned To This Car</span>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <Avatar
        src={imageUrl(driver.profile_image)}
        size={32}
        className="mr-2"
        icon={<UserOutlined />}
      />
      <span>{driver.name}</span>
    </div>
  );
};

const handleDeleteCar = async (carId, deleteCar) => {
  try {
    console.log(`Car with ID: ${carId} is being deleted.`);
    const id = { carId };
    const res = await deleteCar(id).unwrap();
    console.log(res);
    if (res.success) {
      toast.success(res.message);
    }
  } catch (error) {
    console.log(error);
  }
};

const ActionButtons = ({ record, onViewDetails, deleteCar }) => (
  <Space size="small">
    <Button
      type="primary"
      shape="circle"
      icon={<EyeOutlined />}
      onClick={() => onViewDetails(record)}
      className="bg-blue-400 hover:bg-blue-500"
    />
    <Link to={`/car-management/edit-car/${record._id}`} state={record._id}>
      <Button
        type="primary"
        shape="circle"
        icon={<EditOutlined />}
        className="bg-green-400 hover:bg-green-500"
      />
    </Link>
    <Popconfirm
      placement="topRight"
      title={'Are you sure you want to delete this car?'}
      description={'This action cannot be undone.'}
      okText="Yes"
      cancelText="No"
      onConfirm={() => handleDeleteCar(record._id, deleteCar)}
    >
      <Button danger shape="circle" icon={<DeleteOutlined />} />
    </Popconfirm>
  </Space>
);

const DetailField = ({ label, value }) => (
  <div className="flex justify-between border-b border-[#dadada] pb-2">
    <span className="text-gray-500 leading-none">{label}:</span>
    <span className="font-medium leading-none">{value}</span>
  </div>
);

const ImageThumbnails = ({ images, activeIndex, onSelect }) => (
  <div className="flex flex-wrap gap-2 mb-4">
    {images.map((image, index) => (
      <div
        key={index}
        className={`w-24 h-24 rounded-lg overflow-hidden cursor-pointer ${
          activeIndex === index ? 'ring-2 ring-blue-500' : ''
        }`}
        onClick={() => onSelect(index)}
      >
        <img
          src={imageUrl(image)}
          alt={`Car view ${index + 1}`}
          className="w-full h-full object-cover"
        />
      </div>
    ))}
  </div>
);

const CarDetailsTab = ({ car }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const details = [
    { label: 'Car Brand', value: car.brand },
    { label: 'Car Model', value: car.model },
    { label: 'Car Type', value: car.type },
    { label: 'Color', value: car.color },
    { label: 'License Plate', value: car.carLicensePlate },
    { label: 'EVP Number', value: car.evpNumber },
    { label: 'EVP Expiry Date', value: formatDate(car.evpExpiry) },
    { label: 'Registration Date', value: formatDate(car.registrationDate) },
    {
      label: 'Insurance Status',
      value: car.insuranceStatus === 'active' ? 'Active' : 'Inactive',
    },
  ];

  if (car.assignedDriver) {
    details.push({
      label: 'Assigned Driver',
      value: car.assignedDriver.name,
    });
    details.push({
      label: 'Driver License',
      value: car.assignedDriver.drivingLicenseNo,
    });
    details.push({
      label: 'License Expiry',
      value: formatDate(car.assignedDriver.licenseExpiry),
    });
  } else {
    details.push({
      label: 'Driver Status',
      value: 'No Driver Assigned',
    });
  }

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <div className="mb-6">
            <img
              src={imageUrl(car.car_image[activeImageIndex])}
              alt="Car"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          <ImageThumbnails
            images={car.car_image}
            activeIndex={activeImageIndex}
            onSelect={setActiveImageIndex}
          />
        </div>
        <div className="w-full md:w-1/2">
          <div className="grid grid-cols-1 gap-4">
            {details.map((item, index) => (
              <DetailField key={index} label={item.label} value={item.value} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const DocumentsTab = ({ car }) => (
  <div className="p-4">
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2">Vehicle Documents</h3>
      <p className="text-gray-500 mb-4">
        All official documents related to this vehicle
      </p>

      <div>
        <DocumentCard title="Vehicle Grant" imageSrc={car.car_grant_image} />
        <DocumentCard
          title="Vehicle Insurance"
          imageSrc={car.car_insurance_image}
        />
        <DocumentCard
          title="E-hailing Vehicle Permit"
          imageSrc={car.e_hailing_car_permit_image}
        />
      </div>
    </div>
  </div>
);

const CarManagementTable = () => {
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [deleteCar, { isLoading: deletingCar }] = useDeleteCarMutation();

  const handleViewDetails = (car) => {
    setSelectedCar(car);
    setDetailModalVisible(true);
  };

  const columns = [
    {
      title: 'Car Image',
      dataIndex: 'car_image',
      key: 'carImage',
      render: (images) => <CarImage src={images?.[0]} />,
    },
    {
      title: 'Car Brand/Model',
      dataIndex: 'brand',
      key: 'carBrand',
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-sm text-gray-500">{record.model}</div>
        </div>
      ),
    },
    {
      title: 'Car Plate/Color',
      dataIndex: 'carLicensePlate',
      key: 'carPlate',
      render: (text, record) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-sm text-gray-500">{record.color}</div>
        </div>
      ),
    },
    {
      title: 'Assigned Driver',
      dataIndex: 'assignedDriver',
      key: 'assignedDriver',
      render: (driver) => <DriverInfo driver={driver} />,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <ActionButtons
          record={record}
          onViewDetails={handleViewDetails}
          deleteCar={deleteCar}
          loading={deletingCar}
        />
      ),
    },
  ];

  const { data: carsData, isLoading: carsDataLoading } = useGetAllCarsQuery();

  if (!carsDataLoading && carsData?.data?.cars) {
    console.log(carsData.data.cars);
  }

  const getTabItems = (car) => {
    const tabs = [
      {
        key: '1',
        label: 'Car Details',
        children: <CarDetailsTab car={car} />,
      },
      {
        key: '2',
        label: 'Driver Details',
        children: <DriverDetailsTab driver={car.assignedDriver} />,
      },
      {
        key: '3',
        label: 'Car Documents',
        children: <DocumentsTab car={car} />,
      },
    ];

    return tabs;
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table
        columns={columns}
        dataSource={carsData?.data?.cars}
        rowKey="_id"
        loading={carsDataLoading}
        pagination={{ pageSize: 10 }}
      />

      {selectedCar && (
        <Modal
          title={`${selectedCar.brand} ${selectedCar.model}`}
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={null}
          width={800}
        >
          <Tabs defaultActiveKey="1" items={getTabItems(selectedCar)} />
        </Modal>
      )}
    </div>
  );
};

export default CarManagementTable;
