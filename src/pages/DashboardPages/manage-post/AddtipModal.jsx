/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, Select, Form, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import {
  useCreatePostMutation,
  usePostTypeQuery,
  useSinglePostGetQuery,
  useUpdatePostMutation,
} from '../../../Redux/services/post-admin-service/postApis';
import { url } from '../../../Utils/server';

const AddTipModal = ({ visible, onCancel, onSubmit, details, postEditId }) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const { data: postType, isLoading: postTypeLoading } = usePostTypeQuery();
  const { data: singlePost, isLoading: singlePostLoading } =
    useSinglePostGetQuery({ postId: postEditId }, { skip: !postEditId });

  const [createPost] = useCreatePostMutation(undefined, { skip: postEditId });
  const [updatePost] = useUpdatePostMutation(undefined, { skip: !postEditId });
  console.log(postType?.data?.sportTypes);
  const steps = [
    {
      title: 'Image Upload',
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
          {postType?.data?.sportTypes?.map((item) => (
            <Select.Option value={item?.name}>{item?.name}asdas</Select.Option>
          ))}
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
      component: <Input placeholder="e.g. 75%" />,
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
      component: <Input placeholder="e.g. 1.5 - 2.0" />,
    },
    postImage: {
      label: 'Post Image',
      name: 'postImage',
      rules: [{ required: true, message: 'Please upload a post image' }],
      component: (
        <Upload
          listType="picture-card"
          fileList={fileList}
          beforeUpload={() => false}
          onChange={({ fileList }) => setFileList(fileList)}
          maxCount={1}
        >
          {fileList.length === 0 && (
            <Button icon={<UploadOutlined />}>Upload</Button>
          )}
        </Upload>
      ),
    },
  };

  // Pre-fill form when editing
  useEffect(() => {
    if (details && singlePost?.data) {
      const post = singlePost.data;

      // Pre-fill Upload image
      if (post.post_image) {
        const fileName = post.post_image.split('\\').pop();
        const imageUrl = `${url}/${post.post_image.replace(/\\/g, '/')}`;

        setFileList([
          {
            uid: '-1',
            name: fileName,
            status: 'done',
            url: imageUrl,
          },
        ]);
      }

      form.setFieldsValue({
        tipTitle: post.postTitle || '',
        sportType: post.sportType?.toLowerCase() || '',
        predictionType:
          post.predictionType?.toLowerCase().replace(/\s/g, '') || '',
        winRate: post.winRate ? `${post.winRate}%` : '',
        targetUser: `${post.targetUser.toLowerCase()}User`,
        oddsRange: post.oddsRange || '',
      });
    }
  }, [details, singlePost]);

  const handleNext = async () => {
    try {
      await form.validateFields(steps[currentStep].fields);
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.warn('Validation failed');
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
      if (fileList.length > 0 && fileList[0].originFileObj) {
        file = fileList[0].originFileObj;
        dataPayload.postImageName = file.name;
      }

      const formData = new FormData();
      formData.append('data', JSON.stringify(dataPayload));
      if (file) {
        formData.append('postImage', file);
      }
      if (!postEditId) {
        await createPost(formData, dataPayload);
      } else if (postEditId) {
        await updatePost(formData, dataPayload);
      }

      form.resetFields();
      setFileList([]);
      setCurrentStep(0);
      onCancel();
    } catch (error) {
      toast.error('Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const getFooterButtons = () => {
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === steps.length - 1;

    return (
      <div className="flex justify-between gap-3">
        {isFirstStep ? (
          <Button onClick={onCancel} danger>
            Cancel
          </Button>
        ) : (
          <Button onClick={handlePrevious}>Previous</Button>
        )}

        {isLastStep ? (
          <Button
            type="primary"
            onClick={handleFinish}
            loading={loading}
            className="!bg-[var(--bg-green-high)] !text-white"
          >
            {postEditId ? 'Update' : 'Save'}
          </Button>
        ) : (
          <Button
            type="primary"
            onClick={handleNext}
            className="!bg-[var(--bg-green-high)] !text-white"
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
        >
          {field.component}
        </Form.Item>
      );
    });
  };

  return (
    <Modal
      title="Add New Tip"
      open={visible}
      onCancel={() => {
        form.resetFields();
        setFileList([]);
        setCurrentStep(0);
        onCancel();
      }}
      footer={getFooterButtons()}
      centered
      width={600}
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        {renderStepFields()}
      </Form>
    </Modal>
  );
};

export default AddTipModal;
