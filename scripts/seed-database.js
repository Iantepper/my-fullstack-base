import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

const MONGODB_URI = 'mongodb://localhost:27017/mentores-platform';

// ✅ MANTENEMOS LOS MISMOS 5 MENTORES
const mentors = [
  {
    name: 'Laura Dev',
    email: 'laura@ejemplo.com',
    password: '123456',
    bio: 'Desarrolladora Fullstack con 5 años de experiencia en React y Node.js',
    expertise: ['React', 'JavaScript', 'Node.js'],
    experience: '5 años en desarrollo web',
    hourlyRate: 45
  },
  {
    name: 'Carlos Code', 
    email: 'carlos@ejemplo.com',
    password: '123456',
    bio: 'Especialista en backend y bases de datos',
    expertise: ['Python', 'Django', 'PostgreSQL'],
    experience: '7 años en desarrollo backend',
    hourlyRate: 50
  },
  {
    name: 'Ana Tech',
    email: 'ana@ejemplo.com',
    password: '123456',
    bio: 'Ingeniera de software con pasión por enseñar',
    expertise: ['Java', 'Spring Boot', 'Microservices'],
    experience: '6 años en desarrollo enterprise',
    hourlyRate: 55
  },
  {
    name: 'Miguel Web',
    email: 'miguel@ejemplo.com', 
    password: '123456',
    bio: 'Desarrollador frontend especializado en UX/UI',
    expertise: ['Vue.js', 'CSS', 'TypeScript'],
    experience: '4 años en desarrollo frontend',
    hourlyRate: 40
  },
  {
    name: 'Sofia Data',
    email: 'sofia@ejemplo.com',
    password: '123456',
    bio: 'Científica de datos y machine learning',
    expertise: ['Python', 'Machine Learning', 'Pandas'],
    experience: '5 años en ciencia de datos',
    hourlyRate: 60
  }
];

// ✅ MANTENEMOS LOS MISMOS 5 MENTEES
const mentees = [
  {
    name: 'Juan Aprendiz',
    email: 'juan@ejemplo.com',
    password: '123456'
  },
  {
    name: 'Maria Estudiante',
    email: 'maria@ejemplo.com', 
    password: '123456'
  },
  {
    name: 'Pedro Novato',
    email: 'pedro@ejemplo.com',
    password: '123456'
  },
  {
    name: 'Lucia Curiosa',
    email: 'lucia@ejemplo.com',
    password: '123456'
  },
  {
    name: 'Diego Programador',
    email: 'diego@ejemplo.com',
    password: '123456'
  }
];

// ✅ SESIONES DE PRUEBA - TODAS ENTRE LAURA Y JUAN
const sampleSessions = [
  {
    topic: 'Introducción a React',
    description: 'Primera sesión para aprender los fundamentos de React',
    duration: 60,
    status: 'completed', // ✅ SESIÓN COMPLETADA
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 días atrás
    price: 45
  },
  {
    topic: 'Hooks y Estado en React',
    description: 'Aprendiendo useState, useEffect y custom hooks',
    duration: 90,
    status: 'completed', // ✅ SESIÓN COMPLETADA  
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 días atrás
    price: 45
  },
  {
    topic: 'Context API y Redux',
    description: 'Manejo de estado global en aplicaciones React',
    duration: 60,
    status: 'confirmed', // ✅ SESIÓN CONFIRMADA
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 días en el futuro
    price: 45
  },
  {
    topic: 'React Avanzado - Patrones',
    description: 'Render props, HOCs y composición de componentes',
    duration: 60,
    status: 'pending', // ✅ SESIÓN PENDIENTE
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 días en el futuro
    price: 45
  }
];

