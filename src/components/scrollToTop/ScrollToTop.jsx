import React from 'react'
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();
  
    useEffect(() => {
        document.documentElement.scrollTo({ top: 0, behavior: 'smooth' })

    }, [pathname]);
  }
  
  export default ScrollToTop;