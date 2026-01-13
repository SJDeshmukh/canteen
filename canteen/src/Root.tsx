import React, { useEffect, useState } from 'react';
import App from './App';
import { Admin } from './admin/Admin';

const getRoute = () => {
  const h = window.location.hash.replace('#', '');
  if (h.startsWith('/admin')) return 'admin';
  return 'home';
};

export const Root: React.FC = () => {
  const [route, setRoute] = useState<string>(getRoute());
  useEffect(() => {
    const onHash = () => setRoute(getRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return route === 'admin' ? <Admin /> : <App />;
};

