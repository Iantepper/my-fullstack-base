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
    <Tooltip title={available ? "Disponible - Click para marcar como no disponible" : "No disponible - Click para marcar como disponible"}>
      <Button
        variant={available ? "contained" : "outlined"}
        color={available ? "success" : "inherit"}
        onClick={handleClick}
        sx={{
          minWidth: compact ? 'auto' : 100,
          width: compact ? 60 : 'auto',
          height: compact ? 40 : 48,
          p: compact ? 0.5 : 1,
          fontSize: compact ? '0.75rem' : '0.875rem',
          fontWeight: 'bold',
          borderRadius: 1,
          border: available ? 'none' : '1px solid',
          borderColor: 'grey.300',
          bgcolor: available ? 'success.main' : 'grey.100',
          color: available ? 'white' : 'text.secondary',
          '&:hover': {
            bgcolor: available ? 'success.dark' : 'grey.200',
            transform: 'scale(1.05)',
          },
          transition: 'all 0.2s ease'
        }}
      >
        {compact ? timeSlot.split('-')[0] : timeSlot.replace('-', ' - ')}
      </Button>
    </Tooltip>
  );
};