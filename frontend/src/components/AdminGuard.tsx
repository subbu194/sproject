import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import apiClient, { setAdminToken } from '../api/client';

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(() => (
    localStorage.getItem('adminToken') ? null : false
  ));
  const hasVerified = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');

    if (!token) {
      return;
    }

    // If already verified in this component lifecycle, skip re-verification
    if (hasVerified.current) return;

    // Ensure the Axios client has the token set in the Authorization header
    // before making the verification call. This is the critical fix — without
    // this, the /auth/me call may go out without credentials after a page
    // refresh or hot reload.
    setAdminToken(token);

    let isMounted = true;
    apiClient.get('/auth/me')
      .then(() => {
        if (isMounted) {
          hasVerified.current = true;
          setIsAuthorized(true);
        }
      })
      .catch(() => {
        if (isMounted) {
          // Only remove the token if the server explicitly rejected it.
          // This prevents logout on transient network errors.
          localStorage.removeItem('adminToken');
          setAdminToken(undefined);
          setIsAuthorized(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isAuthorized === null) {
    return <div className="flex justify-center py-20">Verifying access...</div>;
  }

  if (!isAuthorized) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
