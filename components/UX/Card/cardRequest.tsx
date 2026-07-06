'use client';
import { useState } from 'react';
import Router from 'next/router';
import {Box,Typography, Chip, Stack, IconButton, Collapse, Grid, Alert,} from '@mui/material';
import { ExpandMore, ExpandLess, School, Work, AccountBalance, HealthAndSafety, Home, Description,} from '@mui/icons-material';

import { Cards } from '@/components/UX/Card/card';
import { Buttons } from '@/components/UX/Buttons/buttons';
import { useGetAllCategory } from '@/app/(auth)/(management)/managementCategory/useCategory';
import { useGetAlltype } from '@/app/(auth)/(management)/managementType/useGetType';
import { link } from 'fs';

// Definición de tipos
interface Type {
  id: string;
  name: string;
  category: Category[];
  requeriments: Object;
}

interface Category {
  id: string;
  name: string;
}

// Mapa de iconos por categoría (puedes personalizarlo)
const categoryIcons: Record<string, React.ReactNode> = {
  'Educación': <School />,
  'Laboral': <Work />,
  'Bancario': <AccountBalance />,
  'Salud': <HealthAndSafety />,
  'Vivienda': <Home />,
  'Documentación': <Description />,
  // Agrega más según tus categorías
};
const getAllRequirements = (requirements: any): string[] => {
  if (!requirements) return [];
  
  const allRequirements: string[] = [];
  
  if (Array.isArray(requirements)) {
    return requirements;
  }
  
  if (typeof requirements === 'object') {
    Object.entries(requirements).forEach(([key, value]) => {
      // 1. Manejo exclusivo de la lista de documentos
      if (key === 'documents' && Array.isArray(value)) {
        allRequirements.push(...value);
        return; // Salta a la siguiente iteración
      }

      // 2. Controlar valores vacíos, nulos o "No aplica" (0, false, null)
      if (value === null || value === undefined || value === false || value === 0) {
        return; 
      }

      // Diccionario para traducir las llaves técnicas a nombres limpios en español
      const labelMap: Record<string, string> = {
        promedio: 'Promedio mínimo',
        UC: 'Unidades de Crédito Aprobadas (UA)',
        cohorte: 'Filtro de cohorte',
        liso: 'Condición de alumno',
        materia: 'Requiere materia',
      };

      const label = labelMap[key] || key;

      // 3. Evaluar los tipos de datos primitivos (string, number, boolean)
      if (typeof value === 'string' || typeof value === 'number') {
        allRequirements.push(`${label}: ${value}`);
      } else if (typeof value === 'boolean') {
        // Si cohorte o materia son true, mostramos un mensaje amigable
        if (value === true) {
          allRequirements.push(`${label}: Sí`);
        }
      } else if (Array.isArray(value)) {
        // Por si tienes algún otro array que no sea documentos
        value.forEach((item) => {
          if (item) allRequirements.push(`${label}: ${item}`);
        });
      } else if (typeof value === 'object') {
        // Por si hay objetos anidados complejos
        const nested = getAllRequirements(value);
        nested.forEach((item) => {
          allRequirements.push(`${label}: ${item}`);
        });
      }
    });
  }
  
  return allRequirements;
};

export const CardRequest = () => {
  const { categories } = useGetAllCategory();
  const {types} = useGetAlltype();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };
  const activeCategories = categories?.filter(
    (category) => category.status === 'active'
  ) ?? [];

  const activeTypes = types?.filter(
    (type) => type.status === 'active'
  ) ?? [];

  // Si no hay categorías, muestra un mensaje
  if (!activeCategories || activeCategories.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', width:'100%' }}>
        <Alert severity="error"> No hay categorías disponibles</Alert>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {activeCategories.map((category: Category) => {
        // Filtramos los trámites para esta categoría una sola vez
        const categoryTypes = activeTypes.filter((t) => t.category_id === category.id);

        return (
          <Grid size={12} key={category.id}>
            <Cards>
              {/* Header de categoría */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  p: 2,
                  borderBottom: expandedCategory === category.id ? 1 : 0,
                  borderColor: 'divider',
                }}
                onClick={() => toggleCategory(category.id)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                    {categoryIcons[category.name] || <Description />}
                  </Box>
                  <Box>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                      {category.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {categoryTypes.length > 0 
                        ? `Trámites disponibles: ${categoryTypes.length}` 
                        : 'Sin trámites disponibles'}
                    </Typography>
                  </Box>
                </Box>
                <IconButton size="small">
                  {expandedCategory === category.id ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>

              {/* Lista de trámites */}
              <Collapse in={expandedCategory === category.id}>
                <Box sx={{ p: 2 }}>
                  <Stack spacing={2}>
                    {categoryTypes.length > 0 ? (
                      categoryTypes.map((type) => (
                        <Box
                          key={type.id}
                          sx={{
                            p: 2,
                            border: 1,
                            borderColor: 'divider',
                            borderRadius: 2,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              bgcolor: 'action.hover',
                              borderColor: 'primary.main',
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {type.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Trámite de {category.name}
                              </Typography>
                            </Box>
                            <Buttons
                              variant="contained"
                              size="small"
                              href={`/request/${type.id}/formRequest`}
                              sx={{ ml: 2 }}
                            >
                              Solicitar
                            </Buttons>
                          </Box>

                          <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                            {type.requirements && getAllRequirements(type.requirements).map((requeriment, index) => (
                              <Chip
                                key={index}
                                label={`📄 ${requeriment}`}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Box sx={{ py: 4, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          No hay trámites disponibles en esta categoría actualmente.
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Box>
              </Collapse>
            </Cards>
          </Grid>
        );
      })}
    </Grid>
  );
};