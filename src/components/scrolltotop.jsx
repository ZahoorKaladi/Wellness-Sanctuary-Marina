import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // We remove { behavior: 'smooth' }
    // We want the new page to appear at the top INSTANTLY.
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;