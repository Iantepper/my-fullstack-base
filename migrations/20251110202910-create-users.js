import { ObjectId } from 'mongodb';

export const up = async (db) => {
  await db.createCollection('users');
  
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  
  // Usuario de ejemplo
  await db.collection('users').insertOne({
    _id: new ObjectId('100000000000000000000001'),
    name: 'Mentor Ejemplo',
    email: 'mentor@ejemplo.com',
    password: '$2b$12$hashedpassword', // contraseña: 123456
    role: 'mentor',
    avatar: '',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  console.log('✅ Colección "users" creada con índice único en email');
};

export const down = async (db) => {
  await db.collection('users').drop();
};