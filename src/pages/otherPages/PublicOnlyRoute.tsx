import type { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuthStore } from '../../stores/authStore';

interface PublicOnlyRouteProps {
    children: ReactNode;
    redirectTo?: string;
}

const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({
    children,
    redirectTo = '/'
}) => {
    const { isAuthenticated } = useAuthStore();

    if (isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
};

export default PublicOnlyRoute;