import React from 'react';

interface MinimalLayoutProps {
  children: React.ReactNode;
}

const MinimalLayout: React.FC<MinimalLayoutProps> = ({ children }) => {
  return <>{children}</>;
};

export default MinimalLayout;