import React from 'react';
import { Avatar, Badge, Button, Card, Dropdown, Image, Menu } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link } from 'react-router';
import logo from '../../assets/icons/DUDU.svg';
import { IoMdNotificationsOutline } from 'react-icons/io';
// import { useGetProfileDataQuery } from '../../Redux/services/profileApis';
// import { imageUrl } from '../../Utils/server';
function Header() {
  // const { data: profileData, isLoading } = useGetProfileDataQuery({});

  const user = {
    photoURL:
      'https://wallpapercat.com/w/full/b/9/2/2144467-1920x1080-desktop-full-hd-hinata-naruto-wallpaper.jpg',
    displayName: 'Hinata',
    email: 'hinata@yandex',
  };
  // const user = {
  //   photoURL: imageUrl(profileData?.data?.profile_image),
  //   displayName: profileData?.data?.name,
  //   email: profileData?.data?.email,
  // };

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

  const notification = (
    <Menu className="!w-[500px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <Menu.Item key={i}>
          <Card>
            <div className="flex items-start gap-2">
              <Avatar
                size={40}
                src={user?.photoURL}
                className="cursor-pointer !min-w-12 !min-h-12"
              />
              <div>
                <h2>New User Joined</h2>
                <h3>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Libero voluptatem porro aperiam odit fugiat? Quod?
                </h3>
                <p className="text-xs opacity-75">2025-04-24 • 09:20 AM</p>
              </div>
            </div>
          </Card>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div className="px-10  h-16 flex justify-between items-center">
      <img className="h-12" src={logo} alt="Dudu" />
      <div className="flex items-center  gap-4 text-2xl">
        <Dropdown
          overlay={notification}
          trigger={['click']}
          placement="bottomRight"
        >
          <Badge count={1}>
            <Button shape="circle" icon={<IoMdNotificationsOutline />} />
          </Badge>
        </Dropdown>
        <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
          <Avatar size={40} src={user?.photoURL} className="cursor-pointer" />
        </Dropdown>
      </div>
    </div>
  );
}

export default Header;
