import { useState, useEffect } from 'react';
import { useNavigationType } from 'react-router-dom';

const useNavigationHistory = () => {
  const navigationType = useNavigationType();

  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  useEffect(() => {
    setCanGoBack(false);
    setCanGoForward(false);

    const handleHistoryChange = () => {
      setCanGoBack(window.history.state?.idx > 0);
      setCanGoForward(window.history.state?.idx < window.history.length - 1);
    };

    handleHistoryChange();

    window.addEventListener('popstate', handleHistoryChange);

    return () => {
      window.removeEventListener('popstate', handleHistoryChange);
    };
  }, [navigationType]);

  return { canGoBack, canGoForward };
};

export default useNavigationHistory;
