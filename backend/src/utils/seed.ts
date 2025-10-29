import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import connectDB from '../config/db';

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: '123456',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: '123456',
    role: 'user'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: '123456',
    role: 'user'
  }
];

const seedUsers = async () => {
  try {
    await connectDB();
    
    // Clear existing users
    await User.deleteMany({});
    
    // Create users
    const createdUsers = await User.create(users);
    
    console.log('Database seeded successfully');
    console.log('Created users:', createdUsers);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedUsers();
