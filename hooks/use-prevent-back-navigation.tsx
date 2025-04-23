import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export const usePreventBackNavigation = () => {
  const router = useRouter();

  useEffect(() => {
    const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ''; // required for Chrome
    };

    const handlePopState = (e: PopStateEvent) => {
        const confirmLeave = window.confirm(
          'You have unsaved changes. Are you sure you want to leave?',
        );
        if (!confirmLeave) {
          e.preventDefault();   
          window.history.pushState(null, '', window.location.href);
        }
      
    };

      window.addEventListener('beforeunload', beforeUnloadHandler);
      window.addEventListener('popstate', handlePopState);
    

    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    const originalPush = router.push;

    router.push = (url: string, options?: NavigateOptions) => {
        const confirmLeave = window.confirm(
          'You have unsaved changes. Are you sure you want to leave?',
        );
        if (confirmLeave) originalPush(url, options);
      
    };

    return () => {
      router.push = originalPush;
    };
  }, [router]);
};
