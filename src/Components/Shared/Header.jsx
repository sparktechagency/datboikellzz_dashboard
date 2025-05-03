import React from 'react';
import { Avatar, Dropdown, Image, Menu } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link } from 'react-router';
import logo from '../../assets/icons/DUDU.svg';
import { useGetProfileDataQuery } from '../../Redux/services/profileApis';
import { imageUrl } from '../../Utils/server';
function Header() {
  const { data: profileData, isLoading } = useGetProfileDataQuery({});

  const user = {
    photoURL: imageUrl(profileData?.data?.profile_image),
    displayName: profileData?.data?.name,
    email: profileData?.data?.email,
  };

  const handleSignOut = () => {
    console.log('sign out');
    window.location.href = '/login';
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

  return (
    <div className="px-10  h-16 flex justify-between items-center">
      <img className="h-12" src={logo} alt="Dudu" />
      <div className="flex items-center  gap-4 text-2xl">
        <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
          <Avatar size={40} src={user?.photoURL} className="cursor-pointer" />
        </Dropdown>
      </div>
    </div>
  );
}

export default Header;
