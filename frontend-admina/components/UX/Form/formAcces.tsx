'use client';
import { ReactNode } from 'react';
import { Box, Paper, Typography, Alert, CircularProgress, Button,} from '@mui/material';

interface FormProps {
    onSubmit: (e: React.FormEvent) => void;
    title: string;
    subtitle?: string;
    icon?: ReactNode;
    children: ReactNode;
    loading?: boolean;
    error?: string | null;
    submitText: string;
    footer?: ReactNode;
    onCloseError?: () => void;
}

export const Form = ({
    onSubmit,
    title,
    subtitle,
    icon,
    children,
    loading = false,
    error = null,
    submitText,
    footer,
    onCloseError,
}: FormProps) => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4,
                px: 2,
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: { xs: 3, sm: 5 },
                    width: '100%',
                    maxWidth: 500,
                    borderRadius: 2,
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mb: 4,
                    }}
                >
                    {icon && (
                        <Box
                            sx={{
                                bgcolor: 'primary.main',
                                borderRadius: '50%',
                                p: 1.5,
                                mb: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {icon}
                        </Box>
                    )}
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{
                            fontWeight: 600,
                            color: 'text.primary',
                            textAlign: 'center',
                        }}
                    >
                        {title}
                    </Typography>
                    {subtitle && (
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'text.secondary',
                                mt: 1,
                                textAlign: 'center',
                            }}
                        >
                            {subtitle}
                        </Typography>
                    )}
                </Box>

                {/* Error Alert */}
                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3, borderRadius: 2 }}
                        onClose={onCloseError}
                    >
                        {error}
                    </Alert>
                )}

                {/* Form */}
                <Box component="form" onSubmit={onSubmit} noValidate>
                    {children}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={loading}
                        sx={{
                            py: 1.5,
                            mb: footer ? 2 : 0,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '1rem',
                            fontWeight: 600,
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : submitText}
                    </Button>

                    {footer && (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: 0.5,
                            }}
                        >
                            {footer}
                        </Box>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};