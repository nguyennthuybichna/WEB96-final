const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Teacher = require('../models/Teacher');
const TeacherPosition = require('../models/TeacherPosition');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/school';

function convertExtendedJson(obj) {
  if (obj === null || obj === undefined) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(convertExtendedJson);
  }
  
  if (typeof obj === 'object') {
    if (obj.$oid) {
      return new mongoose.Types.ObjectId(obj.$oid);
    }
    if (obj.$date) {
      return new Date(obj.$date);
    }
    
    const newObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = convertExtendedJson(obj[key]);
      }
    }
    return newObj;
  }
  
  return obj;
}

async function seedDatabase() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully.');

    const usersPath = path.join(__dirname, '../data/school.users.json');
    const teachersPath = path.join(__dirname, '../data/school.teachers.json');
    const positionsPath = path.join(__dirname, '../data/school.teacherpositions.json');

    console.log('Reading seed JSON files...');
    const rawUsers = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    const rawTeachers = JSON.parse(fs.readFileSync(teachersPath, 'utf8'));
    const rawPositions = JSON.parse(fs.readFileSync(positionsPath, 'utf8'));

    console.log('Converting Extended JSON data...');
    const users = convertExtendedJson(rawUsers);
    const teachers = convertExtendedJson(rawTeachers);
    const positions = convertExtendedJson(rawPositions);

    console.log('Cleaning existing collections...');
    await User.deleteMany({});
    await Teacher.deleteMany({});
    await TeacherPosition.deleteMany({});
    console.log('Collections cleared.');

    console.log('Seeding Teacher Positions...');
    const insertedPositions = await TeacherPosition.insertMany(positions);
    console.log(`Seeded ${insertedPositions.length} teacher positions.`);

    console.log('Seeding Users...');
    const insertedUsers = await User.insertMany(users);
    console.log(`Seeded ${insertedUsers.length} users.`);

    console.log('Seeding Teachers...');
    const insertedTeachers = await Teacher.insertMany(teachers);
    console.log(`Seeded ${insertedTeachers.length} teachers.`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
