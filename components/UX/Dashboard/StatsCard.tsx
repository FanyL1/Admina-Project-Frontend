
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { TrendingUp, TrendingDown, TrendingFlat } from '@mui/icons-material';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: string;
  trend?: number;
  loading?: boolean;
  subtitle?: string;
}

export const StatsCard = ({ title, value, icon, color = '#1976d2', trend, loading, subtitle }: StatsCardProps) => {
  if (loading) {
    return (
      <Card sx={{ height: '100%', borderRadius: 2 }}>
        <CardContent>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" width="80%" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%', borderRadius: 2, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mt: 1 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {subtitle}
              </Typography>
            )}
            {trend !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {trend > 0 ? <TrendingUp fontSize="small" sx={{ color: 'success.main' }} /> : trend < 0 ? <TrendingDown fontSize="small" sx={{ color: 'error.main' }} /> : <TrendingFlat fontSize="small" sx={{ color: 'text.secondary' }} />}
                <Typography variant="caption" sx={{ ml: 0.5, color: trend > 0 ? 'success.main' : trend < 0 ? 'error.main' : 'text.secondary' }}>
                  {Math.abs(trend)}% desde ayer
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ bgcolor: `${color}15`, borderRadius: 2, p: 1 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};