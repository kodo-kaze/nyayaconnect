const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const adminExists = await User.findOne({ role: 'ADMIN' });

    if (adminExists) {
      console.log('Admin already exists');
      process.exit();
    }

    const admin = new User({
      name: 'System Admin',
      email: 'admin@nyayaconnect.com',
      phone: '0000000000',
      password: 'adminpassword123',
      role: 'ADMIN',
      verified: true,
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@nyayaconnect.com');
    console.log('Password: adminpassword123');
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
