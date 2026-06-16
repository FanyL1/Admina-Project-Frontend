'use client';

import { Toaster } from 'react-hot-toast';

export default function AppToaster() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#4caf50',
            secondary: '#fff',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#f44336',
            secondary: '#fff',
          },
        },
      }}
    />
  );
}
