import React from 'react';
import { Box, Typography, Grid, Card, CardContent, useTheme, Chip, Stack } from '@mui/material';
import { motion } from 'framer-motion';

import TouchAppIcon from '@mui/icons-material/TouchApp';
import UpdateDisabledIcon from '@mui/icons-material/UpdateDisabled';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import RuleFolderIcon from '@mui/icons-material/RuleFolder';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PeopleIcon from '@mui/icons-material/People';

const FeaturesSection = () => {
  const theme = useTheme();

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.04 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const features = [
    { icon: TouchAppIcon, title: 'Smart Check-In', desc: 'Single-click check-ins with local shift time logging.', color: '#3B82F6' },
    { icon: UpdateDisabledIcon, title: 'Late Entry Auditing', desc: 'Automatic late check-in flag triggers to track compliance.', color: '#EF4444' },
    { icon: AccountBalanceWalletIcon, title: 'Live Balance Wallets', desc: 'Real-time casual, medical and paid leave balances.', color: '#10B981' },
    { icon: RuleFolderIcon, title: 'Multi-Level Approvals', desc: 'Approvals escalate automatically to HR for requests >= 10 days.', color: '#EC4899' },
    { icon: AssessmentIcon, title: 'HR Trend Analytics', desc: 'Visual charts illustrating check-in logs and leave distributions.', color: '#F59E0B' },
    { icon: LockOpenIcon, title: 'JWT Security', desc: 'Stateless session authentication token keys exchanged via headers.', color: '#6366F1' },
    { icon: NotificationsActiveIcon, title: 'Kafka Notifications', desc: 'Real-time updates distributed asynchronously via Kafka channels.', color: '#06B6D4' },
    { icon: PeopleIcon, title: 'Role-Based Portals', desc: 'Dedicated dashboard interfaces for Employees, Managers, HR, and Admins.', color: '#14B8A6' }
  ];

  const techStack = [
    { name: 'React', color: '#61DAFB' },
    { name: 'Material UI', color: '#0081CB' },
    { name: 'Spring Boot', color: '#6DB33F' },
    { name: 'Spring Security', color: '#6DB33F' },
    { name: 'JWT Stateless', color: '#F43F5E' },
    { name: 'Apache Kafka', color: '#231F20' },
    { name: 'Spring Cloud Eureka', color: '#2563EB' },
    { name: 'API Gateway', color: '#2563EB' },
    { name: 'MySQL DB', color: '#4479A1' }
  ];

  return (
    <Box
      id="features"
      sx={{
        py: 10,
        px: { xs: 3, md: 8 },
        bgcolor: 'background.paper',
        position: 'relative'
      }}
    >
      <Box
        component={motion.div}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
        sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}
      >
        {/* Header Title */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="subtitle2" color="primary" fontWeight={800} sx={{ textTransform: 'uppercase', letterSpacing: '1.5px', mb: 1.5 }}>
            Core Capabilities
          </Typography>
          <Typography variant="h4" fontWeight={850} sx={{ letterSpacing: '-0.5px' }}>
            Everything Required for HR Success
          </Typography>
        </Box>

        {/* Unified Capabilities Frame (1 Frame Card) */}
        <Card
          sx={{
            borderRadius: 4.5,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 12px 30px rgba(0,0,0,0.02)',
            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.2)' : 'rgba(248, 250, 252, 0.45)',
            p: { xs: 2.5, md: 4.5 }
          }}
        >
          <Grid container spacing={4}>
            {features.map((feature, i) => (
              <Grid xs={12} sm={6} md={3} key={i}>
                <Box 
                  component={motion.div}
                  variants={itemVariants}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    gap: 2,
                    p: 1.5,
                    borderRadius: 3,
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'
                    }
                  }}
                >
                  {/* Small Circular/Rounded Icon */}
                  <Box sx={{
                    width: 38, height: 38, borderRadius: 2, bgcolor: `${feature.color}10`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <feature.icon sx={{ color: feature.color, fontSize: 20 }} />
                  </Box>

                  {/* Title and Short Description */}
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 0.5, fontSize: '0.9rem', letterSpacing: '-0.1px' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
                      {feature.desc}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Card>

        {/* Bottom Tech Stack Bar */}
        <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 5, textAlign: 'center' }}>
          <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: '1px', color: 'text.secondary' }}>
            Powered by TechNova Architecture Stack
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1.5 }}>
            {techStack.map((tech, i) => (
              <Chip
                key={i}
                label={tech.name}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  px: 1, py: 1.8,
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': { borderColor: tech.color }
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FeaturesSection;
