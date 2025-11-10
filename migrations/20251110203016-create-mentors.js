import { ObjectId } from 'mongodb';

export const up = async (db) => {
  await db.createCollection('mentors');
  
  await db.collection('mentors').createIndex({ userId: 1 }, { unique: true });
  
  // Mentor de ejemplo
  await db.collection('mentors').insertOne({
    _id: new ObjectId('200000000000000000000001'),
    userId: new ObjectId('100000000000000000000001'),
    expertise: ['React', 'Node.js', 'TypeScript'],
    bio: 'Mentor con experiencia en desarrollo fullstack',
    experience: '5 años desarrollando aplicaciones web',
    hourlyRate: 45,
    rating: 4.8,
    reviewCount: 12,
    isAvailable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  console.log('✅ Colección "mentors" creada con índice único en userId');
};

export const down = async (db) => {
  await db.collection('mentors').drop();
};