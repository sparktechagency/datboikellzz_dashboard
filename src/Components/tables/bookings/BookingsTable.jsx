import React from 'react';
import { Table, Tag, Space, Avatar } from 'antd';
import PageHeading from '../../Shared/PageHeading';

const BookingsTable = () => {
  const bookingsData = [
    {
      id: 1,
      name: 'Theodore Mosciski',
      booking_date: '2025-01-10 At 04:08 pm',
      destination: {
        from: 'Kuala Lumpur',
        to: 'Penang',
      },
      fair_price: 'RM 500',
      status: 'Completed',
      avatar: `https://tinypng.com/images/social/website.jpg`,
    },
    {
      id: 2,
      name: 'Russell Veum',
      booking_date: '2025-01-10 At 04:08 pm',
      destination: {
        from: 'Kuala Lumpur',
        to: 'Penang',
      },
      fair_price: 'RM 500',
      status: 'Completed',
      avatar: `https://tinypng.com/images/social/website.jpg`,
    },
    {
      id: 3,
      name: 'Tracy Grady',
      booking_date: '2025-01-10 At 04:08 pm',
      destination: {
        from: 'Kuala Lumpur',
        to: 'Penang',
      },
      fair_price: 'RM 500',
      status: 'Canceled',
      avatar: `https://tinypng.com/images/social/website.jpg`,
    },
    {
      id: 44444444444444,
      name: 'Dana Daniel',
      booking_date: '2025-01-10 At 04:08 pm',
      destination: {
        from: 'Kuala Lumpur',
        to: 'Penang',
      },
      fair_price: 'RM 500',
      status: 'Canceled',
      avatar: `https://tinypng.com/images/social/website.jpg`,
    },
    {
      id: 43333333333,
      name: 'Dana Daniel',
      booking_date: '2025-01-10 At 04:08 pm',
      destination: {
        from: 'Kuala Lumpur',
        to: 'Penang',
      },
      fair_price: 'RM 500',
      status: 'Completed',
      avatar: `https://tinypng.com/images/social/website.jpg`,
    },
    {
      id: 4333333,
      name: 'Dana Daniel',
      booking_date: '2025-01-10 At 04:08 pm',
      destination: {
        from: 'Kuala Lumpur',
        to: 'Penang',
      },
      fair_price: 'RM 500',
      status: 'Canceled',
      avatar: `https://tinypng.com/images/social/website.jpg`,
    },
    {
      id: 4333,
      name: 'Dana Daniel',
      booking_date: '2025-01-10 At 04:08 pm',
      destination: {
        from: 'Kuala Lumpur',
        to: 'Penang',
      },
      fair_price: 'RM 500',
      status: 'Pending',
      avatar: `https://tinypng.com/images/social/website.jpg`,
    },
    {
      id: 433,
      name: 'Dana Daniel',
      booking_date: '2025-01-10 At 04:08 pm',
      destination: {
        from: 'Kuala Lumpur',
        to: 'Penang',
      },
      fair_price: 'RM 500',
      status: 'Pending',
      avatar: `https://tinypng.com/images/social/website.jpg`,
    },
    {
      id: 43,
      name: 'Dana Daniel',
      booking_date: '2025-01-10 At 04:08 pm',
      destination: {
        from: 'Kuala Lumpur',
        to: 'Penang',
      },
      fair_price: 'RM 500',
      status: 'Pending',
      avatar: `https://tinypng.com/images/social/website.jpg`,
    },
  ];

  const columns = [
    {
      title: 'User Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space size="middle">
          <Avatar src={record.avatar} />
          {text}
        </Space>
      ),
    },
    {
      title: 'Driver Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space size="middle">
          <Avatar src={record.avatar} />
          {text}
        </Space>
      ),
    },
    {
      title: 'Booking On',
      dataIndex: 'booking_date',
      key: 'booking_date',
    },
    {
      title: 'From',
      dataIndex: 'destination',
      key: 'destination',
      render: (destination) => destination.from,
    },
    {
      title: 'To',
      dataIndex: 'destination',
      key: 'destination',
      render: (destination) => destination.to,
    },
    {
      title: 'Fair Price',
      dataIndex: 'fair_price',
      key: 'fair_price',
    },
    {
      title: 'Online Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = '';
        if (status === 'Completed') {
          color = 'green';
        } else if (status === 'Canceled') {
          color = 'red';
        } else if (status === 'Pending') {
          color = 'yellow';
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <PageHeading title={'Bookings'} />
      <Table
        columns={columns}
        dataSource={bookingsData}
        rowKey="id"
        pagination={
          bookingsData.length > 5
            ? {
                defaultPageSize: 5,
                showSizeChanger: false,
              }
            : false
        }
        bordered
      />
    </div>
  );
};

export default BookingsTable;
