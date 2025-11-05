import { useState } from 'react';
import { Typography, Paper } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';

interface CalendarSession {
  _id: string;
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  topic: string;
}

interface CalendarProps {
  sessions: CalendarSession[];
  onDateClick: (date: Dayjs, sessions: CalendarSession[]) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return '#ffb74d';
    case 'confirmed': return '#66bb6a';  
    case 'completed': return '#42a5f5';
    case 'cancelled': return '#f44336';
    default: return '#9e9e9e';
  }
};

const getStatusBackground = (status: string) => {
  switch (status) {
    case 'pending': return 'rgba(255, 183, 77, 0.2)';
    case 'confirmed': return 'rgba(102, 187, 106, 0.2)';
    case 'completed': return 'rgba(66, 165, 245, 0.2)';
    case 'cancelled': return 'rgba(244, 67, 54, 0.2)';
    default: return 'transparent';
  }
};

export default function Calendar({ sessions, onDateClick }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      const dateSessions = getSessionsForDate(date);
      onDateClick(date, dateSessions);
    }
  };

  const getSessionsForDate = (date: Dayjs) => {
    return sessions.filter(session => 
      dayjs(session.date).isSame(date, 'day')
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper sx={{ 
        p: 3,
        width: '100%',
        maxWidth: 500,
        mx: 'auto',
        background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
        border: '1px solid rgba(139, 95, 191, 0.2)'
      }}>
        <Typography 
          variant="h4"
          align="center" 
          gutterBottom 
          sx={{ 
            color: 'primary.main',
            fontWeight: 'bold',
            mb: 3
          }}
        >
          {currentMonth.format('MMMM YYYY')}
        </Typography>
        
        <DateCalendar
          value={null}
          onChange={handleDateChange}
          referenceDate={currentMonth}
          onMonthChange={(newMonth) => setCurrentMonth(newMonth)}
          slots={{
            day: (props) => {
              const { day, ...other } = props;
              const dateSessions = getSessionsForDate(day);
              const hasSessions = dateSessions.length > 0;
              const mainSession = hasSessions ? dateSessions[0] : null;

              return (
                <PickersDay
                  {...other}
                  day={day}
                  sx={{
                    backgroundColor: hasSessions 
                      ? getStatusBackground(mainSession!.status)
                      : 'transparent',
                    border: hasSessions 
                      ? `2px solid ${getStatusColor(mainSession!.status)}`
                      : '1px solid transparent',
                    color: hasSessions ? getStatusColor(mainSession!.status) : 'text.primary',
                    fontWeight: hasSessions ? 'bold' : 'normal',
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: hasSessions 
                        ? getStatusBackground(mainSession!.status)
                        : 'rgba(139, 95, 191, 0.1)',
                    }
                  }}
                />
              );
            }
          }}
        />
      </Paper>
    </LocalizationProvider>
  );
}