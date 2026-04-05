import React from 'react';
import { Outlet } from 'react-router';
import { Navigation } from '../components/Navigation';

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main>
        <Outlet />
      </main>
    </div>
  );
};
