import React, { useEffect } from 'react';
import { Form, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { imageUrl } from '../../../../Utils/server';

const { Dragger } = Upload;

const AddCarDocument = ({ form, initialValues }) => {
  console.log(initialValues)
  useEffect(() => {
    if (!initialValues) return;
    form.setFieldsValue({
      car_grant_image: imageUrl(initialValues?.car_grant_image),
      car_insurance_image: imageUrl(initialValues?.car_insurance_image),
      e_hailing_car_permit_image: imageUrl(
        initialValues?.e_hailing_car_permit_image
      ),
      
    });
  }, [initialValues, form]);

  const getUploadProps = (fieldName) => ({
    beforeUpload: () => false,
    maxCount: 1,
    accept: '.pdf,.jpg,.jpeg,.png',
    onChange: (info) => {
      const { fileList } = info;
      if (fileList.length > 0) {
        fileList[0].originFileObj;
        const fieldValue = { fileList };
        form.setFieldsValue({ [fieldName]: fieldValue });
      }
    },
    onRemove: () => {
      form.setFieldsValue({ [fieldName]: undefined });
      message.info('File removed');
    },
  });
  console.log(initialValues?.car_grant_image);
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Vehicle Documents</h3>
      <Form initialValues={initialValues} layout="vertical" form={form}>
        <div className="space-y-6">
          <Form.Item
            name="car_grant_image"
            label="Vehicle Grant Document"
            rules={[
              {
                required: true,
                message: 'Please upload the vehicle grant document',
              },
            ]}
          >
            <Dragger {...getUploadProps('car_grant_image')}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag vehicle grant document to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single PDF, JPG, JPEG or PNG file.
              </p>
            </Dragger>
          </Form.Item>

          <Form.Item
            name="car_insurance_image"
            label="Insurance Certificate"
            rules={[
              {
                required: true,
                message: 'Please upload the insurance certificate',
              },
            ]}
          >
            <Dragger {...getUploadProps('car_insurance_image')}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag insurance certificate to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single PDF, JPG, JPEG or PNG file.
              </p>
            </Dragger>
          </Form.Item>

          <Form.Item
            name="e_hailing_car_permit_image"
            label="E-Hailing Car Permit"
            rules={[
              {
                required: true,
                message: 'Please upload the e-hailing car permit',
              },
            ]}
          >
            <Dragger {...getUploadProps('e_hailing_car_permit_image')}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag e-hailing car permit to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single PDF, JPG, JPEG or PNG file.
              </p>
            </Dragger>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default AddCarDocument;
