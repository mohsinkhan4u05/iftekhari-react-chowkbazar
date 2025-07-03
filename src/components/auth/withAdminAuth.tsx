import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, ComponentType } from 'react';
import RouteLoader from '@components/common/loader/route-loader';

interface WithAdminAuthProps {
  // Add any additional props if needed
}

const withAdminAuth = <P extends object>(
  WrappedComponent: ComponentType<P>
): ComponentType<P & WithAdminAuthProps> => {
  const AdminProtectedComponent = (props: P & WithAdminAuthProps) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === 'loading') return; // Still loading

      if (!session) {
        // Not authenticated, redirect to login
        router.push('/signin');
        return;
      }

      if (session.user?.role !== 'admin') {
        // Not admin, redirect to unauthorized page or home
        router.push('/unauthorized');
        return;
      }
    }, [session, status, router]);

    // Show loading while checking authentication
    if (status === 'loading') {
      return <RouteLoader />;
    }

    // Show loading while redirecting
    if (!session || session.user?.role !== 'admin') {
      return <RouteLoader />;
    }

    // User is authenticated and is admin, render the component
    return <WrappedComponent {...props} />;
  };

  AdminProtectedComponent.displayName = `withAdminAuth(${WrappedComponent.displayName || WrappedComponent.name})`;

  return AdminProtectedComponent;
};

export default withAdminAuth;
