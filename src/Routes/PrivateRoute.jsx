import React from 'react';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuthorization = () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const currentPath = location.pathname;

        // Define routes for each role
        const roleRoutes = {
          SUPER_ADMIN: [
            '/',
            '/user-management',
            '/manage-post',
            '/subscription',
            '/earnings',
            '/manage-admins',
            '/profile-setting',
            '/faq-management',
            '/privacy-policy',
            '/terms-condition',
            '/feedback',
          ],
          ADMIN: [
            '/',
            '/user-management',
            '/manage-post',
            '/profile-setting',
            '/faq-management',
            '/privacy-policy',
            '/terms-condition',
            '/feedback',
          ],
        };

        // Check if user's role has access to current path
        if (decoded.role && roleRoutes[decoded.role]) {
          setIsAuthorized(roleRoutes[decoded.role].includes(currentPath));
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        console.error('Invalid token', error);
        setIsAuthorized(false);
      }
      setIsLoading(false);
    };

    checkAuthorization();
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <span className="loader-black"></span>
      </div>
    );
  }

  return isAuthorized ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
