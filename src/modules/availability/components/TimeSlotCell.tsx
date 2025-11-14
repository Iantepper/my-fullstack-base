import React from 'react';
import { Button, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTimeSlotButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'available'
})<{ available: boolean }>(({ available, theme }) => ({
  minWidth: 90,
  height: 42,
  fontSize: '0.8rem',
  fontWeight: 'medium',
  borderRadius: 8,
  border: available ? 'none' : '1px solid rgba(139, 95, 191, 0.3)',
  backgroundColor: available 
    ? theme.palette.success.main 
    : 'rgba(30, 30, 50, 0.6)',
  color: available ? 'white' : '#94A3B8',
  '&:hover': {
    backgroundColor: available 
      ? theme.palette.success.dark 
      : 'rgba(139, 95, 191, 0.1)',
    transform: 'scale(1.02)',
    borderColor: available ? 'none' : 'rgba(139, 95, 191, 0.5)',
  },
  transition: 'all 0.2s ease',
}));

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
      <StyledTimeSlotButton //
        available={available} 
        variant={available ? "contained" : "outlined"}
        onClick={handleClick}
        sx={{
          minWidth: compact ? 'auto' : 90,
          width: compact ? 50 : 'auto',
          height: compact ? 36 : 42,
        }}
      >
        {compact ? 
          timeSlot.split('-')[0] : 
          timeSlot.split('-')[0]
        }
      </StyledTimeSlotButton>
    </Tooltip>
  );
};