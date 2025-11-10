import { ObjectId } from 'mongodb';

export const up = async (db) => {
  await db.createCollection('availabilities');
  
  await db.collection('availabilities').createIndex({ mentorId: 1 }, { unique: true });
  
  // Disponibilidad de ejemplo para el mentor
  await db.collection('availabilities').insertOne({
    _id: new ObjectId('500000000000000000000001'),
    mentorId: new ObjectId('200000000000000000000001'),
    timeZone: 'America/Argentina/Buenos_Aires',
    weeklySlots: {
      "1": { // Lunes
        "18:00-19:00": { start: "18:00", end: "19:00", available: true },
        "19:00-20:00": { start: "19:00", end: "20:00", available: true }
      },
      "3": { // Miércoles
        "18:00-19:00": { start: "18:00", end: "19:00", available: true }
      },
      "5": { // Viernes
        "18:00-19:00": { start: "18:00", end: "19:00", available: true }
      }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  console.log('✅ Colección "availabilities" creada con índice único en mentorId');
};

export const down = async (db) => {
  await db.collection('availabilities').drop();
};