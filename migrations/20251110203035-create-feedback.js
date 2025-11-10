import { ObjectId } from 'mongodb';

export const up = async (db) => {
  await db.createCollection('feedback');
  
  await db.collection('feedback').createIndex({ sessionId: 1 }, { unique: true });
  await db.collection('feedback').createIndex({ menteeId: 1 });
  
  console.log('✅ Colección "feedback" creada con índices');
};

export const down = async (db) => {
  await db.collection('feedback').drop();
};