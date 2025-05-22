import React from 'react';
import { Card, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

function Notify({ notify, onRemove }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${year}-${month}-${day} • ${String(hours).padStart(
      2,
      '0'
    )}:${minutes} ${ampm}`;
  };

  return (
    <div className="mb-2 w-full">
      <Card
        style={{
          width: '100%',
          backgroundColor: !notify.isRead ? '#f6faff' : 'white',
          borderLeft: !notify.isRead ? '3px solid #1890ff' : 'none',
        }}
        className={!notify.isRead ? 'unread-notification' : ''}
      >
        <div className="flex relative items-start gap-2">
          <div>
            <h2 style={{ fontWeight: !notify.isRead ? '600' : 'normal' }}>
              {notify?.title}
            </h2>
            <h3 style={{ fontWeight: !notify.isRead ? '500' : 'normal' }}>
              {notify?.message}
            </h3>
            <p className="text-xs opacity-75">
              {formatDate(notify?.createdAt)}
            </p>
            <Button
              className="!absolute !top-0 !right-0"
              shape="circle"
              icon={<DeleteOutlined />}
              size="small"
              type="link"
              onClick={() => onRemove(notify?._id)}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Notify;
