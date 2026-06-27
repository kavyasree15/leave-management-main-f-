import React from 'react';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * PageHeader — consistent page header with title, subtitle, breadcrumbs, and actions
 */
const PageHeader = ({ title, subtitle, breadcrumbs = [], action }) => {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Box sx={{ mb: 3 }}>
        {breadcrumbs.length > 0 && (
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 1 }}>
            {breadcrumbs.map((crumb, i) =>
              crumb.path && i < breadcrumbs.length - 1 ? (
                <Link
                  key={i}
                  component={RouterLink}
                  to={crumb.path}
                  underline="hover"
                  color="text.secondary"
                  variant="caption"
                >
                  {crumb.label}
                </Link>
              ) : (
                <Typography key={i} variant="caption" color="text.primary" fontWeight={600}>
                  {crumb.label}
                </Typography>
              )
            )}
          </Breadcrumbs>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {action && <Box>{action}</Box>}
        </Box>
      </Box>
    </motion.div>
  );
};

export default PageHeader;
