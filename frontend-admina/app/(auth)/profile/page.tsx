'use client';
import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Chip,
  Grid,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ShieldIcon from '@mui/icons-material/Shield';
import CircleIcon from '@mui/icons-material/Circle';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';
import InputAdornment from '@mui/material/InputAdornment';

import theme from '../../theme';
import { useProfile } from './useProfile';
import toast from 'react-hot-toast';
import AppToaster from '@/components/UX/Toaster/AppToaster';

const statusColors: Record<string, string> = {
  active: '#4CAF50',
  inactive: '#F44336',
};

const roleGradients: Record<string, string> = {
  Estudiante: 'linear-gradient(135deg, #32539A, #6586CD)',
  Administrativo: 'linear-gradient(135deg, #0c1527, #32539A)',
  Superusuario: 'linear-gradient(135deg, #1a1a2e, #E94560)',
};

export default function ProfilePage() {
const { 
  formData, 
  saving, 
  sessionUser,
  showPasswords, 
  validationErrors,
  handleChange, 
  updateProfile, 
  toggleShowPassword,
  getUserCreatedAt,
  getFieldError 
} = useProfile();  
  const [editing, setEditing] = useState(false);

  const handleSave = async () => {
    const ok = await updateProfile();
    if (ok) {
      setEditing(false);
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handleCopyEmail = () => {
    if (sessionUser?.email) {
      navigator.clipboard.writeText(sessionUser.email);
      toast.success('Correo copiado al portapapeles');
    }
  };

  const gradient =
    roleGradients[sessionUser?.role?.name || ''] ||
    'linear-gradient(135deg, #32539A, #6586CD)';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppToaster />

      {/* Header decorativo */}
      <Box sx={{ py: { xs: 5, sm: 2, md: 0 } }}>

        <Container maxWidth="lg">
          {/* Tarjeta principal - Avatar y datos principales */}
          <Paper
            elevation={3}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              mb: 4,
            }}
          >
            {/* Banner de gradiente */}
            <Box
              sx={{
                background: gradient,
                height: { xs: 100, sm: 140 },
                position: 'relative',
              }}
            />

            {/* Avatar superpuesto */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'center', sm: 'center' },
                px: { xs: 3, md: 5 },
                py: 3,
                gap: 2.5,
              }}
            >
              <Avatar
                sx={{
                  width: { xs: 80, sm: 100 },
                  height: { xs: 80, sm: 100 },
                  bgcolor: 'primary.main',
                  fontSize: { xs: '2rem', sm: '2.5rem' },
                  fontWeight: 700,
                  border: '4px solid white',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                  mt: { xs: -6, sm: -10 },
                }}
              >
                {sessionUser?.name?.[0]?.toUpperCase()}
                {sessionUser?.lastname?.[0]?.toUpperCase()}
              </Avatar>

              <Box
                sx={{
                  textAlign: { xs: 'center', sm: 'left' },
                  minWidth: 0,
                  width: { xs: '100%', sm: 'auto' },
                  flex: { sm: 1 },
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    lineHeight: 1.2,
                    wordBreak: 'break-word',
                  }}
                >
                  {sessionUser?.name} {sessionUser?.lastname}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                    gap: 1.5,
                    mt: 1,
                    flexWrap: 'wrap',
                  }}
                >
                  <Chip
                    icon={<ShieldIcon sx={{ fontSize: 16 }} />}
                    label={sessionUser?.role?.name}
                    size="small"
                    sx={{
                      background: gradient,
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      '& .MuiChip-icon': { color: 'white' },
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CircleIcon
                      sx={{
                        fontSize: 10,
                        color: statusColors[sessionUser?.status || ''] || '#9E9E9E',
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {sessionUser?.status === 'active' ? 'Activo' : 'Inactivo'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Botón editar */}
              {!editing ? (
                <Tooltip title="Editar perfil">
                  <IconButton
                    onClick={() => setEditing(true)}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: '#253E74' },
                      width: 40,
                      height: 40,
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Cancelar">
                    <IconButton
                      onClick={() => setEditing(false)}
                      sx={{
                        bgcolor: '#F44336',
                        color: 'white',
                        '&:hover': { bgcolor: '#D32F2F' },
                        width: 40,
                        height: 40,
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Guardar cambios">
                    <IconButton
                      onClick={handleSave}
                      disabled={saving}
                      sx={{
                        bgcolor: '#4CAF50',
                        color: 'white',
                        '&:hover': { bgcolor: '#388E3C' },
                        width: 40,
                        height: 40,
                      }}
                    >
                      <SaveIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>
          </Paper>

          {/* Grid de información */}
          <Grid container spacing={3}>
            {/* Información personal */}
            <Grid size={{ xs: 12, md: editing ? 12 : 6 }}>
              <Paper
                elevation={3}
                sx={{
                  borderRadius: 4,
                  p: { xs: 3, md: 4 },
                  height: '100%',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <PersonIcon color="primary" />
                  Información Personal
                </Typography>

                {editing ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField
                      label="Nombres"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      fullWidth
                      variant="outlined"
                      size="small"
                      error={!!getFieldError('name')}
                      helperText={getFieldError('name')}
                    />
                    <TextField
                      label="Apellidos"
                      value={formData.lastname}
                      onChange={(e) => handleChange('lastname', e.target.value)}
                      fullWidth
                      variant="outlined"
                      size="small"
                      error={!!getFieldError('lastname')}
                      helperText={getFieldError('lastname')}
                    />
                    <TextField
                      label="Correo Electrónico"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      fullWidth
                      variant="outlined"
                      size="small"
                      type="email"
                      error={!!getFieldError('email')}
                      helperText={getFieldError('email')}
                    />

                    <Box sx={{ borderTop: '1px solid', borderColor: 'grey.200', pt: 2 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, color: 'text.secondary' }}
                      >
                        <LockIcon fontSize="small" />
                        Cambiar Contraseña
                      </Typography>

                      <TextField
                        label="Contraseña Actual"
                        value={formData.currentPass}
                        onChange={(e) => handleChange('currentPass', e.target.value)}
                        fullWidth
                        variant="outlined"
                        size="small"
                        type={showPasswords.current ? 'text' : 'password'}
                        placeholder="Ingresa tu contraseña actual"
                        error={!!getFieldError('currentPass')}
                        helperText={getFieldError('currentPass')}
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={() => toggleShowPassword('current')} edge="end" size="small">
                                  {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          },
                        }}
                      />

                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mt: 2 }}>
                        <TextField
                          label="Nueva Contraseña"
                          value={formData.newPass}
                          onChange={(e) => handleChange('newPass', e.target.value)}
                          fullWidth
                          variant="outlined"
                          size="small"
                          type={showPasswords.new ? 'text' : 'password'}
                          placeholder="Mín. 8 caracteres, 1 mayúscula, 1 número, 1 especial"
                          error={!!getFieldError('newPass')}
                          helperText={getFieldError('newPass')}
                          slotProps={{
                            input: {
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton onClick={() => toggleShowPassword('new')} edge="end" size="small">
                                    {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                        <TextField
                          label="Repetir Nueva Contraseña"
                          value={formData.confirmPass}
                          onChange={(e) => handleChange('confirmPass', e.target.value)}
                          fullWidth
                          variant="outlined"
                          size="small"
                          type={showPasswords.confirm ? 'text' : 'password'}
                          placeholder="Repite la nueva contraseña"
                          error={!!getFieldError('confirmPass')}
                          helperText={getFieldError('confirmPass')}
                          slotProps={{
                            input: {
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton onClick={() => toggleShowPassword('confirm')} edge="end" size="small">
                                    {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <InfoRow icon={<BadgeIcon />} label="Nombres" value={sessionUser?.name} />
                    <InfoRow icon={<BadgeIcon />} label="Apellidos" value={sessionUser?.lastname} />
                    <InfoRow icon={<BadgeIcon />} label="Cédula" value={sessionUser?.dni} />
                    <InfoRow
                      icon={<EmailIcon />}
                      label="Correo Electrónico"
                      value={sessionUser?.email}
                      action={
                        <Tooltip title="Copiar correo">
                          <IconButton size="small" onClick={handleCopyEmail} sx={{ color: 'primary.main' }}>
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      }
                    />
                  </>
                )}
              </Paper>
            </Grid>

            {/* Información de la cuenta */}
            <Grid size={{ xs: 12, md: editing ? 12 : 6 }}>
              <Paper
                elevation={3}
                sx={{
                  borderRadius: 4,
                  p: { xs: 3, md: 4 },
                  height: '100%',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <ShieldIcon color="primary" />
                  Información de la Cuenta
                </Typography>

                <InfoRow
                  icon={<CalendarTodayIcon />}
                  label="Miembro desde"
                  value={getUserCreatedAt()}
                />
                <InfoRow
                  icon={<ShieldIcon />}
                  label="Rol"
                  value={sessionUser?.role?.name}
                  chip
                  chipColor={gradient}
                />
                <InfoRow
                  icon={<CircleIcon sx={{ color: statusColors[sessionUser?.status || ''] || '#9E9E9E' }} />}
                  label="Estado"
                  value={sessionUser?.status === 'active' ? 'Activo' : 'Inactivo'}
                  valueColor={statusColors[sessionUser?.status || ''] || '#9E9E9E'}
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

function InfoRow({
  icon,
  label,
  value,
  action,
  chip,
  chipColor,
  valueColor,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  action?: React.ReactNode;
  chip?: boolean;
  chipColor?: string;
  valueColor?: string;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        py: 1.5,
        borderBottom: '1px solid',
        borderColor: 'grey.100',
        '&:last-child': { borderBottom: 'none' },
      }}
    >
      <Box sx={{ color: 'primary.main', display: 'flex', alignItems: 'center', minWidth: 36 }}>
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
          {label}
        </Typography>
        {chip ? (
          <Chip
            label={value}
            size="small"
            sx={{
              background: chipColor,
              color: 'white',
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 24,
            }}
          />
        ) : (
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, color: valueColor || 'text.primary' }}
          >
            {value || '—'}
          </Typography>
        )}
      </Box>
      {action && <Box>{action}</Box>}
    </Box>
  );
}
