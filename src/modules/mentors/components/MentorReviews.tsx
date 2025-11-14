// src/modules/mentors/components/MentorReviews.tsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Rating,
  Avatar,
  Divider,
  Chip
} from '@mui/material';
import { useFeedback } from '../../../hooks/useFeedback';

interface MentorReviewsProps {
  mentorId: string;
}

export const MentorReviews: React.FC<MentorReviewsProps> = ({ mentorId }) => {
  const { feedbacks, loading } = useFeedback(mentorId);

  if (loading) {
    return (
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography>Cargando reseñas...</Typography>
        </CardContent>
      </Card>
    );
  }

  const averageRating = feedbacks.length > 0 
    ? feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbacks.length
    : 0;

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Reseñas de Estudiantes
        </Typography>

        {/* Estadísticas */}
        <Box display="flex" alignItems="center" gap={3} mb={3}>
          <Box textAlign="center">
            <Typography variant="h4" fontWeight="bold" color="primary">
              {averageRating.toFixed(1)} {/* ✅ 1 decimal */}
            </Typography>
            <Rating value={averageRating} precision={0.1} readOnly size="small" />
            <Typography variant="body2" color="text.secondary">
              {feedbacks.length} reseña{feedbacks.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
          
          <Box flex={1}>
            {/* ✅ DISTRIBUCIÓN MEJORADA */}
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = feedbacks.filter(f => f.rating === stars).length;
              const percentage = feedbacks.length > 0 ? (count / feedbacks.length) * 100 : 0;
              
              return (
                <Box key={stars} display="flex" alignItems="center" gap={1} mb={1}>
                  <Typography variant="body2" minWidth={30}>
                    {stars} ★
                  </Typography>
                  <Box 
                    sx={{ 
                      flex: 1, 
                      height: 8, 
                      backgroundColor: 'grey.200',
                      borderRadius: 4,
                      overflow: 'hidden'
                    }}
                  >
                    <Box 
                      sx={{ 
                        height: '100%', 
                        backgroundColor: 'primary.main',
                        width: `${percentage}%`,
                        transition: 'width 0.3s ease'
                      }} 
                    />
                  </Box>
                  <Typography variant="body2" minWidth={30} color="text.secondary">
                    {count}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* ✅ LISTA DE RESEÑAS MEJORADA */}
        {feedbacks.length === 0 ? (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Aún no hay reseñas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Este mentor no ha recibido calificaciones todavía.
            </Typography>
          </Box>
        ) : (
          <Box>
            {feedbacks.map((feedback) => (
              <Box key={feedback._id} sx={{ mb: 3, pb: 2, borderBottom: '1px solid #eee' }}>
                <Box display="flex" alignItems="flex-start" gap={2}>
                  <Avatar sx={{ width: 40, height: 40 }}>
                    {feedback.menteeId.name?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                  
                  <Box flex={1}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {feedback.menteeId.name || 'Usuario Anónimo'}
                      </Typography>
                      <Chip
                        label={new Date(feedback.createdAt).toLocaleDateString('es-ES')}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Rating value={feedback.rating} size="small" readOnly />
                      <Typography variant="body2" color="text.secondary">
                        {feedback.sessionId?.topic && `Sesión: ${feedback.sessionId.topic}`}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {feedback.comment}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};