import { Navigate } from 'react-router';
import { useAuthStore } from '../stores/authStore';
import type { ReactNode } from 'react';

interface PublicOnlyRouteProps {
    children: ReactNode;
    redirectTo?: string;
}

export const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({
    children,
    redirectTo = '/'
}) => {
    const { isAuthenticated } = useAuthStore();

    if (isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
};