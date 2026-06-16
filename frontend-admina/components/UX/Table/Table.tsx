// components/DataTable.tsx
import * as React from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import FormHelperText from '@mui/material/FormHelperText';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import InboxIcon from '@mui/icons-material/Inbox';
import { visuallyHidden } from '@mui/utils';
import { Order, DataTableProps } from '@/app/type';


export default function DataTable({
  data,
  columns,
  title = "Datos",
  toolbarActions,
  emptyTitle = "No hay datos registrados",
  emptyDescription = "Cuando existan registros, aparecerán listados en esta tabla.",
  emptyAction,
  loading = false,
  error = null,
  isEmpty = false,
  onRefresh,
  onEdit,
  onSaveEdit,
  onToggleStatus,
  onRolChange,
  rowActions,
  getRowId,
  filterFields,
}: DataTableProps) {

  const theme = useTheme();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<string>(columns[0]?.id || '');
  const [selected, setSelected] = React.useState<readonly (string | number)[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<any>(null);
  const [savingEdit, setSavingEdit] = React.useState(false);
  const editColumns = columns.filter(col => (
    col.editable !== false && col.id !== 'status' && col.id !== 'role'
  ));
  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
 
  const isRealError = error && 
    !error.toLowerCase().includes('exitosamente') && 
    !error.toLowerCase().includes('no hay datos');

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = filteredData.map((n) => getRowId(n));
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id: string | number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly (string | number)[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const handleEditClick = (row: any) => {
    setSelectedRow(row);
    setEditModalOpen(true);
    if (onEdit) {
      onEdit(row);
    }
  };

  const handleSaveEdit = async (updatedRow: any) => {
    if (onSaveEdit) {
      setSavingEdit(true);
      try {
        await onSaveEdit(updatedRow);
      } finally {
        setSavingEdit(false);
      }
    }
    setEditModalOpen(false);
    setSelectedRow(null);
  };

  // Filtrar datos
  const filteredData = React.useMemo(() => {
    if (!filterFields) return data;

    let filtered = [...data];

    if (filterFields.rolFilter && filterFields.rolFilter !== 'todos') {
      filtered = filtered.filter(item => item.role.name === filterFields.rolFilter);
    }

    if (filterFields.estadoFilter && filterFields.estadoFilter !== 'todos') {
      filtered = filtered.filter(item => item.status === filterFields.estadoFilter);
    }

    if (filterFields.searchTerm) {
      filtered = filtered.filter(item => {
        let matches = false;
        Object.entries(filterFields.searchFields).forEach(([field, enabled]) => {
          if (enabled && item[field] && 
              String(item[field]).toLowerCase().includes(filterFields.searchTerm.toLowerCase())) {
            matches = true;
          }
        });
        return matches;
      });
    }

    return filtered;
  }, [data, filterFields]);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredData.length) : 0;

  const visibleRows = React.useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      if (order === 'asc') {
        return aValue < bValue ? -1 : 1;
      }
      return aValue > bValue ? 1 : -1;
    });
    return sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredData, order, orderBy, page, rowsPerPage]);

  // Renderizar barra de filtros
  const renderFilterBar = () => {
    if (!filterFields) return null;

    return (
      <Box sx={{ p: 2, backgroundColor: theme.palette.grey[50], borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 2, minWidth: '200px' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar..."
              variant="outlined"
              value={filterFields.searchTerm}
              onChange={(e) => filterFields.onSearchTermChange(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: <SearchIcon sx={{ mr: 1, color: theme.palette.grey[500] }} />,
                },
              }}
            />
          </Box>
          
          {filterFields.rolOptions && (
            <Box sx={{ flex: 1, minWidth: '150px' }}>
              <FormControl fullWidth size="small">
                <InputLabel>Filtrar por Rol</InputLabel>
                <Select 
                  value={filterFields.rolFilter} 
                  label="Filtrar por Rol" 
                  onChange={(e) => filterFields.onRolFilterChange(e.target.value)}
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  {filterFields.rolOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
          
          {filterFields.estadoOptions && (
            <Box sx={{ flex: 1, minWidth: '150px' }}>
              <FormControl fullWidth size="small">
                <InputLabel>Filtrar por Estado</InputLabel>
                <Select 
                  value={filterFields.estadoFilter} 
                  label="Filtrar por Estado" 
                  onChange={(e) => filterFields.onEstadoFilterChange(e.target.value)}
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  {filterFields.estadoOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
          
          {onRefresh && (
            <Box sx={{ flex: 0.5, minWidth: '120px' }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={onRefresh}
                disabled={loading}
                startIcon={<RefreshIcon />}
                sx={{ height: '40px' }}
              >
                {loading ? 'Actualizando...' : 'Actualizar'}
              </Button>
            </Box>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Buscar por:
          </Typography>
          {Object.entries(filterFields.searchFields).map(([field, enabled]) => (
            <FormControlLabel
              key={field}
              control={
                <Checkbox
                  checked={enabled}
                  onChange={() => filterFields.onSearchFieldsChange({
                    ...filterFields.searchFields,
                    [field]: !enabled
                  })}
                  size="small"
                />
              }
              label={filterFields.searchLabels?.[field] || field.charAt(0).toUpperCase() + field.slice(1)}
            />
          ))}
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
            <strong>Total de registros:</strong>  {filteredData.length}
          </Typography>
        </Box>
      </Box>
    );
  };

  // Modal de edición
  const renderEditModal = () => {
    if (!selectedRow) return null;

    return (
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>
          Editar {title}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {editColumns.map((column) => {
              if (column.editOptions) {
                return (
                  <FormControl key={column.id} fullWidth>
                    <InputLabel>{column.label}</InputLabel>
                    <Select
                      label={column.label}
                      value={selectedRow[column.id] || ''}
                      onChange={(e) => setSelectedRow({ ...selectedRow, [column.id]: e.target.value })}
                    >
                      {column.editOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                      ))}
                    </Select>
                    {column.editOptions.length === 0 && (
                      <FormHelperText>No hay opciones disponibles</FormHelperText>
                    )}
                  </FormControl>
                );
              }

              return (
                <TextField
                  key={column.id}
                  fullWidth
                  label={column.label}
                  value={selectedRow[column.id] || ''}
                  onChange={(e) => setSelectedRow({ ...selectedRow, [column.id]: e.target.value })}
                />
              );
            })}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)} variant="outlined" color="error" disabled={savingEdit}>
            Cancelar
          </Button>
          <Button onClick={() => handleSaveEdit(selectedRow)} variant="contained" color="primary" disabled={savingEdit}>
            {savingEdit ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  if (loading && data.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isRealError) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" gutterBottom>
          Error: {error}
        </Typography>
        {onRefresh && (
          <Button variant="contained" onClick={onRefresh} startIcon={<RefreshIcon />}>
            Reintentar
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Paper sx={{ width: '100%', mb: 2, overflow: 'hidden', borderRadius: 3, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)' }}>
        <Toolbar sx={{ backgroundColor: theme.palette.primary.dark, color: theme.palette.primary.contrastText, gap: 2 }}>
          <Typography variant="h6" component="div" sx={{ flex: '1 1 100%' }}>
            {selected.length > 0 ? `${selected.length} seleccionado(s)` : title}
          </Typography>
          {toolbarActions}
        </Toolbar>
        
        {renderFilterBar()}
        
        <TableContainer>
          <Table size={dense ? 'small' : 'medium'}>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.primary.light }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < filteredData.length}
                    checked={filteredData.length > 0 && selected.length === filteredData.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.numeric ? 'right' : 'left'}
                    sortDirection={orderBy === column.id ? order : false}
                    sx={{ fontWeight: 'bold', color: theme.palette.primary.contrastText }}
                  >
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                      sx={{ color: theme.palette.primary.contrastText }}
                    >
                      {column.label}
                      {orderBy === column.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell align="center" sx={{ fontWeight: 'bold', color: theme.palette.primary.contrastText }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell 
                    align="center" 
                    colSpan={columns.length + 2}
                    sx={{ py: 7 }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5, maxWidth: 420, mx: 'auto' }}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 2,
                          bgcolor: 'secondary.main',
                          color: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <InboxIcon />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {emptyTitle}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {emptyDescription}
                      </Typography>
                      {emptyAction && <Box sx={{ mt: 1 }}>{emptyAction}</Box>}
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {visibleRows.map((row) => {
                    const rowId = getRowId(row);
                    const isItemSelected = selected.includes(rowId);

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={rowId}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            onClick={() => handleClick(rowId)}
                          />
                        </TableCell>
                        {columns.map((column) => (
                          <TableCell key={column.id}>
                            {column.render ? column.render(row[column.id], row) : row[column.id]}
                          </TableCell>
                        ))}
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {onEdit && (
                              <Tooltip title="Editar">
                                <IconButton onClick={() => handleEditClick(row)} size="small" sx={{ color: theme.palette.info.main }}>
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            {onToggleStatus && (
                              <Tooltip title={row.status === 'active' ? 'Inactivar' : 'Activar'}>
                                <IconButton onClick={() => onToggleStatus(row)} size="small">
                                  {row.status === 'active' ? 
                                    <BlockIcon sx={{ color: theme.palette.error.main }} /> : 
                                    <CheckCircleIcon sx={{ color: theme.palette.success.main }} />
                                  }
                                </IconButton>
                              </Tooltip>
                            )}
                            {onRolChange && (
                              <FormControl size="small" sx={{ minWidth: 140 }}>
                                <Select
                                  value={row.role?.name || ''}
                                  onChange={(e) => onRolChange(row, e.target.value)}
                                  size="small"
                                >
                                  <MenuItem value="Estudiante">Estudiante</MenuItem>
                                  <MenuItem value="Administrativo">Administrativo</MenuItem>
                                  <MenuItem value="Superusuario">Super Usuarios</MenuItem>
                                </Select>
                              </FormControl>
                            )}
                            {rowActions && rowActions(row)}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                      <TableCell colSpan={columns.length + 2} />
                    </TableRow>
                  )}
                </>
              )}
              
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Compacto"
      />
      {renderEditModal()}
    </Box>
  );
}
