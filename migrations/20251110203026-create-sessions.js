import { ObjectId } from 'mongodb';

export const up = async (db) => {
  await db.createCollection('sessions');
  
  await db.collection('sessions').createIndex({ mentorId: 1 });
  await db.collection('sessions').createIndex({ menteeId: 1 });
  await db.collection('sessions').createIndex({ date: 1 });
  
  console.log('✅ Colección "sessions" creada con índices');
};

export const down = async (db) => {
  await db.collection('sessions').drop();
};