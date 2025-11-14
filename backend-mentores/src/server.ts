import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Importar rutas
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import mentorRoutes from './routes/mentors';
import sessionRoutes from './routes/sessions';
import feedbackRoutes from './routes/feedback';
import availabilityRoutes from './routes/availability';
import notificationRoutes from './routes/notifications';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mentores-platform')
  .then(() => {
    console.log('✅ Conectado a MongoDB');
  })
  .catch((error) => {
    console.error('❌ Error conectando a MongoDB:', error);
  });

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/notifications', notificationRoutes);
// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    message: '🚀 Servidor de Mentores funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🎯 Servidor corriendo en http://localhost:${PORT}`);
});