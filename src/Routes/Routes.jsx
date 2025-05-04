import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Auth/Login';
import ForgetPassword from '../pages/Auth/ForgetPassword';
import Otp from '../pages/Auth/Otp';
import ResetPassword from '../pages/Auth/ResetPassword';
import Dashboard from '../Layout/Dashboard';
import DashboardHome from '../pages/DashboardPages/DashboardHome/DashboardHome';
import UsersManage from '../pages/DashboardPages/UsersManage/UsersManage';
import TermsCondition from '../pages/DashboardPages/terms&condition/TermsCondition';
import PrivateRoute from './PrivetRoute';
import PrivacyPolicy from '../pages/DashboardPages/privacy&policy/PrivacyPolicy';
import Profile from '../pages/DashboardPages/ProfilePages/Profile';
import FrequentlyAskedQuestions from '../pages/DashboardPages/FrequentlyAskedQuestions/FrequentlyAskedQuestions';
import ManagePost from '../pages/DashboardPages/manage-post/ManagePost';


export const Routes = createBrowserRouter([
  {
    path: '/',
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      {
        path: '/',
        element: <DashboardHome />,
      },
      {
        path: '/user-management',
        element: <UsersManage />,
      },

      {
        path: '/manage-post',
        element: <ManagePost />,
      },
      {
        path: '/terms-condition',
        element: <TermsCondition />,
      },
      {
        path: '/privacy-policy',
        element: <PrivacyPolicy />,
      },
      {
        path: '/profile-setting',
        element: <Profile />,
      },
      {
        path: '/faq-management',
        element: <FrequentlyAskedQuestions />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/forgot-password',
    element: <ForgetPassword />,
  },
  {
    path: '/otp',
    element: <Otp />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
]);
