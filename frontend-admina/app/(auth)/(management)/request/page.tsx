'use client';

import * as React from 'react';
import DataTable from '@/components/UX/Table/Table';
import { useGetAllCategory} from './usePage';
import { DegreeData } from '@/app/type';
import toast, { Toaster } from 'react-hot-toast';
import {  Box,  Button,  Dialog,  DialogTitle,  DialogContent,  DialogActions,  TextField } from '@mui/material';

import { CardRequest } from '@/components/UX/Card/card';

export default function CarrerasPage() {

  return (
    <Box sx={{ p: 3 }}>
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
      <Box>
        
      </Box>
      
    </Box>
  );
}