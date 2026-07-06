'use client'
import { Box, alpha } from "@mui/material";
import { pulseSuave } from '../Animation/animationHome';
import theme from "@/app/theme";

interface CircleWithIconProps {
  imageSrc: string;
  altText?: string;
  imageSize?: number | string ;
}

export const CircleWithIcon = ({ imageSrc, altText = "icono", imageSize = '65%' }: CircleWithIconProps) => (
  <Box
    sx={{
      width: { xs: 100, sm: 150, md: 180 },
      height: { xs: 100, sm: 150, md: 180 },
      borderRadius: '50%',
      border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    }}
  >
    <Box
      sx={{
        width: { xs: 90, sm: 100, md: 120 },
        height: { xs: 90, sm: 100, md: 120 },
        borderRadius: '50%',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img 
          src={imageSrc} 
          alt={altText}
          style={{
            width: imageSize,
            height: imageSize,
            objectFit: 'contain',
          }}
        />
      </Box>
    </Box>
  </Box>
);