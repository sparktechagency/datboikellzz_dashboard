/* eslint-disable no-unused-vars */
import { Button, Form, message, Steps } from 'antd';
import React, { useState, useEffect } from 'react';
import AddCarImage from './add_car_steps/AddCarImage';
import AddCarGeneralInfo from './add_car_steps/AddCarGeneralInfo';
import AddCarDocument from './add_car_steps/AddCarDocument';
import AddCarLicenseInfo from './add_car_steps/AddCarLicenseInfo';
import {
  useCreateNewCarMutation,
  useGetSingleCardDataQuery,
} from '../../../Redux/services/carApis';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
const { Step } = Steps;

function AddNewCar() {
  const location = useLocation();
  const id = location.state;
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [addNewCar] = useCreateNewCarMutation();
  const [initialData, setInitialData] = useState({});
  const { data: singleCarData, isLoading: singleCarLoading } =
    useGetSingleCardDataQuery({ id });

  const [imageData, setImageData] = useState({
    car_image: [],
  });
  const [generalInfo, setGeneralInfo] = useState({});
  const [licenseInfo, setLicenseInfo] = useState({});
  const [documentInfo, setDocumentInfo] = useState({});

  if (!singleCarLoading) {
    console.log(singleCarData);
  }

  useEffect(() => {
    const evpExpiry = dayjs(singleCarData?.data?.evpExpiry);
    const registrationDate = dayjs(singleCarData?.data?.registrationDate);

    const data = {
      brand: singleCarData?.data?.brand,
      model: singleCarData?.data?.model,
      type: singleCarData?.data?.type,
      seats: singleCarData?.data?.seats,
      evpNumber: singleCarData?.data?.evpNumber,
      evpExpiry: evpExpiry,
      carNumber: singleCarData?.data?.carNumber,
      color: singleCarData?.data?.color,
      carLicensePlate: singleCarData?.data?.carLicensePlate,
      vin: singleCarData?.data?.vin,
      insuranceStatus: singleCarData?.data?.insuranceStatus,
      registrationDate: registrationDate,
      car_image: singleCarData?.data?.car_image || [],
      car_grant_image: singleCarData?.data?.car_grant_image,
      car_insurance_image: singleCarData?.data?.car_insurance_image,
      e_hailing_car_permit_image:
        singleCarData?.data?.e_hailing_car_permit_image,
      isAssigned: singleCarData?.data?.isAssigned,
    };
    setInitialData(data);
  }, [singleCarData, form]);

  useEffect(() => {
    setFormData({
      ...imageData,
      ...generalInfo,
      ...licenseInfo,
      ...documentInfo,
    });
  }, [imageData, generalInfo, licenseInfo, documentInfo]);
  useEffect(() => {
    setImageData(singleCarData?.data?.car_image);
  }, [singleCarData]);

  const steps = [
    {
      title: 'Car Image',
      content: (
        <AddCarImage
          form={form}
          initialValues={imageData}
          setImageData={setImageData}
        />
      ),
    },
    {
      title: 'General Information',
      content: (
        <AddCarGeneralInfo
          form={form}
          initialValues={generalInfo}
          setGeneralInfo={setGeneralInfo}
        />
      ),
    },
    {
      title: ' License Information',
      content: (
        <AddCarLicenseInfo
          form={form}
          initialValues={initialData}
          setLicenseInfo={setLicenseInfo}
        />
      ),
    },
    {
      title: 'Vehicle Grant',
      content: (
        <AddCarDocument
          form={form}
          initialValues={initialData}
          setDocumentInfo={setDocumentInfo}
        />
      ),
    },
  ];

  const handleNext = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      switch (current) {
        case 0:
          setImageData((prevData) => ({ ...prevData, ...values }));
          break;
        case 1:
          setGeneralInfo((prevData) => ({ ...prevData, ...values }));
          break;
        case 2:
          setLicenseInfo((prevData) => ({ ...prevData, ...values }));
          break;
        case 3:
          setDocumentInfo((prevData) => ({ ...prevData, ...values }));
          break;
        default:
          break;
      }

      setCurrent(current + 1);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
      message.error('Please complete all required fields');
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    setCurrent(current - 1);

    const stepData = [imageData, generalInfo, licenseInfo, documentInfo][
      current - 1
    ];
    form.setFieldsValue(stepData);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      setDocumentInfo((prevData) => ({ ...prevData, ...values }));
      const submitFormData = new FormData();
      const allData = {
        ...generalInfo,

        ...licenseInfo,

        ...documentInfo,

        ...values,
      };

      if (imageData.car_image && Array.isArray(imageData.car_image)) {
        imageData.car_image.forEach((file) => {
          submitFormData.append('car_image', file);
        });
      }

      Object.entries(allData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value && value.format) {
            submitFormData.append(key, value.format('YYYY-MM-DD'));
          } else if (
            key === 'car_grant_image' ||
            key === 'car_insurance_image' ||
            key === 'e_hailing_car_permit_image'
          ) {
            if (value && value.fileList) {
              const file = value.fileList[0]?.originFileObj;
              if (file) {
                submitFormData.append(key, file);
              }
            } else if (value && value.file) {
              submitFormData.append(key, value.file);
            } else if (value && typeof value !== 'object') {
              submitFormData.append(key, value);
            }
          } else if (key !== 'car_image') {
            submitFormData.append(key, value);
          }
        }
      });

      await addNewCar({ submitFormData });

      toast.success('Car added successfully!');
      form.resetFields();
      setCurrent(0);
      setFormData({});
      setImageData({ car_image: [] });
      setGeneralInfo({});
      setLicenseInfo({});
      setDocumentInfo({});
    } catch (error) {
      console.error('Submission failed:', error);
      message.error('Failed to add car. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Steps current={current} className="!my-12">
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <Form
        requiredMark={false}
        initialValues={initialData}
        form={form}
        layout="vertical"
        className="mb-6"
      >
        {steps[current].content}
      </Form>

      <div className="flex gap-4 items-center mt-4">
        {current > 0 && (
          <Button size="large" onClick={handlePrev} disabled={loading}>
            Previous
          </Button>
        )}
        <Button
          type="primary"
          size="large"
          className="px-8 !bg-purple-600"
          onClick={current < steps.length - 1 ? handleNext : handleSubmit}
          loading={loading}
        >
          {current < steps.length - 1 ? 'Next' : id ? 'Update' : 'Save'}
        </Button>
      </div>
    </div>
  );
}

