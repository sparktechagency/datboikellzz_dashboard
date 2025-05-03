import React from 'react';
import { imageUrl } from '../../../Utils/server';
import { FaCarCrash } from 'react-icons/fa';

function Car({ data }) {
  const carImage = data?.assignedCar?.car_image || [];
  if (data?.assignedCar === undefined) {
    return (
      <div className="flex flex-col items-center text-yellow-600">
        <FaCarCrash className="mr-2 text-7xl" />
        <span>No Car Assigned To This Driver</span>
      </div>
    );
  }
  return (
    <div>
      <div className="flex items-center gap-2">
        {carImage?.map((url, idx) => (
          <div key={idx} className="w-48 h-28 rounded-md overflow-hidden mb-3">
            <img
              className="w-full h-full object-cover"
              src={imageUrl(url)}
              alt="Car"
            />
          </div>
        ))}
      </div>

      <div>
        <h1 className="text-base text-[#222]]">
          Car Model : <br />
          <span className="text-gray-500">
            {data?.assignedCar?.model || 'N/A'}
          </span>
        </h1>
        <h1 className="text-base text-[#222]]">
          Color :
          <br />{' '}
          <span className="text-gray-500">
            {data?.assignedCar?.color || 'N/A'}
          </span>
        </h1>
        <h1 className="text-base text-[#222]]">
          License Plate: <br />
          <span className="text-gray-500">
            {data?.assignedCar?.carLicensePlate || 'N/A'}
          </span>
        </h1>
      </div>
    </div>
  );
}

export default Car;
