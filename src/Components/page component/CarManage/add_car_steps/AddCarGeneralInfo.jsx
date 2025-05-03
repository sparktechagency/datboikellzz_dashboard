import React from 'react';
import { Form, Input } from 'antd';

const AddCarGeneralInfo = ({ form }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">General Car Information</h3>
      <Form layout="vertical" form={form}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="brand"
            label="Brand"
            rules={[{ required: true, message: 'Please select the car brand' }]}
          >
            <Input placeholder="E.g., Toyota, Honda, Ford" />
          </Form.Item>

          <Form.Item
            name="model"
            label="Model"
            rules={[{ required: true, message: 'Please enter the car model' }]}
          >
            <Input placeholder="E.g., Camry, Civic, F-150" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: 'Please select the car type' }]}
          >
            <Input placeholder="E.g., Sedan, SUV, Hatchback" />
          </Form.Item>

          <Form.Item
            name="color"
            label="Color"
            rules={[{ required: true, message: 'Please enter the car color' }]}
          >
            <Input placeholder="E.g., Black, White, Silver" />
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default AddCarGeneralInfo;