export default AddNewCar;

// import { Button, Form, message, Steps } from 'antd';
// import React, { useState, useEffect } from 'react';
// import AddCarImage from './add_car_steps/AddCarImage';
// import AddCarGeneralInfo from './add_car_steps/AddCarGeneralInfo';
// import AddCarDocument from './add_car_steps/AddCarDocument';
// import AddCarLicenseInfo from './add_car_steps/AddCarLicenseInfo';
// import {
//   useCreateNewCarMutation,
//   useGetSingleCardDataQuery,
//   useUpdateCarMutation,
// } from '../../../Redux/services/carApis';
// import toast from 'react-hot-toast';
// import { useLocation } from 'react-router-dom';
// const { Step } = Steps;

// function AddNewCar() {
//   const location = useLocation();
//   const id = location.state;
//   const isEditMode = !!id;
//   const [current, setCurrent] = useState(0);
//   const [form] = Form.useForm();
//   const [formData, setFormData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [addNewCar] = useCreateNewCarMutation();
//   const [updateCar] = useUpdateCarMutation();

//   const { data: singleCarData, isLoading: singleCarLoading } =
//     useGetSingleCardDataQuery({ id }, { skip: !id });

//   const carData = singleCarData?.data;

//   const [imageData, setImageData] = useState({
//     car_image: [],
//   });
//   const [generalInfo, setGeneralInfo] = useState({});
//   const [licenseInfo, setLicenseInfo] = useState({});
//   const [documentInfo, setDocumentInfo] = useState({});

