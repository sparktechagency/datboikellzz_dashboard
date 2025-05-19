import React from 'react';
import { useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { SidebarLink, SidebarLinkAdmin } from '../../Utils/Sideber/SidebarLink.jsx';
import { jwtDecode } from 'jwt-decode';
const Sidebar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const token = localStorage.getItem('accessToken');
  const decoded = jwtDecode(token);
  const userRole = decoded.role;

  return (
    <div className=" px-4 pb-10 flex justify-start flex-col gap-3 sidebar">
      {userRole === 'ADMIN'
        ? SidebarLinkAdmin?.map((item) => (
            <NavLink
              onClick={() => {
                setOpen(false);
              }}
              to={item?.path}
              style={{
                width: '100%',
                justifyContent: 'start',
                paddingLeft: '14px',
                paddingRight: '14px',
              }}
              className={`button-white w-full ${
                item?.path === location.pathname
                  ? '!bg-[var(--bg-green-high)] !text-[var(--text-light)]'
                  : 'hover:!bg-[var(--bg-green-nano)] !text-[var(--text-dark)]'
              } whitespace-nowrap links`}
              key={item?.path}
            >
              {item?.path === location.pathname
                ? item?.icon?.active
                : item?.icon?.inactive}
              {item?.label}
            </NavLink>
          ))
        : SidebarLink?.map((item) => (
            <NavLink
              onClick={() => {
                setOpen(false);
              }}
              to={item?.path}
              style={{
                width: '100%',
                justifyContent: 'start',
                paddingLeft: '14px',
                paddingRight: '14px',
              }}
              className={`button-white w-full ${
                item?.path === location.pathname
                  ? '!bg-[var(--bg-green-high)] !text-[var(--text-light)]'
                  : 'hover:!bg-[var(--bg-green-nano)] !text-[var(--text-dark)]'
              } whitespace-nowrap links`}
              key={item?.path}
            >
              {item?.path === location.pathname
                ? item?.icon?.active
                : item?.icon?.inactive}
              {item?.label}
            </NavLink>
          ))}

      <div
        ref={ref}
        className={`flex justify-start flex-col gap-1 transition-all rounded-md duration-300 overflow-hidden`}
        style={{
          height: open ? `${ref.current.scrollHeight}px` : '0',
        }}
      ></div>
    </div>
  );
};

export default Sidebar;
