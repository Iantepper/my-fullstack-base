import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Chip
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { availabilityService, Availability } from '../../../services/availabilityService';

interface SessionSchedulerProps {
  mentorId: string;
  hourlyRate: number;
  onSessionSelect: (sessionData: {
    date: string;
    duration: number;
    topic: string;
    description: string;
  }) => void;
  onCancel: () => void;
}

interface AvailableSlot {
  date: Dayjs;
  timeSlot: string;
  start: string;
  end: string;
}

export const SessionScheduler: React.FC<SessionSchedulerProps> = ({
  mentorId,
  hourlyRate,
  onSessionSelect,
  onCancel
}) => {
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [formData, setFormData] = useState({
    topic: '',
    description: ''
  });

  // Cargar disponibilidad del mentor
  useEffect(() => {
    const loadAvailability = async () => {
      try {
        setLoading(true);
        const data = await availabilityService.getMentorAvailability(mentorId);
        setAvailability(data);
      } catch (err: unknown) {
        setError('Error al cargar la disponibilidad del mentor');
        console.error('Error loading mentor availability:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAvailability();
  }, [mentorId]);

  // Obtener slots disponibles para la fecha seleccionada
  const getAvailableSlotsForDate = (date: Dayjs): AvailableSlot[] => {
    if (!availability) return [];

    const dayOfWeek = date.day().toString(); // 0: Domingo, 1: Lunes, etc.
    const daySlots = availability.weeklySlots[dayOfWeek];
    
    if (!daySlots) return [];

    const availableSlots: AvailableSlot[] = [];

    Object.entries(daySlots).forEach(([timeSlot, slotInfo]) => {
      if (slotInfo.available) {
        const [startHour, startMinute] = slotInfo.start.split(':').map(Number);
        const slotDateTime = date
          .hour(startHour)
          .minute(startMinute)
          .second(0)
          .millisecond(0);

        // Solo mostrar slots futuros
        if (slotDateTime.isAfter(dayjs())) {
          availableSlots.push({
            date: slotDateTime,
            timeSlot,
            start: slotInfo.start,
            end: slotInfo.end
          });
        }
      }
    });

    // Ordenar por hora
    return availableSlots.sort((a, b) => a.date.valueOf() - b.date.valueOf());
  };

  const handleDateSelect = (date: Dayjs | null) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot: AvailableSlot) => {
    setSelectedSlot(slot);
  };

  const handleConfirm = () => {
    if (!selectedSlot || !formData.topic) return;

    onSessionSelect({
      date: selectedSlot.date.toISOString(),
      duration: 60, // Por defecto 1 hora
      topic: formData.topic,
      description: formData.description
    });
  };

  const availableSlots = selectedDate ? getAvailableSlotsForDate(selectedDate) : [];
  const totalPrice = hourlyRate; // 1 hora por defecto

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Layout con Box en lugar de Grid */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 3 
        }}>
          {/* Calendario */}
          <Box sx={{ width: { xs: '100%', md: '50%' } }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Selecciona una fecha
              </Typography>
              <DateCalendar
                value={selectedDate}
                onChange={handleDateSelect}
                disablePast
                shouldDisableDate={(date) => {
                  const dayOfWeek = date.day().toString();
                  const daySlots = availability?.weeklySlots[dayOfWeek];
                  if (!daySlots) return true;
                  
                  const hasAvailableSlots = Object.values(daySlots).some(
                    slot => slot.available && 
                    date
                      .hour(parseInt(slot.start.split(':')[0]))
                      .minute(parseInt(slot.start.split(':')[1]))
                      .isAfter(dayjs())
                  );
                  
                  return !hasAvailableSlots;
                }}
              />
            </Paper>
          </Box>

          {/* Slots disponibles y formulario */}
          <Box sx={{ width: { xs: '100%', md: '50%' } }}>
            <Paper sx={{ p: 2 }}>
              {selectedDate ? (
                <>
                  <Typography variant="h6" gutterBottom>
                    Horarios disponibles para {selectedDate.format('DD/MM/YYYY')}
                  </Typography>

                  {availableSlots.length === 0 ? (
                    <Typography color="text.secondary">
                      No hay horarios disponibles para esta fecha
                    </Typography>
                  ) : (
                    <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
                      {availableSlots.map((slot) => (
                        <Chip
                          key={slot.timeSlot}
                          label={`${slot.start} - ${slot.end}`}
                          onClick={() => handleSlotSelect(slot)}
                          color={selectedSlot?.timeSlot === slot.timeSlot ? "primary" : "default"}
                          variant={selectedSlot?.timeSlot === slot.timeSlot ? "filled" : "outlined"}
                          clickable
                        />
                      ))}
                    </Box>
                  )}

                  {selectedSlot && (
                    <>
                      <TextField
                        fullWidth
                        label="Tema de la sesión"
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        placeholder="Ej: Aprendiendo React desde cero"
                        margin="normal"
                        required
                      />
                      
                      <TextField
                        fullWidth
                        label="Descripción (opcional)"
                        multiline
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe qué te gustaría aprender o trabajar en la sesión..."
                        margin="normal"
                      />

                      <Box mt={2} p={2} bgcolor="grey.50" borderRadius={1}>
                        <Typography variant="subtitle2" gutterBottom>
                          Resumen de la sesión:
                        </Typography>
                        <Typography variant="body2">
                          📅 {selectedSlot.date.format('DD/MM/YYYY HH:mm')}
                        </Typography>
                        <Typography variant="body2">
                          ⏱️ 60 minutos
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          💰 ${totalPrice.toFixed(2)}
                        </Typography>
                      </Box>

                      <Box display="flex" gap={1} mt={2}>
                        <Button onClick={onCancel} variant="outlined">
                          Cancelar
                        </Button>
                        <Button 
                          onClick={handleConfirm}
                          variant="contained"
                          disabled={!formData.topic}
                          fullWidth
                        >
                          Confirmar Sesión
                        </Button>
                      </Box>
                    </>
                  )}
                </>
              ) : (
                <Typography color="text.secondary">
                  Selecciona una fecha para ver los horarios disponibles
                </Typography>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};