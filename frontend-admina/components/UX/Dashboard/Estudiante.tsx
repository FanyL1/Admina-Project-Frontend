'use client';
import { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid as Grid } from '@mui/material';
import { Assignment, CheckCircle, Pending, Schedule } from '@mui/icons-material';
import { StatsCard } from '@/components/UX/Dashboard/StatsCard';
import { RecentActivity } from '@/components/UX/Dashboard/RecentActivity';

export default function StudentDashboard() {

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>     

      {/* Solicitudes recientes resueltas */}
      <RecentActivity title="Solicitudes Recientes" />

    </Container>
  );
}