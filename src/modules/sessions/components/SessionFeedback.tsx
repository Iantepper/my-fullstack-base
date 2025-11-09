import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField
} from '@mui/material';
import { Session } from '../../../services/sessionService';
import RatingStars from '../../../components/RatingStars';

interface SessionFeedbackProps {
  open: boolean;
  session: Session | null;
  rating: number;
  comment: string;
  loading: boolean;
  onRatingChange: (rating: number) => void;
  onCommentChange: (comment: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export const SessionFeedback: React.FC<SessionFeedbackProps> = ({
  open,
  session,
  rating,
  comment,
  loading,
  onRatingChange,
  onCommentChange,
  onSubmit,
  onClose
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Calificar Sesión</DialogTitle>
      <DialogContent>
        {session && (
          <Box display="flex" flexDirection="column" gap={3} mt={2}>
            <Typography variant="h6" gutterBottom>
              ¿Cómo calificarías tu sesión con {session.mentorId.userId.name}?
            </Typography>
            
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Calificación:
              </Typography>
              <RatingStars
                rating={rating}
                onRatingChange={onRatingChange}
                size="large"
              />
            </Box>
            
            <TextField
              label="Comentario (opcional)"
              multiline
              rows={4}
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
              placeholder="Comparte tu experiencia, qué aprendiste, cómo fue la sesión..."
              fullWidth
            />
            
            <Typography variant="body2" color="text.secondary">
              Tema: {session.topic}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          onClick={onSubmit}
          variant="contained"
          disabled={loading || rating === 0}
        >
          {loading ? 'Enviando...' : 'Enviar Calificación'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};