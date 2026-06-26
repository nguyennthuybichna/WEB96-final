const TeacherPosition = require('../models/TeacherPosition');

exports.getTeacherPositions = async (req, res) => {
  try {
    const positions = await TeacherPosition.find().sort({ createdAt: -1 });
    return res.status(200).json(positions);
  } catch (error) {
    console.error('Error fetching teacher positions:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createTeacherPosition = async (req, res) => {
  try {
    const { name, code, des, isActive } = req.body;

    if (!name || !code) {
      return res.status(400).json({ message: 'Name and Code are required' });
    }

    // Safely cast inputs to String to prevent crashes if numeric values are passed
    const formattedCode = String(code).trim();
    const formattedName = String(name).trim();
    const formattedDes = des ? String(des).trim() : '';

    const existingPosition = await TeacherPosition.findOne({ code: formattedCode });
    if (existingPosition) {
      return res.status(400).json({ message: `Position with code '${formattedCode}' already exists` });
    }

    const newPosition = new TeacherPosition({
      name: formattedName,
      code: formattedCode,
      des: formattedDes,
      isActive: isActive !== undefined ? isActive : true,
      isDeleted: false
    });

    await newPosition.save();
    return res.status(201).json(newPosition);
  } catch (error) {
    console.error('Error creating teacher position:', error);
    return res.status(500).json({ message: 'Internal server error: ' + error.message });
  }
};
