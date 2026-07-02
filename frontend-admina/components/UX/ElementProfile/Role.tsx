import React, { useState } from 'react';
import { Box, Select, MenuItem, IconButton, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ShieldIcon from '@mui/icons-material/Shield';

import {roleGradients} from '@/app/theme';
import toast from 'react-hot-toast';
import { updateRol } from '@/app/(auth)/(management)/useManagement';


interface RoleSelectorProps {
  userSession: any; 
  availableRoles: { id: string; name: string }[]; // Lista de roles para el select
  onRoleChange: (row: any, newRolId: string) => Promise<void>;
  InfoRowComponent: React.ComponentType<any>; // Para mantener exactamente tu InfoRow actual
}

export const RoleSelector = ({ userSession, availableRoles, onRoleChange, InfoRowComponent }: RoleSelectorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(userSession?.role?.id || '');
  const [loading, setLoading] = useState(false);

  const currentRoleName = userSession?.role?.name || 'Sin Rol';
  const gradient = roleGradients[currentRoleName] || 'linear-gradient(135deg, #757575, #9e9e9e)';

    //Cambiar rol
  const handleRolChange = async () => {
    if (selectedRoleId === userSession?.role?.id) {
      setIsEditing(false);
      return;
    }
    setLoading(true);
    try {
      await updateRol(userSession.id, selectedRoleId);
      await refreshUsers(); 
    } catch (error) {
      setLoading(false);
      toast.error('Error al cambiar el rol');
    }
  };

  const handleCancel = () => {
    setSelectedRoleId(userSession?.role?.id || '');
    setIsEditing(false);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
      {isEditing ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
          <Select
            size="small"
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value)}
            disabled={loading}
            sx={{ flexGrow: 1, height: 40 }}
          >
            {availableRoles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
          
          {loading ? (
            <CircularProgress size={24} sx={{ mx: 1 }} />
          ) : (
            <>
              <IconButton onClick={handleRolChange} color="primary" size="small">
                <CheckIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={handleCancel} color="error" size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          )}
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'space-between' }}>
          {/* Conservamos tu InfoRow original pasándole dinámicamente sus props */}
          <InfoRowComponent
            icon={<ShieldIcon />}
            label="Rol"
            value={currentRoleName}
            chip
            chipColor={gradient}
          />
          
          <IconButton 
            onClick={() => setIsEditing(true)} 
            size="small"
            sx={{ 
              ml: 1,
              color: 'text.secondary',
              '&:hover': { color: 'primary.main' }
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

function refreshUsers() {
    throw new Error('Function not implemented.');
}
