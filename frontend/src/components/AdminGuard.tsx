import { useState, useEffect, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import apiClient from '../api/client';

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      setIsAuthorized(false);
      return;
    }

    let isMounted = true;
    apiClient.get('/auth/me')
      .then(() => {
        if (isMounted) setIsAuthorized(true);
      })
      .catch(() => {
        if (isMounted) {
          localStorage.removeItem('adminToken');
          setIsAuthorized(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  if (isAuthorized === null) {
    return <div className="flex justify-center py-20">Verifying access...</div>;
  }

  if (!isAuthorized) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
