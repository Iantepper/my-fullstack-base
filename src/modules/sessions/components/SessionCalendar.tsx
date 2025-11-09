import React from 'react';
import { Box } from '@mui/material';
import Calendar from '../../../components/Calendar/Calendar';
import { Session } from '../../../services/sessionService';
import { CalendarSession } from '../types/session.types';
import { Dayjs } from 'dayjs';

interface SessionCalendarProps {
  sessions: Session[];
  onDateClick: (date: Dayjs, sessions: CalendarSession[]) => void; // ✅ Corregido: Dayjs en lugar de any
}

export const SessionCalendar: React.FC<SessionCalendarProps> = ({
  sessions,
  onDateClick
}) => {
  // Filtrar sesiones canceladas para el calendario
  const calendarSessions: CalendarSession[] = sessions
    .filter(session => session.status !== 'cancelled') // ← Solo esta línea nueva
    .map(s => ({
      _id: s._id,
      date: s.date,
      status: s.status,
      topic: s.topic
    }));

  return (
    <Box flex={{ md: 0.4 }}>
      <Calendar 
        sessions={calendarSessions} 
        onDateClick={onDateClick} 
      />
    </Box>
  );
};