// ✅ FEEDBACKS DE PRUEBA para sesiones completadas
const sampleFeedbacks = [
  {
    rating: 5,
    comment: 'Excelente mentor! Explicó muy claro los conceptos básicos de React.'
  },
  {
    rating: 4,
    comment: 'Muy buena sesión sobre Hooks, ahora entiendo mejor el estado en React.'
  }
];

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');
    
    const db = client.db();
    
    // Limpiar colecciones existentes
    await db.collection('users').deleteMany({});
    await db.collection('mentors').deleteMany({});
    await db.collection('availabilities').deleteMany({});
    await db.collection('sessions').deleteMany({});
    await db.collection('feedback').deleteMany({});
    
    console.log('🗑️ Colecciones limpiadas');
    
    const createdUsers = [];
    const createdMentors = [];
    
    // Crear mentores
    for (const mentorData of mentors) {
      const hashedPassword = await bcrypt.hash(mentorData.password, 12);
      
      // Crear usuario
      const userResult = await db.collection('users').insertOne({
        _id: new ObjectId(),
        name: mentorData.name,
        email: mentorData.email,
        password: hashedPassword,
        role: 'mentor',
        avatar: '',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Crear perfil de mentor
      const mentorResult = await db.collection('mentors').insertOne({
        _id: new ObjectId(),
        userId: userResult.insertedId,
        expertise: mentorData.expertise,
        bio: mentorData.bio,
        experience: mentorData.experience,
        hourlyRate: mentorData.hourlyRate,
        rating: 0, // ✅ INICIAMOS EN 0 - sin reviews harcodeadas
        reviewCount: 0, // ✅ INICIAMOS EN 0
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      createdUsers.push({ ...mentorData, _id: userResult.insertedId, role: 'mentor' });
      createdMentors.push({ ...mentorData, _id: mentorResult.insertedId, userId: userResult.insertedId });
      
      console.log(`✅ Mentor creado: ${mentorData.name}`);
    }
    
    // Crear mentees
    for (const menteeData of mentees) {
      const hashedPassword = await bcrypt.hash(menteeData.password, 12);
      
      const userResult = await db.collection('users').insertOne({
        _id: new ObjectId(),
        name: menteeData.name,
        email: menteeData.email,
        password: hashedPassword,
        role: 'mentee',
        avatar: '',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      createdUsers.push({ ...menteeData, _id: userResult.insertedId, role: 'mentee' });
      
      console.log(`✅ Mentee creado: ${menteeData.name}`);
    }
    
    // Crear disponibilidad para mentores
    for (const mentor of createdMentors) {
      await db.collection('availabilities').insertOne({
        _id: new ObjectId(),
        mentorId: mentor._id,
        timeZone: 'America/Argentina/Buenos_Aires',
        weeklySlots: {
          "1": { // Lunes
            "09:00-10:00": { start: "09:00", end: "10:00", available: true },
            "14:00-15:00": { start: "14:00", end: "15:00", available: true },
            "18:00-19:00": { start: "18:00", end: "19:00", available: true }
          },
          "3": { // Miércoles
            "10:00-11:00": { start: "10:00", end: "11:00", available: true },
            "16:00-17:00": { start: "16:00", end: "17:00", available: true }
          },
          "5": { // Viernes
            "11:00-12:00": { start: "11:00", end: "12:00", available: true },
            "15:00-16:00": { start: "15:00", end: "16:00", available: true }
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log(`✅ Disponibilidad creada para: ${mentor.name}`);
    }
    
    // ✅ CREAR SESIONES DE PRUEBA - TODAS ENTRE LAURA Y JUAN
    console.log('\n📅 Creando sesiones de prueba (Laura + Juan)...');
    
    // Buscar Laura Dev y Juan Aprendiz específicamente
    const lauraMentor = createdMentors.find(m => m.email === 'laura@ejemplo.com');
    const juanMentee = createdUsers.find(u => u.email === 'juan@ejemplo.com' && u.role === 'mentee');
    
    if (!lauraMentor || !juanMentee) {
      throw new Error('No se encontró Laura Dev o Juan Aprendiz');
    }
    
    for (let i = 0; i < sampleSessions.length; i++) {
      const sessionData = sampleSessions[i];
      
      const sessionResult = await db.collection('sessions').insertOne({
        _id: new ObjectId(),
        mentorId: lauraMentor._id, // ✅ SIEMPRE LAURA
        menteeId: juanMentee._id,  // ✅ SIEMPRE JUAN
        date: sessionData.date,
        duration: sessionData.duration,
        topic: sessionData.topic,
        description: sessionData.description,
        status: sessionData.status,
        price: sessionData.price,
        meetingLink: sessionData.status === 'confirmed' ? `https://meet.jit.si/session-${new ObjectId()}` : undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log(`✅ Sesión creada: ${sessionData.topic} (${sessionData.status})`);
      
      // ✅ CREAR FEEDBACK PARA SESIONES COMPLETADAS
      if (sessionData.status === 'completed' && sampleFeedbacks[i]) {
        const feedbackData = sampleFeedbacks[i];
        
        await db.collection('feedback').insertOne({
          _id: new ObjectId(),
          sessionId: sessionResult.insertedId,
          menteeId: juanMentee._id,  // ✅ SIEMPRE JUAN
          mentorId: lauraMentor._id, // ✅ SIEMPRE LAURA
          rating: feedbackData.rating,
          comment: feedbackData.comment,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        console.log(`✅ Feedback creado para: ${sessionData.topic} (${feedbackData.rating}★)`);
      }
    }
    
    console.log('\n🎉 Base de datos poblada exitosamente!');
    console.log('\n📋 CREDENCIALES DE PRUEBA:');
    console.log('========================');
    
    console.log('\n👨‍🏫 MENTORES (role: mentor):');
    mentors.forEach(mentor => {
      console.log(`   Email: ${mentor.email} | Password: ${mentor.password}`);
    });
    
    console.log('\n👥 MENTEES (role: mentee):');
    mentees.forEach(mentee => {
      console.log(`   Email: ${mentee.email} | Password: ${mentee.password}`);
    });
    
    console.log('\n🔍 PARA PROBAR (Laura + Juan):');
    console.log('   👨‍🏫 Laura Dev: laura@ejemplo.com / 123456');
    console.log('   👥 Juan Aprendiz: juan@ejemplo.com / 123456');
    console.log('\n   - 2 sesiones "completed": Ya tienen feedback');
    console.log('   - 1 sesión "confirmed": Puede ser completada');  
    console.log('   - 1 sesión "pending": Puede ser confirmada/cancelada');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

seedDatabase();