//   useEffect(() => {
//     if (carData && !singleCarLoading) {
//       setImageData({
//         car_image: carData.car_image || [],
//       });

//       setGeneralInfo({
//         brand: carData.brand,
//         model: carData.model,
//         type: carData.type,
//         seats: carData.seats,
//         color: carData.color,
//         vin: carData.vin,
//       });

//       setLicenseInfo({
//         evpNumber: carData.evpNumber,
//         evpExpiry: carData.evpExpiry,
//         carNumber: carData.carNumber,
//         carLicensePlate: carData.carLicensePlate,
//         insuranceStatus: carData.insuranceStatus,
//         registrationDate: carData.registrationDate,
//       });

//       // Set document info
//       setDocumentInfo({
//         car_grant_image: carData.car_grant_image,
//         car_insurance_image: carData.car_insurance_image,
//         e_hailing_car_permit_image: carData.e_hailing_car_permit_image,
//       });
//     }
//   }, [carData, singleCarLoading]);

//   // Set form data whenever any of the sub-data changes
//   useEffect(() => {
//     setFormData({
//       ...imageData,
//       ...generalInfo,
//       ...licenseInfo,
//       ...documentInfo,
//     });
//   }, [imageData, generalInfo, licenseInfo, documentInfo]);

//   // Set initial form values when changing steps
//   useEffect(() => {
//     if (current === 0) {
//       form.setFieldsValue(imageData);
//     } else if (current === 1) {
//       form.setFieldsValue(generalInfo);
//     } else if (current === 2) {
//       form.setFieldsValue(licenseInfo);
//     } else if (current === 3) {
//       form.setFieldsValue(documentInfo);
//     }
//   }, [current, form, imageData, generalInfo, licenseInfo, documentInfo]);

//   const steps = [
//     {
//       title: 'Car Image',
//       content: (
//         <AddCarImage
//           form={form}
//           initialValues={imageData}
//           setImageData={setImageData}
//           existingImages={carData?.car_image}
//           isEditMode={isEditMode}
//         />
//       ),
//     },
//     {
//       title: 'General Information',
//       content: (
//         <AddCarGeneralInfo
//           form={form}
//           initialValues={generalInfo}
//           setGeneralInfo={setGeneralInfo}
//         />
//       ),
//     },
//     {
//       title: ' License Information',
//       content: (
//         <AddCarLicenseInfo
//           form={form}
//           initialValues={licenseInfo}
//           setLicenseInfo={setLicenseInfo}
//         />
//       ),
//     },
//     {
//       title: 'Vehicle Grant',
//       content: (
//         <AddCarDocument
//           form={form}
//           initialValues={documentInfo}
//           setDocumentInfo={setDocumentInfo}
//           existingDocuments={{
//             car_grant_image: carData?.car_grant_image,
//             car_insurance_image: carData?.car_insurance_image,
//             e_hailing_car_permit_image: carData?.e_hailing_car_permit_image,
//           }}
//           isEditMode={isEditMode}
//         />
//       ),
//     },
//   ];

//   const handleNext = async () => {
//     try {
//       setLoading(true);
//       const values = await form.validateFields();

//       switch (current) {
//         case 0:
//           setImageData((prevData) => ({ ...prevData, ...values }));
//           break;
//         case 1:
//           setGeneralInfo((prevData) => ({ ...prevData, ...values }));
//           break;
//         case 2:
//           setLicenseInfo((prevData) => ({ ...prevData, ...values }));
//           break;
//         case 3:
//           setDocumentInfo((prevData) => ({ ...prevData, ...values }));
//           break;
//         default:
//           break;
//       }

