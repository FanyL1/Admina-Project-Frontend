import { Box } from "@mui/material";

   <Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 1,
                  color: 'rgba(255,255,255,0.82)',
                }}
              >
                <AssignmentIcon fontSize="small" />
                <Typography variant="body2" sx={{ color: 'inherit', fontWeight: 600 }}>
                  Administración académica
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.25rem' } }}
              >
                Gestión de trámites
              </Typography>
            </Box>