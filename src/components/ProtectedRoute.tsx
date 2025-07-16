import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const userInfo = localStorage.getItem('userInfo');

    // If the user is logged in, render the child routes (using <Outlet />).
    // Otherwise, redirect them to the login page.
    return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
