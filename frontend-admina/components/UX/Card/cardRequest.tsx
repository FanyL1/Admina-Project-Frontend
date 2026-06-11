'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Stack,
  IconButton,
  Collapse,
  Grid,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  School,
  Work,
  AccountBalance,
  HealthAndSafety,
  Home,
  Description,
} from '@mui/icons-material';
import { Cards } from '@/components/UX/Card/card';
import { Buttons } from '@/components/UX/Buttons/buttons';
import { useGetAllCategory } from '@/app/(auth)/(management)/managementCategory/useCategory';
import { useGetAlltype } from '@/app/(auth)/(management)/managementRequest/useGetType';

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

const typeProcedure =[
  {
        id: 'certificado-estudios',
        name: 'Certificado de Estudios',
        category: 'Solicitud de certificado de estudios cursados',
        requirements: ['DNI', 'Constancia de alumno regular', 'Pago de arancel'],
      },
      {
        id: 'titulo-universitario',
        name: 'Título Universitario',
        category: 'Trámite de título profesional universitario',
        requirements: ['DNI', 'Certificado de estudios completos', 'Fotos carnet'],
      },
      {
        id: 'beca-estudio',
        name: 'Solicitud de Beca',
        category: 'Postulación a becas de estudio',
        requirements: ['DNI', 'Certificado de notas', 'Carta de motivación'],
      },
]
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

interface TramitesSelectorProps {
  onSelectTramite?: (tramite: Type) => void;
}

export const CardRequest = () => {
  const { categories } = useGetAllCategory();
  const {types} = useGetAlltype();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleSelectype = (id: string) => {
    console.log(id)
  };

  // Si no hay categorías, muestra un mensaje
  if (!categories || categories.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No hay categorías disponibles
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {categories.map((category: Category) => (
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
                    Trámites disponibles en esta categoría
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
                  {/* Aquí mapeas los tipos (trámites) */}
                  {types.map((type) => (
                    <>
                    { category.id == type.category_id && <Box
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
                            {/* Si tienes descripción, agrega aquí */}
                            Trámite de {category.name}
                          </Typography>
                        </Box>
                        <Buttons
                          variant="contained"
                          size="small"
                          onClick={() => handleSelectype(type.id)}
                          sx={{ ml: 2 }}
                        >
                          Solicitar
                        </Buttons>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={`📄 ${type.requirements}`}
                          size="small"
                          variant="outlined"
                        />
                        {/* Agrega más chips según los datos que tengas */}
                      </Box>
                    </Box>}
                    </>
                  ))}
                </Stack>
              </Box>
            </Collapse>
          </Cards>
        </Grid>
      ))}
    </Grid>
  );
};