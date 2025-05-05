import React, { useState } from 'react';
import { Modal, Button, Input, Select, Form, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';

const AddTipModal = ({ visible, onCancel, onSubmit, details }) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const data = {
    tipTitle: 'Exciting Tip',
    tipDescription: 'An insightful prediction for the upcoming match.',
    tipImage: '/images/tip.jpg',
    postImage: '/images/post.jpg',
    postImageName: 'post.jpg',
    sportType: 'basketball',
    predictionType: 'spread',
    winRate: '75%',
    targetUser: 'sportsFan123',
    oddsRange: '1.5 - 2.0',
  };
  const steps = [
    {
      title: 'Image Upload',
      name: 'postImage',
      fields: ['postImage'],
    },
    {
      title: 'Tip Info',
      fields: ['tipTitle', 'sportType', 'predictionType'],
    },
    {
      title: 'Win Rate',
      fields: ['winRate', 'targetUser', 'oddsRange'],
    },
  ];

  const formFields = {
    tipTitle: {
      label: 'Tip Title',
      name: 'tipTitle',
      rules: [{ required: true, message: 'Please enter the tip title' }],
      component: <Input placeholder="Enter the Tip Title" />,
    },
    sportType: {
      label: 'Sport Type',
      name: 'sportType',
      rules: [{ required: true, message: 'Please select a sport type' }],
      component: (
        <Select placeholder="Select One">
          <Select.Option value="basketball">Basketball</Select.Option>
          <Select.Option value="football">Football (Soccer)</Select.Option>
          <Select.Option value="tennis">Tennis</Select.Option>
          <Select.Option value="ufc">UFC</Select.Option>
          <Select.Option value="nfl">NFL</Select.Option>
        </Select>
      ),
    },
    predictionType: {
      label: 'Prediction Type',
      name: 'predictionType',
      rules: [{ required: true, message: 'Please select a prediction type' }],
      component: (
        <Select placeholder="Select One">
          <Select.Option value="overUnder">Over/Under</Select.Option>
          <Select.Option value="moneyline">Moneyline</Select.Option>
          <Select.Option value="spread">Spread</Select.Option>
          <Select.Option value="handicap">Handicap</Select.Option>
        </Select>
      ),
    },
    winRate: {
      label: 'Win Rate',
      name: 'winRate',
      rules: [{ required: true, message: 'Please enter the win rate' }],
      component: <Input placeholder="Enter the Win Rate" />,
    },
    targetUser: {
      label: 'Target User',
      name: 'targetUser',
      rules: [{ required: true, message: 'Please select a target user' }],
      component: (
        <Select placeholder="Select One">
          <Select.Option value="allUser">All User</Select.Option>
          <Select.Option value="goldUser">Gold User</Select.Option>
          <Select.Option value="silverUser">Silver User</Select.Option>
          <Select.Option value="bronzeUser">Bronze User</Select.Option>
        </Select>
      ),
    },
    oddsRange: {
      label: 'Odds Range',
      name: 'oddsRange',
      rules: [{ required: true, message: 'Please enter the odds range' }],
      component: <Input placeholder="Enter the Odds Range" />,
    },
    postImage: {
      label: 'Upload Post Image',
      name: 'postImage',
      rules: [{ required: true, message: 'Please upload a post image' }],
      component: (
        <Upload listType="picture-card" maxCount={1} beforeUpload={() => false}>
          <Button icon={<UploadOutlined />}>Upload Picture</Button>
        </Upload>
      ),
    },
  };

  const handleNext = async () => {
    try {
      await form.validateFields(steps[currentStep].fields);
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFinish = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const dataPayload = { ...values };

      let file = null;
      if (
        values.postImage &&
        values.postImage.fileList &&
        values.postImage.fileList.length > 0
      ) {
        file = values.postImage.fileList[0].originFileObj;

        delete dataPayload.postImage;

        dataPayload.postImageName = file.name;
      }

      console.log('All form data collected from all steps:', dataPayload);

      const formData = new FormData();

      formData.append('data', JSON.stringify(dataPayload));

      if (file) {
        formData.append('postImage', file);
      }

      console.log('FormData created with the following keys:');
      for (let key of formData.keys()) {
        console.log(`- ${key}`);
      }

      if (onSubmit) {
        await onSubmit(formData, dataPayload);
        toast.success('Tip added successfully!');
      } else {
        console.log('Form ready for API submission');
      }

      onCancel();
      form.resetFields();
      setCurrentStep(0);
    } catch (error) {
      console.error('Submission failed:', error);
      toast.error('Failed to add tip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getFooterButtons = () => {
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === steps.length - 1;

    return (
      <div className="flex justify-between gap-3 w-full">
        {isFirstStep ? (
          <Button
            className="!bg-red-50 !w-full !text-red-500"
            onClick={onCancel}
          >
            Cancel
          </Button>
        ) : (
          <Button
            className="!bg-red-50 !w-full !text-red-500"
            onClick={handlePrevious}
          >
            Previous
          </Button>
        )}
        {isLastStep ? (
          <Button
            className="!bg-[var(--bg-green-high)] !w-full !text-white"
            type="primary"
            onClick={handleFinish}
            loading={loading}
          >
            Save
          </Button>
        ) : (
          <Button
            className="!bg-[var(--bg-green-high)] !w-full !text-white"
            type="primary"
            onClick={handleNext}
          >
            Next
          </Button>
        )}
      </div>
    );
  };

  const renderStepFields = () => {
    const currentFields = steps[currentStep].fields;
    return currentFields.map((fieldName) => {
      const field = formFields[fieldName];
      return (
        <Form.Item
          key={field.name}
          label={field.label}
          name={field.name}
          rules={field.rules}
          className="mb-4"
        >
          {field.component}
        </Form.Item>
      );
    });
  };

  return (
    <Modal
      title={
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl">Add New Tip</h1>
          <div className="mb-6">
            <p className="!font-normal !text-center mb-4">
              Share a new prediction with your users. Fill out the match
              details, betting type, and insights to help users make informed
              decisions.
            </p>
          </div>
        </div>
      }
      open={visible}
      onCancel={() => {
        form.resetFields();
        setCurrentStep(0);
        onCancel();
      }}
      footer={getFooterButtons()}
      width={600}
    >
      <Form
        initialValues={details && data}
        requiredMark={false}
        form={form}
        layout="vertical"
      >
        {renderStepFields()}
      </Form>
    </Modal>
  );
};

export default AddTipModal;
