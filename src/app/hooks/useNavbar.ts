'use client';

import { usePathname } from 'next/navigation';
import { hideNavbarRoutes } from '../../lib/constants';

export function useNavbar() {
  const pathname = usePathname();
  
  // Check if the current path should hide the navbar
  const shouldHideNavbar = hideNavbarRoutes.some(route => {
    // Handle wildcard routes (e.g., 'projects/*')
    if (route.endsWith('*')) {
      const baseRoute = route.slice(0, -1);
      return pathname.startsWith(baseRoute);
    }
    return pathname === route;
  });

  // Get the current page title based on the pathname
  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname.startsWith('/projects')) return 'Projects';
    return 'TaskFlow';
  };

  return {
    showNavbar: !shouldHideNavbar,
    pageTitle: getPageTitle(),
    showBackButton: pathname !== '/dashboard'
  };
}
