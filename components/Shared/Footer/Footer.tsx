import { Box, Container, Typography } from '@mui/material'
import theme from '@/app/theme'
import React from 'react'

function Footer() {
    
  return (
      <Box
        component="footer"
        sx={{
          py: 4,
          textAlign: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Admina. Todos los derechos reservados.
          </Typography>
        </Container>
      </Box>
  )
}

export default Footer