'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Alert, Box, Button, Chip, Container, Divider, FormControl, Grid, InputLabel, Link as MuiLink, MenuItem, Paper,
  Select, Stack, TextField, Typography,} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DescriptionIcon from '@mui/icons-material/Description';
import toast from 'react-hot-toast';
import { PDFDownloadLink } from '@react-pdf/renderer';

import { useLogin } from '@/app/login/useLogin';
import { RequestDocumentData, RequestStatus, StudentRequestData, UserData } from '@/app/type';
import { getRequestById, getRequestDocuments, requestStatusOptions, updateRequestReview,} from '@/app/services/requestService';
import AppToaster from '@/components/UX/Toaster/AppToaster';
import { Copy } from '@/components/UX/Copy/handleCopy';
import { DownloadRequest } from '@/components/UX/Buttons/download';
import { useGetAllUsers } from '../../managementUser/usePage';
import { statusColor } from '@/app/theme';

const formatDate = (value?: string) => value
  ? new Date(value).toLocaleString('es-VE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
  : 'No disponible';

export default function RequestDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { sessionUser } = useLogin();
  const revisorId = sessionUser?.id;
  const [request, setRequest] = React.useState<StudentRequestData | null>(null);
  const [documents, setDocuments] = React.useState<RequestDocumentData[]>([]);
  const [status, setStatus] = React.useState<RequestStatus>('Enviado');
  const {users} = useGetAllUsers();
  const [observation, setObservation] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const canReview = sessionUser?.role?.name === 'Administrativo' || sessionUser?.role?.name === 'Superusuario';

    const searchRevisor = users.filter(
      (u) => u.id === request?.revisor_id
    )??[];

    const nameRevisor = searchRevisor && searchRevisor.length > 0
  ? `${searchRevisor[0].name} ${searchRevisor[0].lastname}`
  : 'No asignado';
  
  React.useEffect(() => {
    const loadRequest = async () => {
      try {
        setLoading(true);
        const data = await getRequestById(params.id);
        if (!data) throw new Error('Solicitud no encontrada');
        setRequest(data);
        setStatus(data.status);
        setObservation(data.observation || '');
        setDocuments(await getRequestDocuments(params.id));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudo cargar la solicitud');
      } finally {
        setLoading(false);
      }
    };

    void Promise.resolve().then(loadRequest);
  }, [params.id]);

  const handleSave = async () => {
    if (!request) return;
    const previousObservation = (request.observation || '').trim();
    const nextObservation = observation.trim();

    if (status === 'Observado' && nextObservation.length < 5) {
      toast.error('La observacion debe tener al menos 5 caracteres');
      return;
    }

    if ((status === 'Aprobado' || status === 'Rechazado') && nextObservation === previousObservation) {
      toast.error('Añadir observacion');
      return;
    }

    setSaving(true);
    try {
      const updated = await updateRequestReview(request.id, revisorId, {
        status,
        observation: nextObservation || null,
      });
      if (updated) setRequest({ ...request, ...updated });
      toast.success('Solicitud actualizada');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo guardar la solicitud');
    } finally {
      setSaving(false);
    }
  };

  const isExternal = Boolean(request?.createByname && request.createByname !== 'No Aplica');
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography>Cargando detalles de la solicitud...</Typography>
      </Box>
    );
  }

    if (error || !request) {
      return (
        <Box sx={{ p: 2 }}>
          <Alert severity="error">
            {error || 'No se pudo encontrar la información de esta solicitud.'}
          </Alert>
        </Box>
      );
    }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 8, md: 3 } }}>
      <AppToaster />
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ alignSelf: 'flex-start' }}>
            Volver
          </Button>

          {!loading && request && (
            <>
              <Paper sx={{ p: { xs: 2, md: 3 } }}>
                <Stack spacing={2}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 800 }}>
                        {request.type_procedure?.name || 'Solicitud'}
                      </Typography>
                      <Typography color="text.secondary">Creada el {formatDate(request.created_at)}</Typography>
                      <Typography color="black">N. Soliditud: <strong>{request.id}</strong> &nbsp;<Copy children text={request.id}/></Typography>
                      <Typography color="black">Revisor Asignado: <strong>{nameRevisor}</strong></Typography>

                    </Box>
                    <Box sx={{display:'flex', justifyContent:'center', alignContent:'center', alignItems:'center'}}>
                      <Chip label={request.status} sx={{color:'white', backgroundColor:statusColor(request.status), alignItems: { xs: 'flex-center', sm: 'center' } }} />
                      <PDFDownloadLink
                        document={<DownloadRequest data={request} nameRevisor={nameRevisor} />}
                        fileName={`Solicitud_${request.id}.pdf`}
                        style={{ textDecoration: 'none' }} 
                      >
                        <Button variant='outlined' sx={{ ml: '10px', height: '50px', mt: { xs: '5px' } }}>
                          Descargar Solicitud 
                        </Button>
                      </PDFDownloadLink>
                    </Box>
                  </Stack>

                  <Divider />

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography variant="subtitle2" color="text.secondary">Solicitante</Typography>
                      {isExternal ? (
                        <Box>
                          <Typography sx={{ fontWeight: 700 }}>
                            {request.createByname}
                          </Typography>
                          <Typography >
                            Cedula: {request.createByDNI || 'No disponible'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Usuario de la cuenta: {request.user?.name} {request.user?.lastname}
                          </Typography>
                        </Box>
                      ) : (
                        <Box>
                          <Typography sx={{ fontWeight: 700 }}>
                            {request.user?.name} {request.user?.lastname}
                          </Typography>
                          <Typography>
                            Cedula: {request.user?.dni || 'No disponible'}
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography variant="subtitle2" color="text.secondary">Carrera</Typography>
                      <Typography sx={{ fontWeight: 700 }}>{request.carrera?.name || request.carrera_id}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography variant="subtitle2" color="text.secondary">Ultima actualizacion</Typography>
                      <Typography sx={{ fontWeight: 700 }}>{formatDate(request.updated_at)}</Typography>
                    </Grid>
                  </Grid>
                  
                  {request.additionalData !== null && (<Box>
                    <Divider />
                    <Typography color="text.secondary" sx={{}}></Typography>
                    <Grid container spacing={3} sx={{mt:'10px'}}>
                      
                      <Grid size={{ xs: 12, md: 6}}>
                        {request.additionalData?.cohorte && request.additionalData?.cohorte !== null &&
                          <Box>
                            <Typography sx={{}}>
                              Cohorte: <strong>{request.additionalData?.cohorte} </strong>
                            </Typography>
                          </Box>
                        }
                        {request.additionalData?.conditionLiso && request.additionalData?.conditionLiso !== null &&
                          <Box>
                            <Typography sx={{}}>
                              Rendimiento: <strong>{request.additionalData?.conditionLiso == true ? 'Semestre anterior invicto (Liso)' : 'Posee materias reprobadas'}</strong>
                            </Typography>
                          </Box>
                        }
                        
                        {request.additionalData?.promedio && request.additionalData?.promedio !== 0 &&
                          <Box>
                            <Typography sx={{}}>
                              Promedio:  <strong>{request.additionalData?.promedio}</strong>
                            </Typography>
                          </Box>
                        }
                        
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        {request.additionalData?.UC && request.additionalData?.UC > 0 &&
                          <Box>
                            <Typography sx={{}}>
                              Unidades de Credito Aprobadas (UA): <strong>{request.additionalData?.UC}</strong>
                            </Typography>
                          </Box>
                        }
                        {request.additionalData?.materia && request.additionalData?.materia !== '' &&
                          <Box>
                            <Typography sx={{}}>
                              Materia:  <strong>{request.additionalData?.materia}</strong>
                            </Typography>
                          </Box>
                        }
                      </Grid>
                    </Grid>
                  </Box>)}

                </Stack>
              </Paper>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 7 }}>
                  <Paper sx={{ p: { xs: 2, md: 3 }, height: '100%' }}>
                    <Stack spacing={2}>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>Requisitos y documentos</Typography>
                      {documents.length === 0 ? (
                        <Typography color="text.secondary">No hay documentos cargados para esta solicitud.</Typography>
                      ) : documents.map((document) => (
                        <Paper key={document.id} variant="outlined" sx={{ p: 2 }}>
                          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between' }}>
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                              <DescriptionIcon color="primary" />
                              <Box>
                                <Typography sx={{ fontWeight: 700 }}>{document.name_requeriments}</Typography>
                                <Typography variant="body2" color="text.secondary">{document.name_file || 'Documento PDF'}</Typography>
                              </Box>
                            </Stack>
                            {document.router_file && (
                              <MuiLink href={`${process.env.NEXT_PUBLIC_BACKEND_URL}${document.router_file}`}
                               target="_blank" 
                               rel="noreferrer">
                                Ver documento
                              </MuiLink>
                            )}
                          </Stack>
                        </Paper>
                      ))}
                    </Stack>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 5 }}>
                  {canReview ? (<Paper sx={{ p: { xs: 2, md: 3 }, width:'100%' }}>
                    <Stack spacing={2}>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>Control de estado</Typography>
                      <FormControl fullWidth disabled={!canReview}>
                        <InputLabel>Estado</InputLabel>
                        <Select value={status} label="Estado" onChange={(event) => setStatus(event.target.value as RequestStatus)}>
                          {requestStatusOptions.map((option) => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        fullWidth
                        multiline
                        minRows={5}
                        label="Observacion"
                        value={observation}
                        onChange={(event) => setObservation(event.target.value)}
                        disabled={!canReview}
                        helperText={status === 'Observado' ? 'Minimo 5 caracteres' : 'Añadir observacion para poder cambiar el estado'}
                      />
                      {canReview ? (
                        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={saving}>
                          {saving ? 'Guardando...' : 'Guardar'}
                        </Button>
                      ) : (
                        <Alert severity="info">Solo administradores y superusuarios pueden cambiar el estado.</Alert>
                      )}
                    </Stack>
                  </Paper>):(
                  <Paper sx={{ p: { xs: 2, md: 3 } }}>
                    <Typography  variant="h6" sx={{ fontWeight: 800 }}> Observaciones </Typography>
                    {request.observation == 'Sin observaciones' && (
                      <Alert severity="info">{request.observation}</Alert>
                    )}
                    {request.observation !== 'Sin observaciones' && (
                      <Typography>{request.observation}</Typography>
                    )}
                    
                  </Paper>
                )}
                </Grid>
              </Grid>
            </>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
