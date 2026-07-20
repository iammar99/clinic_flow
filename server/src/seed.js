const bcrypt = require('bcrypt');
const sequelize = require('./config/database');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');
const Appointment = require('./models/Appointment');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database. Syncing models...');
    await sequelize.sync({ force: true }); // Reset DB for seeding
    console.log('Database synced. Seeding database...');

    // 1. Create Default Doctor
    const hashedPassword = await bcrypt.hash('password123', 10);
    const doctor = await Doctor.create({
      email: 'doctor@clinicflow.com',
      password: hashedPassword,
      name: 'Dr. Ali Ahmed',
      specialty: 'Dermatologist',
      qualifications: 'MBBS, FCPS (Dermatology)',
      experience: 12,
      languages: ['English', 'Urdu', 'Sindhi'],
      bio: 'Dr. Ali Ahmed is a senior dermatologist specializing in clinical skin disorders, pediatric dermatology, and advanced aesthetic procedures. He is an active member of the Pakistan Association of Dermatologists (PAD) and brings 12+ years of clinical excellence.',
      clinicAddress: 'Suite 402, 4th Floor, Clifton Medical Complex, Block 5, Clifton, Karachi',
      workingHours: {
        Monday: { start: '09:00', end: '17:00' },
        Tuesday: { start: '09:00', end: '17:00' },
        Wednesday: { start: '09:00', end: '17:00' },
        Thursday: { start: '09:00', end: '17:00' },
        Friday: { start: '09:00', end: '13:00' },
        Saturday: { start: '10:00', end: '14:00' },
        Sunday: null
      },
      services: [
        { name: 'General Dermatology Consultation', description: 'Expert diagnosis and medical treatments for rash, eczema, acne, psoriasis, hair loss, and nail disorders.', fee: 3000, duration: 30 },
        { name: 'Acne scar revision & Microneedling', description: 'Minimal invasive treatment designed to reduce deep acne scars and improve skin texture.', fee: 6000, duration: 30 },
        { name: 'Laser Skin Rejuvenation', description: 'Advanced laser therapy to target hyperpigmentation, fine lines, wrinkles, and sun spots.', fee: 8500, duration: 45 },
        { name: 'Chemical Peel & Exfoliation', description: 'Clinical peeling agent application to reveal brighter, smoother, and more even-toned skin.', fee: 5000, duration: 30 },
        { name: 'Cosmetic Botox & Fillers', description: 'Precision anti-aging treatments for volume enhancement and wrinkle reduction.', fee: 12000, duration: 45 }
      ],
      holidays: [] // e.g. ["2026-07-25"]
    });

    console.log(`Doctor created: ${doctor.name} (Email: ${doctor.email})`);

    // 2. Create Sample Patients
    const patient1 = await Patient.create({
      name: 'Sara Ahmed',
      phone: '+923001234567',
      email: 'sara.ahmed@example.com',
      notes: 'Patient suffers from seasonal dry eczema. Sensitive skin profile. Prefers organic skin cleansers.'
    });

    const patient2 = await Patient.create({
      name: 'Ali Khan',
      phone: '+923219876543',
      email: 'ali.khan@example.com',
      notes: 'Active acne patient. Prescribed oral isotretinoin. Undergoing monthly checkups.'
    });

    const patient3 = await Patient.create({
      name: 'Fatima Noor',
      phone: '+923334567890',
      email: 'fatima.noor@example.com',
      notes: 'Inquired about chemical peels for melasma. Patch test conducted; skin reacted well.'
    });

    console.log('Sample patients seeded.');

    // 3. Create Sample Appointments
    // Get date strings for today, tomorrow, and day after tomorrow
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(today.getDate() + 2);

    const formatDate = (d) => d.toISOString().split('T')[0];

    await Appointment.create({
      patientId: patient1.id,
      serviceName: 'General Dermatology Consultation',
      date: formatDate(today),
      time: '09:00',
      status: 'confirmed',
      notes: 'First time consultation for facial rash.'
    });

    await Appointment.create({
      patientId: patient2.id,
      serviceName: 'Acne scar revision & Microneedling',
      date: formatDate(today),
      time: '10:30',
      status: 'pending',
      notes: 'Requires topical numbing cream 45 mins prior.'
    });

    await Appointment.create({
      patientId: patient3.id,
      serviceName: 'Chemical Peel & Exfoliation',
      date: formatDate(tomorrow),
      time: '12:00',
      status: 'confirmed',
      notes: 'Scheduled for first peeling session.'
    });

    await Appointment.create({
      patientId: patient1.id,
      serviceName: 'General Dermatology Consultation',
      date: formatDate(dayAfter),
      time: '11:00',
      status: 'pending',
      notes: 'Follow up check on rash progress.'
    });

    console.log('Sample appointments seeded.');
    console.log('Database seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
