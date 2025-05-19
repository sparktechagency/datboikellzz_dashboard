import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Dropdown, Image, Menu } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link } from 'react-router';
import logo from '../../assets/icons/DUDU.svg';
import { IoMdNotificationsOutline } from 'react-icons/io';
import Notify from '../../pages/Components/Notify_components/Notify';
import { useGetSuperAdminProfileQuery } from '../../Redux/services/superAdminProfileApis';
import { imageUrl } from '../../Utils/server';
import { jwtDecode } from 'jwt-decode';
import { useGetProfileDataQuery } from '../../Redux/services/profileApis';

function Header() {
  const [adminRole, setAdminRole] = useState(null);
  const [notifications, setNotifications] = useState(
    Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      message: `Notification ${i + 1}`,
      date: '2025-04-24 • 09:20 AM',
    }))
  );
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const decoded = jwtDecode(token);
    setAdminRole(decoded.role);
  }, []);

  const adminSkip = adminRole === null || adminRole === 'ADMIN';
  const superAdminSkip = adminRole === null || adminRole === 'SUPER_ADMIN';
  const { data: adminData, isLoading: adminDataLoading } =
    useGetProfileDataQuery(undefined, {
      skip: superAdminSkip,
    });

  const { data, isLoading } = useGetSuperAdminProfileQuery(undefined, {
    skip: adminSkip,
  });

  const user = {
    photoURL: imageUrl(
      data?.data?.profile_image || adminData?.data?.profile_image
    ),
    displayName: data?.data?.name || adminData?.data?.name,
    email: data?.data?.email || adminData?.data?.email,
    role: data?.data?.authId?.role || adminData?.data?.authId?.role,
  };

  const handleSignOut = () => {
    console.log('sign out');
    window.location.href = '/login';
  };

  const handleRemoveNotification = (index) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((_, i) => i !== index)
    );
  };

  const menu = (
    <Menu className="w-fit rounded-xl shadow-lg">
      <div className="p-4 flex items-center gap-3">
        <Image
          className="!w-12 !h-12 object-cover overflow-hidden rounded-full"
          src={user?.photoURL}
        />
        <div>
          <h1 className="font-semibold text-base">{user?.displayName}</h1>
          <h1 className="font-normal opacity-75 text-sm">{user?.email}</h1>
        </div>
      </div>
      <Menu.Divider />
      <Menu.Item key="1" icon={<UserOutlined />}>
        <Link to="/profile-setting">Profile</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="4" icon={<LogoutOutlined />} onClick={handleSignOut}>
        Log out
      </Menu.Item>
    </Menu>
  );

  const notification = (
    <Menu className="!w-[500px]">
      {notifications.map((notif, i) => (
        <Notify
          key={notif.id}
          i={i}
          user={user}
          onRemove={handleRemoveNotification}
        />
      ))}
    </Menu>
  );

  return (
    <div className="px-10 shadow-md mb-1 !z-[999] h-16 flex justify-between items-center">
      <img className="h-12" src={logo} alt="Dudu" />
      <div className="flex items-center gap-4 text-2xl">
        <Dropdown
          overlay={notification}
          trigger={['click']}
          placement="bottomRight"
        >
          <Badge count={notifications.length}>
            <Button shape="circle" icon={<IoMdNotificationsOutline />} />
          </Badge>
        </Dropdown>
        <div className="flex items-center gap-3">
          <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
            <Avatar size={40} src={user?.photoURL} className="cursor-pointer" />
          </Dropdown>
          <div>
            <h1 className="text-sm font-normal leading-3">
              {user?.displayName}
            </h1>
            <div className="rounded-md flex items-center justify-center px-1 text-sm font-normal py-1 leading-3 bg-[#DCFCE7]">
              {user?.role}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
