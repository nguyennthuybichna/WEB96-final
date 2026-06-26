const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const teacherRoutes = require('./routes/teacherRoutes');
const teacherPositionRoutes = require('./routes/teacherPositionRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/teachers', teacherRoutes);
app.use('/teacher-positions', teacherPositionRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/school?retryWrites=false';

mongoose.connect(MONGODB_URI, {
  retryWrites: false
})
  .then(() => {
    console.log('Connected to MongoDB successfully.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });