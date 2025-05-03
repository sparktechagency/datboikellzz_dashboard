import React, { useState } from 'react';
import { Button, Steps, Form, Input, Upload, Select, DatePicker } from 'antd';
import { FaCameraRetro, FaPlus, FaUser } from 'react-icons/fa';
import moment from 'moment';
import { imageUrl } from '../../Utils/server';
import toast from 'react-hot-toast';

const { Step } = Steps;

const DriverRegistrationForm = () => {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    name: 'Hosain',
    email: 'emil@gmail.co',
    address: 'Dhaka',
    password: '23123',
    phoneNumber: '23123',
    idOrPassportNo: 'passport1212',
    drivingLicenseNo: 'drivingLicenseNo12123',
    licenseType: 'licenseType',
    licenseExpiry: moment(2025 - 12 - 31),
    id_or_passport_image: imageUrl(
      'uploads\\id_or_passport_image\\1742352551569-image.png'
    ),
    psv_license_image: imageUrl(
      'uploads\\psv_license_image\\1742352551571-image.png'
    ),
    driving_license_image: imageUrl(
      'uploads\\driving_license_image\\1742352551572-image.png'
    ),
    profile_image: imageUrl(
      'uploads\\profile_image\\1742352551569-sensei-2.png'
    ),
  });

  const [imgUrl, setImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const steps = [
    {
      title: 'General',
      content: 'general-info',
    },
    {
      title: 'Driving',
      content: 'driving-info',
    },
    {
      title: 'Docs',
      content: 'document-info',
    },
    {
      title: 'Car',
      content: 'car-info',
    },
  ];

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      const updatedData = { ...formData, ...values };
      setFormData(updatedData);
      setCurrent(current + 1);
    } catch (error) {
      console.log('Validation failed:', error);
    }
  };

  const handlePrev = () => {
    setCurrent(current - 1);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const finalData = { ...formData, ...values };
      console.log(finalData);
      const submitFormData = new FormData();

      if (imageFile) {
        submitFormData.append('profile_image', imageFile);
      }

      Object.keys(finalData).forEach((key) => {
        if (key !== 'profile_image' && finalData[key] !== undefined) {
          if (finalData[key] && finalData[key].format) {
            submitFormData.append(key, finalData[key].format('YYYY-MM-DD'));
          } else if (
            key === 'id_or_passport_image' ||
            key === 'psv_license_image' ||
            key === 'driving_license_image'
          ) {
            if (finalData[key] && finalData[key].fileList) {
              finalData[key].fileList.forEach((file, index) => {
                if (file.originFileObj) {
                  submitFormData.append(`${key}_${index}`, file.originFileObj);
                }
              });
            }
          } else {
            submitFormData.append(key, finalData[key]);
          }
        }
      });

      console.log('Form data submitted:');
      console.log(submitFormData);

      toast.success('Driver added successfully!');
    } catch (error) {
      console.log('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    toast.info('Registration cancelled');
    form.resetFields();
    setCurrent(0);
    setFormData({});
    setImageUrl(null);
    setImageFile(null);
  };

  const handleAvatarChange = ({ fileList }) => {
    if (fileList.length > 0 && fileList[0].originFileObj) {
      const file = fileList[0].originFileObj;
      setImageFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageUrl(null);
      setImageFile(null);
    }
  };

  const handleRemoveAvatar = (e) => {
    e.stopPropagation();
    setImageUrl(null);
    setImageFile(null);
    form.setFieldsValue({ profile_image: undefined });
  };

  const uploadButton = (
    <div className="flex flex-col items-center border border-gray-600 border-dashed rounded-full w-24 h-24 justify-center">
      {imgUrl ? (
        <div className="relative w-24 h-24">
          <img
            src={imgUrl}
            alt="profile_image"
            className="w-full h-full rounded-full object-cover"
          />

          <div
            className="absolute top-0 right-0 border border-dashed w-6 h-6 bg-red-500 flex items-center justify-center rounded-full cursor-pointer"
            onClick={handleRemoveAvatar}
            title="Remove image"
          >
            <span className="text-white text-xs font-bold">×</span>
          </div>
        </div>
      ) : (
        <div className="flex relative !cursor-pointer w-full h-full flex-col items-center">
          <FaUser className="text-gray-400 !mt-4" size={32} />
          <div className="mt-2 text-gray-500">Upload</div>
          <div className="absolute bottom-0 right-0 border border-dashed w-6 h-6 bg-[var(--bg-green-high)] flex items-center justify-center rounded-full cursor-pointer">
            <FaCameraRetro
              className="!cursor-pointer "
              onClick={(e) => e.stopPropagation()}
              color="white"
            />
          </div>
        </div>
      )}
    </div>
  );

  const documentUploadButton = (
    <div className="flex flex-col items-center">
      <FaPlus />
      <div className="mt-2">Upload</div>
    </div>
  );

  return (
    <div className="w-full max-w-3xl mx-auto py-4">
      <Steps current={current} className="!mb-8">
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <Form
        requiredMark={false}
        form={form}
        layout="vertical"
        initialValues={formData}
      >
        {current === 0 && (
          <div>
            <div className="flex justify-center mb-6">
              <Form.Item name="profile_image" className="mb-6">
                <Upload
                  listType="picture"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={handleAvatarChange}
                  maxCount={1}
                >
                  {uploadButton}
                </Upload>
              </Form.Item>
            </div>

            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please enter name' }]}
            >
              <Input placeholder="Full name" size="large" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input placeholder="Email address" size="large" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter password' }]}
            >
              <Input.Password placeholder="Password" size="large" />
            </Form.Item>

            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: 'Please enter address' }]}
            >
              <Input placeholder="Address" size="large" />
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              label="Contact No"
              rules={[
                { required: true, message: 'Please enter contact number' },
              ]}
            >
              <Input placeholder="Contact number" size="large" />
            </Form.Item>
          </div>
        )}

        {current === 1 && (
          <div>
            <Form.Item
              name="idOrPassportNo"
              label="National ID/Passport"
              rules={[
                {
                  required: true,
                  message: 'Please enter National ID/Passport',
                },
              ]}
            >
              <Input placeholder="National ID/Passport number" size="large" />
            </Form.Item>

            <Form.Item
              name="drivingLicenseNo"
              label="Driving License No"
              rules={[
                {
                  required: true,
                  message: 'Please enter driving license number',
                },
              ]}
            >
              <Input placeholder="Driving license number" size="large" />
            </Form.Item>

            <Form.Item
              name="licenseType"
              label="License Type"
              rules={[{ required: true, message: 'Please enter license type' }]}
            >
              <Input placeholder="License type" size="large" />
            </Form.Item>

            <Form.Item
              name="licenseExpiry"
              label="License Expire"
              rules={[{ required: true, message: 'Please select expiry date' }]}
            >
              <DatePicker
                placeholder="Select date"
                size="large"
                style={{ width: '100%' }}
                format="DD MMM YYYY"
              />
            </Form.Item>
          </div>
        )}

        {current === 2 && (
          <div>
            <Form.Item name="id_or_passport_image" label="National ID/Passport">
              <Upload listType="picture-card" beforeUpload={() => false}>
                {documentUploadButton}
              </Upload>
            </Form.Item>

            <Form.Item name="psv_license_image" label="PSV License">
              <Upload listType="picture-card" beforeUpload={() => false}>
                {documentUploadButton}
              </Upload>
            </Form.Item>

            <Form.Item name="driving_license_image" label="Driving License">
              <Upload listType="picture-card" beforeUpload={() => false}>
                {documentUploadButton}
              </Upload>
            </Form.Item>
          </div>
        )}

        {current === 3 && (
          <div>
            <Form.Item
              name="assignedCar"
              label="Assign A Car"
              rules={[{ required: true, message: 'Please select a car' }]}
            >
              <Select placeholder="Select an available car" size="large">
                <Select.Option value="car1">
                  Toyota Camry (ABC123)
                </Select.Option>
                <Select.Option value="car2">Honda Civic (XYZ789)</Select.Option>
                <Select.Option value="car3">
                  Ford Explorer (DEF456)
                </Select.Option>
              </Select>
            </Form.Item>
          </div>
        )}
      </Form>

      <div className="flex justify-between mt-6">
        <Button danger size="large" className="px-8" onClick={handleCancel}>
          Cancel
        </Button>

        <div className="flex gap-4 items-center">
          {current > 0 && (
            <Button size="large" className="mr-2" onClick={handlePrev}>
              Previous
            </Button>
          )}

          <Button
            type="primary"
            size="large"
            className="px-8 !bg-purple-600"
            onClick={current < steps.length - 1 ? handleNext : handleSubmit}
          >
            {current < steps.length - 1 ? 'Next' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DriverRegistrationForm;
