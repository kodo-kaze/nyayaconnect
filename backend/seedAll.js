const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Case = require('./models/Case');
const Evidence = require('./models/Evidence');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Case.deleteMany({});
    await Evidence.deleteMany({});
    console.log('Cleared existing data.');

    // Create Users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = await User.insertMany([
      { name: 'Admin User', email: 'admin@test.com', phone: '0000000000', password: hashedPassword, role: 'ADMIN', verified: true },
      { name: 'Citizen Joe', email: 'joe@test.com', phone: '1111111111', password: hashedPassword, role: 'CITIZEN', verified: true },
      { name: 'Citizen Jane', email: 'jane@test.com', phone: '2222222222', password: hashedPassword, role: 'CITIZEN', verified: true },
      { name: 'Officer Smith', email: 'smith@police.com', phone: '3333333333', password: hashedPassword, role: 'POLICE', verified: true },
      { name: 'Officer Varma', email: 'varma@police.com', phone: '4444444444', password: hashedPassword, role: 'POLICE', verified: true },
      { name: 'Judge Khanna', email: 'khanna@courts.com', phone: '5555555555', password: hashedPassword, role: 'JUDGE', verified: true },
      { name: 'Judge Iyer', email: 'iyer@courts.com', phone: '6666666666', password: hashedPassword, role: 'JUDGE', verified: true },
      { name: 'Lawyer Gupta', email: 'gupta@legal.com', phone: '7777777777', password: hashedPassword, role: 'LAWYER', verified: true },
      { name: 'Lawyer Reddy', email: 'reddy@legal.com', phone: '8888888888', password: hashedPassword, role: 'LAWYER', verified: true },
    ]);

    const admin = users[0];
    const joe = users[1];
    const jane = users[2];
    const smith = users[3];
    const varma = users[4];
    const khanna = users[5];
    const iyer = users[6];
    const gupta = users[7];

    // Create Cases
    const cases = await Case.insertMany([
      {
        title: 'Theft at Downtown Mall',
        description: 'A shoplifting incident involving electronics.',
        category: 'Criminal',
        status: 'INVESTIGATING',
        createdBy: joe._id,
        assignedPolice: smith._id,
        assignedJudge: khanna._id,
        aiUrgencyScore: 3
      },
      {
        title: 'Property Dispute - Sector 4',
        description: 'Dispute over boundary walls between two neighbors.',
        category: 'Civil',
        status: 'PENDING_VERIFICATION',
        createdBy: joe._id,
        aiUrgencyScore: 2
      },
      {
        title: 'Domestic Disturbance',
        description: 'Noise complaint and alleged harassment.',
        category: 'Family',
        status: 'TRIAL',
        createdBy: jane._id,
        assignedPolice: varma._id,
        assignedJudge: iyer._id,
        assignedLawyers: [gupta._id],
        aiUrgencyScore: 4
      },
      {
        title: 'Cyber Fraud Case',
        description: 'Phishing attack resulting in financial loss.',
        category: 'Criminal',
        status: 'CLOSED',
        createdBy: jane._id,
        assignedPolice: smith._id,
        assignedJudge: khanna._id,
        aiUrgencyScore: 5
      },
      {
        title: 'Suspicious Activity Report',
        description: 'Found unknown bags in the park.',
        category: 'General',
        status: 'REJECTED',
        createdBy: joe._id,
        aiUrgencyScore: 1
      },
      {
        title: 'Contract Breach - Tech Corp',
        description: 'Failure to deliver software modules on time.',
        category: 'Civil',
        status: 'REGISTERED',
        createdBy: jane._id,
        assignedPolice: varma._id,
        aiUrgencyScore: 3
      }
    ]);

    // Create Evidence
    await Evidence.insertMany([
      {
        caseId: cases[0]._id,
        uploadedBy: smith._id,
        fileHash: 'abc123hash',
        filePath: 'cctv_footage.mp4',
        fileType: 'video/mp4'
      },
      {
        caseId: cases[0]._id,
        uploadedBy: joe._id,
        fileHash: 'def456hash',
        filePath: 'receipt.pdf',
        fileType: 'application/pdf'
      },
      {
        caseId: cases[2]._id,
        uploadedBy: varma._id,
        fileHash: 'ghi789hash',
        filePath: 'audio_recording.mp3',
        fileType: 'audio/mpeg',
        locked: true
      }
    ]);

    console.log('Seeding completed successfully!');
    console.log('Test Accounts (Password for all: password123):');
    console.log('- Admin: admin@test.com');
    console.log('- Citizen: joe@test.com, jane@test.com');
    console.log('- Police: smith@police.com, varma@police.com');
    console.log('- Judge: khanna@courts.com, iyer@courts.com');
    console.log('- Lawyer: gupta@legal.com');

    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
