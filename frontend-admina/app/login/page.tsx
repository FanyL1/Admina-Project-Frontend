// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField,  Button,  Typography,} from '@mui/material';
import {  Login as LoginIcon,} from '@mui/icons-material';
import { Form } from '../components/UX/Form/formAcces';
import { authService } from './useLogin';
import { LoginData } from './type';

const initialState: LoginData = {
    email: '',
    pass: '',
};

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<LoginData>(initialState);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!formData.email || !formData.pass) {
            setError('Por favor, completa todos los campos');
            setLoading(false);
            return;
        }

        const result = await authService.login(formData);

        if (result.success) {
            const userRole = result.user?.role?.name;
            if (userRole === 'admin' || userRole === 'Administrador') {
                router.push('/');
            } else {
                router.push('/');
            }
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <Form
            onSubmit={handleSubmit}
            title="Iniciar Sesión"
            subtitle="Ingresa tus credenciales para acceder"
            icon={<LoginIcon sx={{ fontSize: 40, color: 'white' }} />}
            loading={loading}
            error={error}
            submitText="Ingresar"
            onCloseError={() => setError(null)}
            footer={
                <>
                    <Typography variant="body2" color="text.secondary">
                        ¿No tienes una cuenta?
                    </Typography>
                    <Button
                        variant="text"
                        size="small"
                        sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            p: 0,
                            minWidth: 'auto',
                        }}
                        onClick={() => router.push('/signup')}
                    >
                        Regístrate aquí
                    </Button>
                </>
            }
        >
            <TextField
                fullWidth
                required
                name="email"
                type="email"
                label="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                sx={{ mb: 3 }}
            />

            <TextField
                fullWidth
                required
                name="pass"
                type={showPassword ? 'text' : 'password'}
                label="Contraseña"
                value={formData.pass}
                onChange={handleChange}
                disabled={loading}
                sx={{ mb: 2 }}
            />
        </Form>
    );
}