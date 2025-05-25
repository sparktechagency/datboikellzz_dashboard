import React from 'react';
import AllUsers from './AllUsers';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

function RecentlyJoinedUsers() {
  return (
    <div>
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-black">
            Recently Joined Users
          </h1>
          <Link to={'/user-management'}>
            <Button className='!bg-[var(--bg-green-high)] !text-[var(--color-white)]'>View All</Button>
          </Link>
        </div>
      </div>
      <AllUsers limit={5} recentUser={true} />
    </div>
  );
}

export default RecentlyJoinedUsers;