//       setCurrent(current + 1);
//       form.resetFields();
//     } catch (error) {
//       console.error('Validation failed:', error);
//       message.error('Please complete all required fields');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePrev = () => {
//     setCurrent(current - 1);
//   };

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);

//       const values = await form.validateFields();

//       setDocumentInfo((prevData) => ({ ...prevData, ...values }));

//       const submitFormData = new FormData();

//       const allData = {
//         ...generalInfo,
//         ...licenseInfo,
//         ...documentInfo,
//         ...values,
//       };

//       // Add car images to form data
//       if (imageData.car_image && Array.isArray(imageData.car_image)) {
//         imageData.car_image.forEach((file) => {
//           // Only append if it's a File object, not a string URL from existing data
//           if (
//             file instanceof File ||
//             (file.originFileObj && file.originFileObj instanceof File)
//           ) {
//             submitFormData.append('car_image', file.originFileObj || file);
//           }
//         });
//       }

//       // If editing, add the car ID
//       if (isEditMode) {
//         submitFormData.append('id', id);
//       }

//       // Process all other form fields
//       Object.entries(allData).forEach(([key, value]) => {
//         if (value !== undefined && value !== null) {
//           if (value && value.format) {
//             // Handle date objects
//             submitFormData.append(key, value.format('YYYY-MM-DD'));
//           } else if (
//             key === 'car_grant_image' ||
//             key === 'car_insurance_image' ||
//             key === 'e_hailing_car_permit_image'
//           ) {
//             // Handle document file uploads
//             if (value && value.fileList && value.fileList[0]?.originFileObj) {
//               submitFormData.append(key, value.fileList[0].originFileObj);
//             } else if (value && value.file instanceof File) {
//               submitFormData.append(key, value.file);
//             } else if (value && typeof value !== 'object') {
//               // If value is a string (existing file path), only append if changed
//               if (!carData || value !== carData[key]) {
//                 submitFormData.append(key, value);
//               }
//             }
//           } else if (key !== 'car_image') {
//             // Handle all other fields
//             submitFormData.append(key, value);
//           }
//         }
//       });

//       // Use appropriate mutation based on mode
//       if (isEditMode) {
//         await updateCar({ submitFormData });
//         toast.success('Car updated successfully!');
//       } else {
//         await addNewCar({ submitFormData });
//         toast.success('Car added successfully!');
//       }

//       // Reset form after successful submission
//       form.resetFields();
//       setCurrent(0);
//       setFormData({});
//       setImageData({ car_image: [] });
//       setGeneralInfo({});
//       setLicenseInfo({});
//       setDocumentInfo({});
//     } catch (error) {
//       console.error('Submission failed:', error);
//       message.error(
//         `Failed to ${isEditMode ? 'update' : 'add'} car. Please try again.`
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">
//         {isEditMode ? 'Edit Car' : 'Add New Car'}
//       </h1>

//       <Steps current={current} className="!my-12">
//         {steps.map((item) => (
//           <Step key={item.title} title={item.title} />
//         ))}
//       </Steps>

//       {singleCarLoading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="text-lg">Loading car data...</div>
//         </div>
//       ) : (
//         <>
//           <Form
//             requiredMark={false}
//             form={form}
//             layout="vertical"
//             className="mb-6"
//           >
//             {steps[current].content}
//           </Form>

//           <div className="flex gap-4 items-center mt-4">
//             {current > 0 && (
//               <Button size="large" onClick={handlePrev} disabled={loading}>
//                 Previous
//               </Button>
//             )}
//             <Button
//               type="primary"
//               size="large"
//               className="px-8 !bg-purple-600"
//               onClick={current < steps.length - 1 ? handleNext : handleSubmit}
//               loading={loading}
//             >
//               {current < steps.length - 1
//                 ? 'Next'
//                 : isEditMode
//                 ? 'Update'
//                 : 'Save'}
//             </Button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default AddNewCar;
