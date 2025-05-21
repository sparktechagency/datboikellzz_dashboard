import React, { useState, useEffect } from 'react';
import PageHeading from '../../../Components/Shared/PageHeading';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Space,
  Spin,
  Popconfirm,
  Empty,
} from 'antd';
import { FaEdit } from 'react-icons/fa';
import { AiTwotoneDelete } from 'react-icons/ai';
import { FaPlus } from 'react-icons/fa6';
import TextArea from 'antd/es/input/TextArea';
import toast from 'react-hot-toast';
import {
  useAllFaqQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} from '../../../Redux/services/settings/faqApis';

function FrequentlyAskedQuestions() {
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const { data: faqApiData, isLoading: faqLoading } = useAllFaqQuery();

  const [createFaq, { isLoading: createLoading }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: updateLoading }] = useUpdateFaqMutation();
  const [deleteFaq, { isLoading: deleteLoading }] = useDeleteFaqMutation();

  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    if (faqApiData?.data) {
      const mappedFaqs = faqApiData.data.map((item) => ({
        question: item.question,
        answer: item.description,
        _id: item._id,
      }));
      setFaqs(mappedFaqs);
    }
  }, [faqApiData]);

  const handleAddClick = () => {
    setEditingIndex(null);
    setShowModal(true);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setShowModal(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingIndex !== null) {
        // Update existing FAQ
        const faqToUpdate = faqs[editingIndex];
        const payload = {
          faqId: faqToUpdate._id,
          data: {
            question: values.question,
            description: values.description,
          },
        };

        await updateFaq(payload).unwrap();

        const updatedFaqs = [...faqs];
        updatedFaqs[editingIndex] = {
          ...updatedFaqs[editingIndex],
          question: values.question,
          answer: values.description,
        };
        setFaqs(updatedFaqs);
        toast.success('FAQ updated successfully!');
      } else {
        // Create new FAQ
        const payload = {
          data: {
            question: values.question,
            description: values.description,
          },
        };

        const response = await createFaq(payload).unwrap();

        setFaqs([
          ...faqs,
          {
            question: response.data.question,
            answer: response.data.description,
            _id: response.data._id,
          },
        ]);
        toast.success('FAQ added successfully!');
      }
      setShowModal(false);
    } catch (error) {
      toast.error('An error occurred while saving FAQ.');
      console.error(error);
    }
  };

  const handleDelete = async (index) => {
    try {
      const faqToDelete = faqs[index];
      await deleteFaq({ faqId: faqToDelete._id }).unwrap();

      const updatedFaqs = faqs.filter((_, i) => i !== index);
      setFaqs(updatedFaqs);
      toast.success('FAQ deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete FAQ.');
      console.error(error);
    }
  };

  if (faqLoading) {
    return <p>Loading FAQs...</p>;
  }

  return (
    <div className="w-full">
      {deleteLoading && (
        <div className="fixed top-0 left-0 w-full h-full z-[999] pointer-events-none flex items-center justify-center">
          <Spin size="large" />
        </div>
      )}
      <div className="flex items-center justify-between !w-full mb-12">
        <div className="w-full bg-white flex items-center justify-between pr-12 shadow-sm rounded-lg">
          <PageHeading title={'FAQ'} />
          <Button
            style={{
              width: '200px',
              backgroundColor: 'var(--bg-green-high)',
              color: 'var(--text-light)',
            }}
            onClick={handleAddClick}
          >
            <FaPlus />
            Add FAQ
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {faqs.length > 0 ? (
          faqs.map((item, index) => (
            <Card key={item._id || index}>
              <div className="flex items-center justify-between my-4">
                <h1>{item.question}</h1>
                <Space>
                  <Button onClick={() => handleEdit(index)}>
                    <FaEdit />
                  </Button>
                  <Popconfirm
                    title="Delete this FAQ?"
                    description="Are you sure you want to delete this FAQ?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => handleDelete(index)}
                    okButtonProps={{ loading: deleteLoading }}
                  >
                    <Button danger>
                      <AiTwotoneDelete />
                    </Button>
                  </Popconfirm>
                </Space>
              </div>
              <p>{item.answer}</p>
            </Card>
          ))
        ) : (
          <div className="col-span-2">
            <Empty description="No Frequently Asked Questions Available" />
          </div>
        )}
      </div>
      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        title={editingIndex !== null ? 'Edit FAQ' : 'Add New FAQ'}
        destroyOnClose
      >
        <Form
          onFinish={handleSubmit}
          layout="vertical"
          initialValues={
            editingIndex !== null
              ? {
                  question: faqs[editingIndex].question,
                  description: faqs[editingIndex].answer,
                }
              : { question: '', description: '' }
          }
        >
          <Form.Item
            label="Question"
            name="question"
            rules={[{ required: true, message: 'Please enter a question' }]}
          >
            <Input placeholder="Enter your question" />
          </Form.Item>

          <Form.Item
            label="Answer"
            name="description"
            rules={[{ required: true, message: 'Please enter an answer' }]}
          >
            <TextArea placeholder="Enter your answer" rows={4} />
          </Form.Item>

          <Form.Item>
            <div className="flex items-center justify-end">
              <Button
                className="!bg-[var(--bg-green-high)] !text-white"
                htmlType="submit"
                loading={createLoading || updateLoading}
              >
                {editingIndex !== null ? 'Update FAQ' : 'Save FAQ'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default FrequentlyAskedQuestions;
