import React, { ReactNode, useState } from 'react';
import {
  Popover,
  Box,
  Typography,
  Button,
  CircularProgress
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

interface TextModalProps {
  alert: ReactNode;
  description?: ReactNode;
  onConfirm: () => void;
  okText?: string;
  cancelText?: string;
  loading?: boolean;
  disabled?: boolean;
  okButtonProps?: any;
  children: React.ReactNode;
}

export default function MuiPopconfirm({
  alert,
  description,
  onConfirm,
  okText = 'Aceptar',
  cancelText = 'Cancelar',
  loading = false,
  disabled = false,
  okButtonProps = {},
  children
} : TextModalProps) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: any) => {
    if (disabled) return;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    if (loading) return; // Evitar cerrar mientras carga
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'mui-popconfirm-popover' : undefined;

  return (
    <>
      {/* Elemento que activa el popconfirm (ej. tu botón) */}
      <span onClick={handleClick} style={{ display: 'inline-block' }}>
        {children}
      </span>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
       
        style={{ width: 280, padding: '16px', borderRadius: 8 }}
        
      >
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', p: 2, borderRadius:2 }}>
          <WarningAmberRoundedIcon color="warning" sx={{ fontSize: 22, mt: 0.2 }} />
          <Box sx={{ flex: 1 }}>
            {/* Título */}
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '13px' }}>
              {alert}
            </Typography>

            {/* Descripción */}
            {description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '12px' }}>
                {description}
              </Typography>
            )}

            {/* Botones de acción */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button
                size="small"
                variant="outlined"
                color="inherit"
                onClick={handleClose}
                disabled={loading}
                sx={{ textTransform: 'none', minWidth: 50 }}
              >
                {cancelText}
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={()=>onConfirm()}
                disabled={loading}
                color={okButtonProps.danger ? 'error' : 'primary'}
                startIcon={loading ? <CircularProgress size={14} color="inherit" /> : null}
                sx={{ textTransform: 'none', minWidth: 50, ...okButtonProps.sx }}
              >
                {okText}
              </Button>
            </Box>
          </Box>
        </Box>
      </Popover>
    </>
  );
}