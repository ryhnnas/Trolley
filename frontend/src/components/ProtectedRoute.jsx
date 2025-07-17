import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProtectedRoute = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        toast.error('Anda harus login untuk mengakses halaman ini.');
        return <Navigate to="/auth" replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;