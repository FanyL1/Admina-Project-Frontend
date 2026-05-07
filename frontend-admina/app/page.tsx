'use client';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import {
  Code,
  LibraryBooks,
  ChevronRight,
  AutoAwesome,
  Terminal,
} from '@mui/icons-material';

export default function Home() {
  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh' }}>

      {/* Header */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 6, alignItems: 'center' }}>
          
          {/* Left Column */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ mb: 3 }}>
              <Typography
                sx={{
                  fontSize: { xs: 32, md: 44 },
                  fontWeight: 700,
                  color: '#0A141A',
                  mb: 2,
                }}
              >
                Integrated
                <Box component="span" sx={{ color: '#377495' }}>
                  {' '}
                  Communications
                </Box>
              </Typography>
              <Typography
                sx={{
                  fontSize: 16,
                  color: '#0A141A',
                  lineHeight: 1.6,
                  maxWidth: 500,
                }}
              >
                Better communications is easy to realise with our robust
                communications API that was built by developers for developers.
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              size="large"
              sx={{
                bgcolor: '#377495',
                color: '#FFFFFF',
                textTransform: 'none',
                '&:hover': { bgcolor: '#295770' },
                '&:active': { bgcolor: '#1C3A4A' }
              }}
            >
              REQUEST A DEMO
            </Button>
          </Box>

          {/* Right Column */}
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                bgcolor: '#DAE9F1',
                borderRadius: 4,
                p: 4,
                textAlign: 'center',
              }}
            >
              <AutoAwesome sx={{ fontSize: 48, color: '#377495', mb: 2 }} />
              <Typography sx={{ fontSize: 18, fontWeight: 600, color: '#0A141A', mb: 2 }}>
                Developer First
              </Typography>
              <Typography sx={{ fontSize: 12, color: '#0A141A' }}>
                Built by developers, for developers
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Quick Start Section */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Card
          sx={{
            bgcolor: '#DAE9F1',
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Terminal sx={{ color: '#377495', fontSize: 28 }} />
              <Typography sx={{ fontSize: 20, fontWeight: 600, color: '#0A141A' }}>
                Quick Start
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 14, color: '#0A141A', mb: 3 }}>
              Getting started is easy with our straight forward documentation.
            </Typography>
            <Button
              variant="outlined"
              endIcon={<ChevronRight />}
              sx={{
                borderColor: '#377495',
                color: '#377495',
                backgroundColor: '#FFFFFF',
                textTransform: 'none',
                '&:hover': { 
                  bgcolor: '#ECF4F8',
                  borderColor: '#377495'
                },
                '&:active': { 
                  bgcolor: '#8FBDD6'
                }
              }}
            >
              Learn more →
            </Button>
          </CardContent>
        </Card>
      </Container>

      {/* REST API and Client Libraries Section */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* REST API Card */}
          <Box sx={{ flex: 1 }}>
            <Card sx={{ height: '100%', borderRadius: 4 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Code sx={{ color: '#377495', fontSize: 28 }} />
                  <Typography sx={{ fontSize: 20, fontWeight: 600, color: '#0A141A' }}>
                    REST API Documentation
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 14, color: '#0A141A', mb: 3 }}>
                  Use the REST API for programmatic access to our communications
                  tools. Configure your existing number structure, browse available
                  numbers and acquire them with a few authenticated requests.
                </Typography>
                <Button
                  variant="outlined"
                  endIcon={<ChevronRight />}
                  sx={{
                    borderColor: '#377495',
                    color: '#377495',
                    backgroundColor: '#FFFFFF',
                    textTransform: 'none',
                    '&:hover': { 
                      bgcolor: '#ECF4F8',
                      borderColor: '#377495'
                    },
                    '&:active': { 
                      bgcolor: '#8FBDD6'
                    }
                  }}
                >
                  Learn more →
                </Button>
              </CardContent>
            </Card>
          </Box>

          {/* Client Libraries Card */}
          <Box sx={{ flex: 1 }}>
            <Card sx={{ height: '100%', borderRadius: 4 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <LibraryBooks sx={{ color: '#377495', fontSize: 28 }} />
                  <Typography sx={{ fontSize: 20, fontWeight: 600, color: '#0A141A' }}>
                    Client Libraries
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 14, color: '#0A141A', mb: 3 }}>
                  Use our client libraries to accelerate and simplify integrations
                  with your existing project or software. They are available in a
                  variety of languages.
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: '#377495',
                    color: '#377495',
                    backgroundColor: '#FFFFFF',
                    textTransform: 'none',
                    '&:hover': { 
                      bgcolor: '#ECF4F8',
                      borderColor: '#377495'
                    },
                    '&:active': { 
                      bgcolor: '#8FBDD6'
                    }
                  }}
                >
                  Question? Send us a message.
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>

      {/* Footer Section */}
      <Box
        sx={{
          mt: 6,
          py: 4,
          bgcolor: '#DAE9F1',
          borderRadius: '32px 32px 0 0',
          mx: { xs: 2, md: 4 },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}>
            <Typography sx={{ fontSize: 12, color: '#0A141A' }}>
              © 2024 Admina. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Typography sx={{ fontSize: 12, color: '#377495', cursor: 'pointer' }}>
                Privacy
              </Typography>
              <Typography sx={{ fontSize: 12, color: '#377495', cursor: 'pointer' }}>
                Terms
              </Typography>
              <Typography sx={{ fontSize: 12, color: '#377495', cursor: 'pointer' }}>
                Contact
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}