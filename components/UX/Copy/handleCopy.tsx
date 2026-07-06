import { useState } from 'react';
import { Box } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface CopyProps {
  children: React.ReactNode;
  text: string;
}

export const Copy = ({ children, text }: CopyProps) => {
  const [copiado, setCopiado] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <Box component="span" onClick={handleCopy} sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
      {children}
      {copiado ? (
        <CheckCircleIcon sx={{ color: 'green', fontSize: '1rem' }} />
      ) : (
        <ContentCopyIcon sx={{ fontSize: '1rem' }} />
      )}
    </Box>
  );
};
