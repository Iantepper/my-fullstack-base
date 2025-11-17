import React from 'react';
import { Button, Tooltip } from '@mui/material';

interface TimeSlotCellProps {
  timeSlot: string;
  available: boolean;
  onToggle: (available: boolean) => void;
  compact?: boolean;
}

export const TimeSlotCell: React.FC<TimeSlotCellProps> = ({
  timeSlot,
  available,
  onToggle,
  compact = false
}) => {
  const handleClick = () => {
    onToggle(!available);
  };

  return (
    <Tooltip title={available ? "Disponible - Click para desactivar" : "No disponible - Click para activar"}>
      <Button
        variant={available ? "contained" : "outlined"}
        color={available ? "success" : "inherit"}
        onClick={handleClick}
        sx={{
          minWidth: compact ? 'auto' : 90,
          width: compact ? 50 : 'auto',
          height: compact ? 36 : 42,
          p: compact ? 0.5 : 1,
          fontSize: compact ? '0.7rem' : '0.8rem',
          fontWeight: 'medium',
          borderRadius: 1,
          border: available ? 'none' : '1px solid rgba(139, 95, 191, 0.3)',
          backgroundColor: available ? 'success.main' : 'rgba(30, 30, 50, 0.6)',
          color: available ? 'white' : '#94A3B8',
          '&:hover': {
            backgroundColor: available ? 'success.dark' : 'rgba(139, 95, 191, 0.1)',
            transform: 'scale(1.02)',
            borderColor: available ? 'transparent' : 'rgba(139, 95, 191, 0.5)',
          },
          transition: 'all 0.2s ease',
        }}
      >
        {compact ? 
          timeSlot.split('-')[0] : 
          timeSlot.split('-')[0]
        }
      </Button>
    </Tooltip>
  );
};