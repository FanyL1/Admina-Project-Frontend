import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Button } from '@mui/material';
import {updateUserTable} from '@/schemas/updateUserSchem';

// Definimos lo que necesita el modal desde la tabla
interface EditModalProps {
  open: boolean;
  onClose: () => void;
  rowData: any; // El registro seleccionado
  columns: any[];
  title: string;
  onSave: (updatedData: any) => Promise<void> | void;
  saving: boolean;
}

export const EditModal = ({ open, onClose, rowData, columns, title, onSave, saving }: EditModalProps) => {
  // 1. Clonamos el registro en un estado LOCAL. 
  // La tabla padre ya no se re-renderiza mientras escribes.
  const [localRow, setLocalRow] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    if (rowData) {
      setLocalRow({ ...rowData });
      setValidationErrors({});
    }
  }, [rowData, open]);

  if (!open || !localRow) return null;

  const handleLocalSave = () => {
    
    setValidationErrors({});
    const result = updateUserTable.safeParse(localRow);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (typeof path === 'string') fieldErrors[path] = issue.message;
      });
      setValidationErrors(fieldErrors);
      return;
    }
    // Le devolvemos los datos listos y validados al padre
    onSave(localRow);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Editar {title}</DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {columns.map((column) => {
            const hasError = !!validationErrors[column.id];
            const errorMessage = validationErrors[column.id];

            if (column.editOptions) {
              return (
                <FormControl key={column.id} fullWidth error={hasError}>
                  <InputLabel>{column.label}</InputLabel>
                  <Select
                    label={column.label}
                    value={localRow[column.id] || ''}
                    onChange={(e) => setLocalRow({ ...localRow, [column.id]: e.target.value })}
                  >
                    {column.editOptions.map((option: any) => (
                      <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                    ))}
                  </Select>
                  {hasError && <FormHelperText>{errorMessage}</FormHelperText>}
                </FormControl>
              );
            }

            return (
              <TextField
                key={column.id}
                fullWidth
                label={column.label}
                value={localRow[column.id] || ''}
                onChange={(e) => setLocalRow({ ...localRow, [column.id]: e.target.value })}
                error={hasError}
                helperText={errorMessage}
              />
            );
          })}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="error" disabled={saving}>
          Cancelar
        </Button>
        <Button onClick={handleLocalSave} variant="contained" color="primary" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};