import { useState, useEffect } from 'react';
import { availabilityService, Availability } from '../../../services/availabilityService';

// Horarios por defecto (8:00 - 22:00 en slots de 1 hora)
export const defaultTimeSlots = [
  '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
  '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00',
  '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00',
  '20:00-21:00', '21:00-22:00'
];

// Días de la semana
export const daysOfWeek = [
  { id: '1', name: 'Lunes' },
  { id: '2', name: 'Martes' },
  { id: '3', name: 'Miércoles' },
  { id: '4', name: 'Jueves' },
  { id: '5', name: 'Viernes' },
  { id: '6', name: 'Sábado' },
  { id: '0', name: 'Domingo' }
];

export const useAvailability = () => {
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cargar disponibilidad
  const loadAvailability = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await availabilityService.getMyAvailability();
      setAvailability(data);
    } catch (err: unknown) { // ✅ CORREGIDO: unknown en lugar de any
      setError('Error al cargar la disponibilidad');
      console.error('Error loading availability:', err);
    } finally {
      setLoading(false);
    }
  };

  // Guardar disponibilidad
  const saveAvailability = async (weeklySlots: Availability['weeklySlots']) => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      const result = await availabilityService.updateAvailability({ weeklySlots });
      setAvailability(result.availability);
      setSuccess('Disponibilidad guardada exitosamente');
    } catch (err: unknown) { // ✅ CORREGIDO: unknown en lugar de any
      setError('Error al guardar la disponibilidad');
      console.error('Error saving availability:', err);
    } finally {
      setSaving(false);
    }
  };

  // Toggle de un slot individual
  const toggleTimeSlot = (dayId: string, timeSlot: string, available: boolean) => {
    if (!availability) return;

    const updatedSlots = { ...availability.weeklySlots };
    
    if (!updatedSlots[dayId]) {
      updatedSlots[dayId] = {};
    }
    
    const [start, end] = timeSlot.split('-');
    updatedSlots[dayId][timeSlot] = {
      start,
      end,
      available
    };

    setAvailability({
      ...availability,
      weeklySlots: updatedSlots
    });
  };

  // Toggle de un día completo
  const toggleDay = (dayId: string, available: boolean) => {
    if (!availability) return;

    const updatedSlots = { ...availability.weeklySlots };
    
    if (!updatedSlots[dayId]) {
      updatedSlots[dayId] = {};
    }

    defaultTimeSlots.forEach(timeSlot => {
      const [start, end] = timeSlot.split('-');
      updatedSlots[dayId][timeSlot] = {
        start,
        end,
        available
      };
    });

    setAvailability({
      ...availability,
      weeklySlots: updatedSlots
    });
  };

  // Toggle de un horario en toda la semana
  const toggleTimeSlotAllDays = (timeSlot: string, available: boolean) => {
    if (!availability) return;

    const updatedSlots = { ...availability.weeklySlots };
    const [start, end] = timeSlot.split('-');

    daysOfWeek.forEach(day => {
      if (!updatedSlots[day.id]) {
        updatedSlots[day.id] = {};
      }
      updatedSlots[day.id][timeSlot] = {
        start,
        end,
        available
      };
    });

    setAvailability({
      ...availability,
      weeklySlots: updatedSlots
    });
  };

  // Inicializar disponibilidad por defecto
  const initializeDefaultAvailability = () => {
    const defaultSlots: Availability['weeklySlots'] = {};
    
    daysOfWeek.forEach(day => {
      defaultSlots[day.id] = {};
      defaultTimeSlots.forEach(timeSlot => {
        const [start, end] = timeSlot.split('-');
        // Por defecto: Lunes a Viernes 18:00-19:00 disponibles
        const isAvailable = 
          parseInt(day.id) >= 1 && 
          parseInt(day.id) <= 5 && 
          timeSlot === '18:00-19:00';
        
        defaultSlots[day.id][timeSlot] = {
          start,
          end,
          available: isAvailable
        };
      });
    });

    setAvailability({
      _id: '',
      mentorId: '',
      timeZone: 'America/Argentina/Buenos_Aires',
      weeklySlots: defaultSlots,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  useEffect(() => {
    loadAvailability();
  }, []);

  return {
    availability,
    loading,
    saving,
    error,
    success,
    setError,
    setSuccess,
    saveAvailability,
    toggleTimeSlot,
    toggleDay,
    toggleTimeSlotAllDays,
    initializeDefaultAvailability
  };
};