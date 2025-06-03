/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, Select, Form, Upload, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import {
  useCreatePostMutation,
  useSinglePostGetQuery,
  useUpdatePostMutation,
} from '../../../Redux/services/post-admin-service/postApis';
import { imageUrl } from '../../../Utils/server';
import TextArea from 'antd/es/input/TextArea';
const AddTipModal = ({ visible, onCancel, details, postEditId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const { data: singlePost, isLoading: singlePostLoading } =
    useSinglePostGetQuery({ postId: postEditId }, { skip: !postEditId });
  const [createPost] = useCreatePostMutation(undefined, { skip: postEditId });
  const [updatePost] = useUpdatePostMutation(undefined, { skip: !postEditId });

  const formFields = [
    {
      label: 'Post Image',
      name: 'postImage',
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
      span: 24,
    },
    {
      label: 'Tip Title',
      name: 'tipTitle',
      rules: [{ required: true, message: 'Please enter the tip title' }],
      component: <Input placeholder="Enter the Tip Title" />,
      span: 24,
    },
    {
      label: 'Sport Type',
      name: 'sportType',
      rules: [{ required: true, message: 'Please enter the sport type' }],
      component: <Input placeholder="Enter the Sport Type" />,
      span: 12,
    },
    {
      label: 'Prediction Type',
      name: 'predictionType',
      rules: [{ required: true, message: 'Please enter the prediction type' }],
      component: <Input placeholder="Enter the Prediction Type" />,
      span: 12,
    },
    {
      label: 'Win Rate',
      name: 'winRate',
      rules: [{ required: true, message: 'Please enter the win rate' }],
      component: <Input type="number" placeholder="e.g. 75%" />,
      span: 8,
    },
    {
      label: 'Target User',
      name: 'targetUser',
      rules: [{ required: true, message: 'Please select a target user' }],
      component: (
        <Select placeholder="Select One">
          <Select.Option value="gold">Gold User</Select.Option>
          <Select.Option value="silver">Silver User</Select.Option>
          <Select.Option value="bronze">Bronze User</Select.Option>
          <Select.Option value="quick_hit">
            Quick Hit <small>(daily)</small>
          </Select.Option>
          <Select.Option value="triple_threat">
            Triple Threat<small>(daily)</small>
          </Select.Option>
          <Select.Option value="jackpot_chase">
            Jackpot Chase<small>(daily)</small>
          </Select.Option>
        </Select>
      ),
      span: 8,
    },
    {
      label: 'Odds Range',
      name: 'oddsRange',
      rules: [{ required: true, message: 'Please enter the odds range' }],
      component: <Input placeholder="e.g. 1.5 - 2.0" />,
      span: 8,
    },
    {
      label: 'Prediction description',
      name: 'predictionDescription',
      rules: [
        { required: true, message: 'Please enter the prediction description' },
      ],
      component: (
        <TextArea
          rows={4}
          placeholder="Enter the prediction description"
          style={{ resize: 'none' }}
        />
      ),
      span: 24,
    },
  ];

  useEffect(() => {
    if (details && singlePost?.data) {
      const post = singlePost.data;

      if (post.post_image) {
        const fileName = post.post_image.split('\\').pop();
        const image = imageUrl(post?.post_image);

        setFileList([
          {
            uid: '-1',
            name: fileName,
            status: 'done',
            url: image,
          },
        ]);
      }

      form.setFieldsValue({
        tipTitle: post.postTitle || '',
        sportType: post.sportType?.toLowerCase() || '',
        predictionType: post.predictionType || '',
        winRate: post?.winRate || '',
        targetUser: post.targetUser || '',
        oddsRange: post.oddsRange || '',
        predictionDescription: post.predictionDescription || '',
      });
    }
  }, [details, singlePost, form, postEditId]);

  const handleFinish = async () => {
    if (singlePostLoading) return;
    try {
      setLoading(true);
      const values = await form.validateFields();
      const dataPayload = {
        postTitle: values.tipTitle,
        sportType: values.sportType,
        predictionType: values.predictionType,
        winRate: values.winRate,
        targetUser: values.targetUser,
        oddsRange: values.oddsRange,
        predictionDescription: values.predictionDescription || '',
      };

      const formData = new FormData();

      Object.keys(dataPayload).forEach((key) => {
        formData.append(key, dataPayload[key]);
      });
      if (postEditId) {
        formData.append('postId', postEditId);
      }

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('post_image', fileList[0].originFileObj);
      }

      if (!postEditId) {
        const res = await createPost({ data: formData });
        if (res?.data?.success) {
          toast.success(res?.data?.message || 'Tip created successfully');
          form.resetFields();
          setFileList([]);
          onCancel();
        }
      } else {
        const res = await updatePost({ data: formData });
        if (res?.data?.success) {
          toast.success(res?.data?.message || 'Tip updated successfully');
          form.resetFields();
          localStorage.removeItem('postEditId');
          setFileList([]);
          onCancel();
        }
      }
    } catch (error) {
      toast.error('Submission failed');
      console.error('Submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        postEditId ? (
          <div className="flex items-center flex-col justify-center">
            <h2 className="text-2xl">Edit Tip Post</h2>
            <p className="text-sm font-normal text-center ">
              Update your prediction, odds, or match details. All changes will
              reflect instantly for subscribed users.
            </p>
          </div>
        ) : (
          <div className="flex items-center flex-col justify-center">
            <h2 className="text-2xl">Add New Tip</h2>
            <p className="text-sm font-normal text-center ">
              Share a new prediction with your users. Fill out the match
              details, betting type, and insights to help users make informed
              decisions.
            </p>
          </div>
        )
      }
      open={visible}
      onCancel={false}
      closeIcon={false}
      footer={[
        <Button
          key="back"
          onClick={() => {
            form.resetFields();
            setFileList([]);
            onCancel();
          }}
          danger
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleFinish}
          className="!bg-[var(--bg-green-high)] !text-white"
        >
          {postEditId ? 'Update' : 'Save'}
        </Button>,
      ]}
      centered
      width={800}
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Row gutter={16}>
          {formFields.map((field) => (
            <Col span={field.span} key={field.name}>
              <Form.Item
                label={field.label}
                name={field.name}
                rules={field.rules}
              >
                {field.component}
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Form>
    </Modal>
  );
};

export default AddTipModal;
