import React from 'react';
import { Box, Card, CardContent, Typography, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';

/**
 * StatsCard — animated KPI card for dashboard statistics
 */
const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'primary',
  gradient,
  loading = false,
  trend,
  onClick,
}) => {
  const gradientMap = {
    primary: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)',
    secondary: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
    success: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    warning: 'linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%)',
    error: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
    info: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
  };

  const bg = gradient || gradientMap[color] || gradientMap.primary;

  if (loading) {
    return (
      <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <CardContent sx={{ p: 3 }}>
          <Skeleton variant="rectangular" width={48} height={48} sx={{ borderRadius: 2, mb: 2 }} />
          <Skeleton width="60%" height={28} />
          <Skeleton width="40%" height={20} sx={{ mt: 1 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <Card
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          transition: 'box-shadow 0.3s',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          },
        }}
      >
        {/* Top gradient bar */}
        <Box sx={{ height: 4, background: bg }} />

        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="body2" color="text.secondary" fontWeight={500} gutterBottom>
                {title}
              </Typography>
              <Typography variant="h4" fontWeight={800} sx={{ lineHeight: 1.2 }}>
                {value ?? '—'}
              </Typography>
              {subtitle && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {subtitle}
                </Typography>
              )}
              {trend && (
                <Typography
                  variant="caption"
                  sx={{
                    mt: 1,
                    display: 'inline-block',
                    color: trend.positive ? 'success.main' : 'error.main',
                    fontWeight: 600,
                  }}
                >
                  {trend.positive ? '▲' : '▼'} {trend.value}
                </Typography>
              )}
            </Box>

            {Icon && (
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: 2,
                  background: bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: `0 4px 16px rgba(0,0,0,0.2)`,
                }}
              >
                <Icon sx={{ color: 'white', fontSize: 26 }} />
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;
