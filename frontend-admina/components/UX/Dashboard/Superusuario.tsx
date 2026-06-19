import { Box, Typography, Paper, Chip, Divider, List, ListItem, ListItemText, LinearProgress, Card, CardContent } from '@mui/material';
import { People, PersonOff, TrendingUp, TrendingDown, CheckCircle, Cancel, PieChart } from '@mui/icons-material';


import { useGetAllRequest } from '@/app/(auth)/(management)/request/useRequest';
import { useGetAllUsers } from '@/app/(auth)/(management)/managementUser/usePage';
export const SuperUserDashboard = () => {
  
  const {users}= useGetAllUsers()
  const {request}= useGetAllRequest()

  const activeUsers = users.filter(
    (userActive) => userActive.status == 'active'
  ) ?? []
  const inactiveUsers = users.filter(
    (send) => send.status == 'inactive'
  )??[]
  const sendRequest = request.filter(
    (send) => send.status == 'Enviado'
  )??[]
  const processRequest = request.filter(
    (process) => process.status == 'Revisando' || process.status == 'Pendiente' || process.status == 'Observado'
  )??[]
  const completRequest = request.filter(
    (complet) => complet.status == 'Aprobado' || complet.status == 'Rechazado'
  )??[]

  return (
    <Box sx={{ p: 1 }}>
      {/* Tarjetas de Usuarios */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            p: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            background: 'linear-gradient(135deg, #43a047 0%, #1b5e20 100%)',
            color: 'white'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 0.5 }}>
                Usuarios Activos
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {activeUsers.length}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Estudiantes: {activeUsers.filter(  (student) => student.role?.name == "Estudiante" ).length}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Administrativos: {activeUsers.filter((admin)=> admin.role?.name == 'Administrativo').length}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Super Usuarios: {activeUsers.filter((superUser)=> superUser.role?.name == 'Superusuario').length}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <People sx={{ fontSize: 48 }} />
            </Box>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            flex: 1,
            p: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            background: 'linear-gradient(135deg, #e53935 0%, #b71c1c 100%)',
            color: 'white'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 0.5 }}>
                Usuarios Inactivos
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {inactiveUsers.length}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Estudiantes: {inactiveUsers.filter((student)=> student.role?.name == 'Estudiante').length}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Administrativos: {inactiveUsers.filter((admin)=> admin.role?.name == 'Administrativo').length}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Super Usuario: {inactiveUsers.filter((superUser)=> superUser.role?.name == 'Superusuario').length}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <PersonOff sx={{ fontSize: 48 }} />
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Tasa de Éxito */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Tasa de Éxito del Sistema
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {request.length} solicitudes totoales
            </Typography>
          </Box>
          <PieChart color="primary" sx={{ fontSize: 32 }} />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>

          {/* Enviadas */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">Enviadas</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#2e3a7d' }}>
                {sendRequest.length} ({request.length > 0 ? ((sendRequest.length / request.length) * 100).toFixed(1) : 0}%)
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={request.length > 0 ? (sendRequest.length / request.length) * 100 : 0}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: '#e8f5e9',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#2e3a7d'
                }
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <CheckCircle sx={{ fontSize: 16, color: '#2e3a7d' }} />
              <Typography variant="caption" color="text.secondary">
                Solicitudes enviadas por los estudiantes
              </Typography>
            </Box>
          </Box>

          {/* En Proceso*/}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">En Proceso</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#e65100' }}>
                {processRequest.length} ({request.length > 0 ? ((processRequest.length / request.length) * 100).toFixed(1) : 0}%)
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={request.length > 0 ? (processRequest.length / request.length) * 100 : 0}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: '#fff3e0',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#e65100'
                }
              }}
            />
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Cancel sx={{ fontSize: 16, color: '#c62828' }} />
              <Typography variant="caption" color="text.secondary">
                Solicitudes en revision
              </Typography>
            </Box>
          </Box>

          {/* Completadas */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">Resueltas</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#30a73a' }}>
                {completRequest.length} ({request.length > 0 ? ((completRequest.length / request.length) * 100).toFixed(1) : 0}%)
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={request.length > 0 ? (completRequest.length / request.length) * 100 : 0}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: '#fff3e0',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#30a73a'
                }
              }}
            />
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Cancel sx={{ fontSize: 16, color: '#22802a' }} />
              <Typography variant="caption" color="text.secondary">
                Solicitudes aprovadas y rechazadas
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Resumen */}
        <Box
          sx={{
            mt: 3,
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Tasa de éxito general
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {sendRequest.length.toFixed(1)}%
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};