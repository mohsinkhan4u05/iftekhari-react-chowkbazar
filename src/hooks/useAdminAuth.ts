import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface UseAdminAuthReturn {
  isAdmin: boolean;
  isLoading: boolean;
  session: any;
}

export const useAdminAuth = (redirectOnFail: boolean = true): UseAdminAuthReturn => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
      return;
    }

    setIsLoading(false);

    if (!session) {
      setIsAdmin(false);
      if (redirectOnFail) {
        router.push('/signin');
      }
      return;
    }

    if (session.user?.role === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
      if (redirectOnFail) {
        router.push('/unauthorized');
      }
    }
  }, [session, status, router, redirectOnFail]);

  return {
    isAdmin,
    isLoading,
    session,
  };
};

export default useAdminAuth;
