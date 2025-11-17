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
  onClick={handleClick}
  variant={available ? "gradient" : "outlined"}
  sx={{
    minWidth: compact ? 'auto' : 90,
    width: compact ? 50 : 'auto',
    height: compact ? 36 : 42,
    p: compact ? 0.5 : 1,
    fontSize: compact ? '0.7rem' : '0.8rem',
    fontWeight: 'medium',
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