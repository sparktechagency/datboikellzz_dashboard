import React from 'react';
import { Tabs } from 'antd';
import active_hour from '../../../assets/icons/active_hour.svg';
import money from '../../../assets/icons/money.svg';
import online_cash from '../../../assets/icons/online_cash.svg';
import hand_cash from '../../../assets/icons/hand_cash.svg';
import trip_distance from '../../../assets/icons/trip_distance.svg';

function Statics({ data }) {
  const { get_rating, total_rating, driving_info } = data.statics;

  const onChange = (key) => {
    console.log('Selected tab:', key);
  };
  const renderStats = (period) => {
    const stats = driving_info[period];
    return (
      <div className="grid grid-cols-3 gap-2">
        <div className="shadow flex flex-col items-center justify-center">
          <img className="w-8 mb-2" src={money} alt="" />
          <h2 className="text-xl">Total Earn</h2>
          <h1>RM {stats.total_earn}</h1>
        </div>
        <div className="shadow flex flex-col items-center justify-center">
          <img className="w-8 mb-2" src={hand_cash} alt="" />
          <h2 className="text-xl">Hand Cash</h2>
          <h1>RM {stats.hand_cash}</h1>
        </div>
        <div className="shadow flex flex-col items-center justify-center">
          <img className="w-8 mb-2" src={online_cash} alt="" />
          <h2 className="text-xl">Online Cash</h2>
          <h1>RM {stats.online_cash}</h1>
        </div>
        <div className="shadow flex flex-col items-center justify-center">
          <img className="w-8 mb-2" src={active_hour} alt="" />
          <h2 className="text-xl">Active Hours</h2>
          <h1>{stats.active_hours}hrs</h1>
        </div>
        <div className="shadow flex flex-col items-center justify-center">
          <img className="w-8 mb-2" src={trip_distance} alt="" />
          <h2 className="text-xl">Trip Distance</h2>
          <h1>{stats.trip_distance}km</h1>
        </div>
      </div>
    );
  };

  const items = [
    { key: '1', label: 'Today', children: renderStats('daily') },
    { key: '2', label: 'This Week', children: renderStats('Weekly') },
    { key: '3', label: 'This Month', children: renderStats('Monthly') },
    { key: '4', label: 'This Year', children: renderStats('Yearly') },
    { key: '5', label: 'All time', children: renderStats('Yearly') },
  ];
  // const items = [
  //   { key: '1', label: 'Today', children: renderStats('today') },
  //   { key: '2', label: 'This Week', children: renderStats('last-7-days') },
  //   { key: '3', label: 'This Month', children: renderStats('this-month') },
  //   { key: '4', label: 'This Year', children: renderStats('this-year') },
  //   { key: '4', label: 'All time', children: renderStats('all-time') },
  // ];
  return (
    <div>
      <div>
        Rating: <br />
        <h3>
          {Array.from({ length: get_rating }).map((_, index) => (
            <span key={index}>⭐</span>
          ))}
          {get_rating}/{total_rating}
        </h3>
      </div>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </div>
  );
}

export default Statics;
