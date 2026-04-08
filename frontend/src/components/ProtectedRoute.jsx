import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const getDefaultRouteByRole = (role) => {
    switch (role) {
        case 'ADMIN':
            return '/admin-dashboard';
        case 'STUDENT':
            return '/student-dashboard';
        case 'LECTURER':
            return '/lecturer-dashboard';
        default:
            return '/login';
    }
};

const ProtectedRoute = ({ allowedRoles }) => {
    const location = useLocation();
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (!storedUser) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (allowedRoles && !allowedRoles.includes(storedUser.role)) {
        return <Navigate to={getDefaultRouteByRole(storedUser.role)} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;