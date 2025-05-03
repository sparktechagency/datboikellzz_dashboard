import React, { useEffect, useState } from 'react';
import { Form, Upload, Image } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { imageUrl, url } from '../../../../Utils/server';

const AddCarImage = ({ form, initialValues, setImageData }) => {
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      if (file.originFileObj) {
        file.preview = await getBase64(file.originFileObj);
      } else if (file.url) {
        file.preview = file.url;
      }
    }
    setPreviewImage(file.url || file.preview);
  };

  useEffect(() => {
    if (Array.isArray(initialValues)) {
      const initialFiles = initialValues.map((path, index) => ({
        uid: `-${index}`,
        name: path.split('\\').pop() || `image-${index}.jpg`,
        status: 'done',
        url: `${imageUrl(path)}`,
      }));
      setFileList(initialFiles);
      form.setFieldsValue({ car_image: initialValues });
    }
  }, [initialValues, form]);

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    // Prepare the value for form - keep existing URLs and add new files
    const carImages = newFileList
      .map((file) => {
        if (file.url) {
          // This is an existing image (has URL)
          return file.url.replace(`${url || ''}/`, '').replace(/\//g, '\\');
        }
        return file.originFileObj;
      })
      .filter(Boolean);

    form.setFieldsValue({ car_image: carImages });
    setImageData({ car_image: carImages });
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Form.Item
        name="car_image"
        label="Car Images"
        rules={[
          { required: true, message: 'Please upload at least one car image' },
        ]}
        extra="Upload up to 5 images of your car (front, back, side views)"
      >
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          beforeUpload={() => false}
          maxCount={5}
          multiple
        >
          {fileList.length >= 5 ? null : uploadButton}
        </Upload>
      </Form.Item>

      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: !!previewImage,
            onVisibleChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default AddCarImage;
