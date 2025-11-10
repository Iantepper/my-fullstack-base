import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

const MONGODB_URI = 'mongodb://localhost:27017/mentores-platform';

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
    
    console.log('🗑️ Colecciones limpiadas');
    
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
      await db.collection('mentors').insertOne({
        _id: new ObjectId(),
        userId: userResult.insertedId,
        expertise: mentorData.expertise,
        bio: mentorData.bio,
        experience: mentorData.experience,
        hourlyRate: mentorData.hourlyRate,
        rating: Math.random() * 2 + 3.5, // Rating entre 3.5 y 5.5
        reviewCount: Math.floor(Math.random() * 20) + 5,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log(`✅ Mentor creado: ${mentorData.name}`);
    }
    
    // Crear mentees
    for (const menteeData of mentees) {
      const hashedPassword = await bcrypt.hash(menteeData.password, 12);
      
      await db.collection('users').insertOne({
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
      
      console.log(`✅ Mentee creado: ${menteeData.name}`);
    }
    
    // Crear disponibilidad para mentores
    const allMentors = await db.collection('mentors').find({}).toArray();
    
    for (const mentor of allMentors) {
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
      
      console.log(`✅ Disponibilidad creada para: ${mentor._id}`);
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
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

seedDatabase();