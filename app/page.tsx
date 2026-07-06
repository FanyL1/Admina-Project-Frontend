'use client';
import { useRef, useEffect, useState } from 'react';
import { Box, Container, Grid, Card, CardContent, Typography, alpha, useMediaQuery, CardMedia } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import SchoolIcon from '@mui/icons-material/School';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import EmailIcon from '@mui/icons-material/Email';

import { Navbar } from '../components/Shared/Navbar/navbar';
import { Hero } from '../components/UX/Header/header';
import { Buttons } from '../components/UX/Buttons/buttons';
import { fadeInLeft, fadeInRight, pulseSuave} from '../components/UX/Animation/animationHome';
import { floatSuave } from '../components/UX/Animation/animation404';
import { Copy } from '../components/UX/Copy/handleCopy';
import Image from 'next/image';
import theme from './theme';
import {CircleWithIcon} from '@/components/UX/Circle/circleHome'



export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);  
  const sectionRef = useRef<HTMLDivElement>(null);
  const homeRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  useEffect(() => {
    if (homeRef.current) homeRef.current.id = 'home';
    if (servicesRef.current) servicesRef.current.id = 'services';
    if (aboutRef.current) aboutRef.current.id = 'about';
    if (contactRef.current) contactRef.current.id = 'contact';
  }, []);

   useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <DescriptionIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'Gestión de Procesos Administrativos',
      description: 'Realiza y gestiona procesos administrativos como tratamientos especiales, cartas especiales, entre otros',
    },
    {
      icon: <TrackChangesIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'Auditoría de Datos',
      description: 'Seguimiento de cada accicon realizada en el sistema, con registros detallados para garantizar la transparencia de datos',
    },
    {
      icon: <EqualizerIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />,
      title: 'Avanzada y Dashboards Estadísticos',
      description: 'Los datos son procesados para generar paneles visuales y reportes estadísticos detallados.',
    },
  ];

  const creditos = [
    {
      Image:'/C1.svg',
      title: 'Franny Luis',
      description: 'Project Manager & Desarrollador Backend y Frontend',
    },
    {
      Image:'/C2.svg',
      title: 'Elvis Jimenez',
      description: 'Desarrollador Backend',
    },
    {
      Image:'/C3.svg',
      title: 'Estefani Medina',
      description: 'Desarrollador Frontend',
    },
    {
      Image:'/C1.svg',
      title: 'Carlos Lopez',
      description: 'QA Tester',
    },
    {
      Image:'/C2.svg',
      title: 'Oscar Agudo',
      description: 'QA Tester',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar onNavClick={scrollToSection} />

      {/* Sección del Header */}
      <div ref={homeRef}>
      <Hero />
      </div>

      {/* Sección de características */}
      <Box ref={servicesRef} sx={{ py: { xs: 2, sm: 6, md: 4 }}}>
        <Container sx={{  py: { xs: 8, sm: 10, md: 12 }, }}>
          <Box
            sx={{ width: 80, height: 4,
              background: `linear-gradient(90deg,${theme.palette.text.primary}, ${theme.palette.primary.main})`,
              mb: 3, borderRadius: 2,
            }}
          />
          <Typography
            variant="h3"
            sx={{
              mb: { xs: 4, md: 6 },
              fontSize: { xs: '2rem', sm: '2.5rem', md: '2.5rem' },
              fontWeight: 800,
              background: `linear-gradient(90deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Servicios
          </Typography>
          
          <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
            {features.map((feature, index) => (
              <Grid sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', sm: '50%', md: '32%' } }} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 'inherit',
                      padding: '2px',
                      background: 'linear-gradient(90deg, #32539A, #B2C2E6, #B2C2E6)',
                      backgroundSize: '300% 100%',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                      opacity: 0,
                      transition: 'opacity 0.3s',
                      animation: 'borderMove 2s linear infinite',
                    },
                    '&:hover::before': {
                      opacity: 1,
                    },
                    
                  }}
                >
                  <CardContent>
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* Acerca de*/}
     <Box ref={aboutRef}
      sx={{
        py: { xs: 8, sm: 10, md: 12 },
        background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${alpha(theme.palette.secondary.main, 0.3)} 50%, ${theme.palette.secondary.main} 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Círculos decorativos de fondo - TRANSPARENTES */}
      <Box
        sx={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          border: `2px solid ${theme.palette.primary.main}`,
          opacity: 0.1,
          top: '-250px',
          left: '-200px',
        }}
      />
      {!isMobile && (<Box
        sx={{
          position: 'absolute',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          border: `2px solid ${theme.palette.primary.main}`,
          bottom: '-150px',
          opacity: 0.1,
          right: '-100px',
        }}
      />)}
      

      <Container maxWidth="lg">
        {/*AREA DE TEXTO E ICONOS*/}
        <Grid sx={{ display: 'flex', alignItems: 'center', gap:{md:10}, [theme.breakpoints.between(900, 1000)]: {gap:4} }} container>
          {/*AREA DE TEXTO */}
          <Grid sx={{ width: { xs: '100%', sm: '100%', md: '50%' } }}>
            <Box
              sx={{
                animation: isVisible ? `${fadeInLeft} 0.8s ease-out` : 'none',
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 4,
                  background: `linear-gradient(90deg,${theme.palette.text.primary}, ${theme.palette.primary.main})`,
                  mb: 3,
                  borderRadius: 2,
                }}
              />

              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '2.5rem' },
                  fontWeight: 800,
                  mb: 2,
                  background: `linear-gradient(90deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Acerca de Nosotros
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.primary,
                  lineHeight: 1.8,
                  mb: 3,
                  fontSize: '1rem',
                  textAlign: 'justify',
                }}
              >
                <strong style={{ color: theme.palette.primary.main }}>Admina</strong>  es una herramineta desarrollada en el <strong style={{ color: theme.palette.primary.main }}>Area de Ingenieria de Sistemas</strong>, 
                de la Universidada Nacional Experimental Romulo Gallegos, unimos la experiencia y tecnología para ofrecer una solucion integral para la gestión de procesos academicos en el area de estudio.
              </Typography>

              <Typography
                variant="h2"
                sx={{
                  color: theme.palette.text.primary,
                  lineHeight: 1.8,
                  mb: 1,
                  fontSize: "1.2rem",
                  textAlign: 'justify',
                }}
              ><strong> De estudiantes para estudiantes.</strong>
                
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.primary,
                  lineHeight: 1.8,
                  fontSize: '1rem',
                  textAlign: 'justify',
                }}
              >
                Nuestro equipo está conformado por estudiantes de la carrera de Ingenieria en Informática apasionados por la tecnología 
                y la excelencia, dedicados a crear soluciones que realmente marquen la diferencia.
              </Typography>

              <Typography
                variant="h2"
                sx={{
                  color: theme.palette.text.primary,
                  lineHeight: 1.8,
                  mt: 3,
                  fontSize: "1.2rem",
                  textAlign: 'justify',
                }}>
                <strong> Colaboradores.</strong>        
              </Typography>
            </Box>
          </Grid>


          {/* ÁREA DE ANIMACIÓN */}
          {!isMobile && (
            <Grid container sx={{ width: 'auto', justifyContent: 'center', alignItems: 'center' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: { sm: 2 },
                }}
              >
                {/* Círculo superior */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    animation: isVisible ? `${fadeInRight} 0.6s ease-out` : 'none',
                  }}
                >
                  <CircleWithIcon imageSrc="/Log-unerg.svg" imageSize="180%" altText="Icono superior"  />
                </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      width: '250px',
                      height: '250px',
                      opacity: 0.1,
                      borderRadius: '50%',
                      border: `2px solid ${theme.palette.primary.main}`,
                      top: '30%',
                      left: '10%',
                    }}
                  />
                {/* Dos círculos inferiores */}
                <Box
                  sx={{
                    display: 'flex',
                    gap: { xs: 2, sm: 4 },
                    justifyContent: 'center',
                  }}
                >
                  <Box sx={{ animation: isVisible ? `${fadeInRight} 0.6s ease-out 0.1s` : 'none' }}>
                    <CircleWithIcon imageSrc="/Log-AIS-transp.svg" imageSize="75%" altText="Icono izquierdo" />
                  </Box>
                  <Box sx={{ animation: isVisible ? `${fadeInRight} 0.6s ease-out 0.2s` : 'none' }}>
                    <CircleWithIcon imageSrc="/Log-A.svg" imageSize="72%" altText="Icono derecho"  />
                  </Box>
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>

        {/*AREA DE CREDITOS */}
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center', mt:3 }}>
          {creditos.map((person, index) => (
              <Grid sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', sm: '50%', md: '32%' } }} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)',
                    }
                  }}
                >
                  <CardContent sx={{display:'flex',justifyContent:'center', alignContent:"center", flexDirection:'column'}}>
                    <CardMedia
                      component="img"
                      height="100"
                      width='100'
                      sx={{borderRadius:'50%', objectFit:'contain'}}
                      image={person.Image}
                      alt="Paella dish"
                    />
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {person.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {person.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}     
        </Grid>
      </Container>
     </Box>

       {/* Seccion de Contactos */}
      <Box   ref={contactRef} sx={{ py: { xs: 2, sm: 6, md: 12}, }}
      >
        <Box sx={{  mx: { xs: 2, sm: 3, md: 12 }}}>
          <Box
            sx={{ width: 80, height: 4,
              background: `linear-gradient(90deg,${theme.palette.text.primary}, ${theme.palette.primary.main})`,
                mb: 3, borderRadius: 2,
            }}
          />
          <Typography
            variant="h3"
            sx={{
              mb: { xs: 4, md: 6 },
              fontSize: { xs: '2rem', sm: '2.5rem', md: '2.5rem' },
              fontWeight: 800,
              background: `linear-gradient(90deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Contacto
          </Typography>
        </Box>
        <Container maxWidth="sm">
          <Box
           sx={{
              position: 'relative',
              textAlign: 'center',
              p: {xs: 2, sm: 4, md: 6},
              borderRadius: 4,
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)',
              },    
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                borderRadius: 'inherit',
                padding: '2px',
                background: 'linear-gradient(90deg, #32539A, #B2C2E6, #B2C2E6)',
                backgroundSize: '300% 100%',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                opacity: 0,
                transition: 'opacity 0.3s',
                animation: 'borderMove 2s linear infinite',
                pointerEvents: 'none', 
              },
              '&:hover::before': {
                opacity: 1,
              },
                    
            }}
          >
            {/* Ícono animado */}
            <Box
              sx={{
                display: 'inline-flex',
                mb: 2,
                p: 2,
                borderRadius: '50%',
                bgcolor: '#D8E1F3',
                animation: `${floatSuave} 3s ease-in-out infinite`,
              }}
            >
              <SupportAgentIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />
            </Box>

            <Typography variant="h4" sx={{ fontSize: { xs: '1.125rem', sm: '1.5rem', md: '2rem' }, fontWeight: 700, mb: 1, color: theme.palette.primary.main }}>
              Soporte Técnico
            </Typography>

            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
              Estamos aquí para ayudarte
            </Typography>

            {isMobile &&  (<Buttons
              sx={{
                p: {xs: 1, md: 1},
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onClick={() => window.location.href = 'mailto:soporteTecnicoAdmina@gmail.com'}
            >
             <EmailIcon sx={{ fontSize: 20, mr:'5px' }} />
              <Typography variant="body1" sx={{ fontSize: {xs: '0.875rem', sm: '1rem', md: '1.25rem'} ,color:'white', fontWeight: 600 }}>
                soporteAdmina@gmail.com
              </Typography>
            </Buttons>)}
            {!isMobile && (<Copy text="soporteAdmina@gmail.com">
                <Typography variant="body1" sx={{ fontSize: {xs: '0.875rem', sm: '1rem', md: '1.25rem'} ,fontWeight: 600 }}>
                  soporteAdmina@gmail.com
                </Typography>
            </Copy>)}
          </Box>
        </Container>
      </Box>
     
    </Box>
  );
}