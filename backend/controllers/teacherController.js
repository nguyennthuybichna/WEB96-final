const Teacher = require('../models/Teacher');
const User = require('../models/User');

async function generateUniqueCode() {
  let code = '';
  let exists = true;
  while (exists) {
    code = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const existing = await Teacher.findOne({ code });
    if (!existing) {
      exists = false;
    }
  }
  return code;
}

exports.getTeachers = async (req, res) => {
  try {
    // Ensure page and limit are positive integers >= 1 to prevent negative/NaN skip values
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    let query = {};

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      const users = await User.find({
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { phoneNumber: searchRegex }
        ]
      }).select('_id');
      const userIds = users.map(u => u._id);

      query = {
        $or: [
          { userId: { $in: userIds } },
          { code: searchRegex }
        ]
      };
    }

    const totalDocs = await Teacher.countDocuments(query);
    const teachers = await Teacher.find(query)
      .populate('userId')
      .populate('teacherPositionsId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      docs: teachers,
      totalDocs,
      limit,
      page,
      totalPages: Math.ceil(totalDocs / limit)
    });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createTeacher = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      address,
      identity,
      dob,
      isActive,
      startDate,
      endDate,
      teacherPositionsId,
      degrees
    } = req.body;

    if (!name || !email || !phoneNumber) {
      return res.status(400).json({ message: 'Name, Email, and Phone number are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Parse and validate date values
    const parsedDob = dob ? new Date(dob) : null;
    if (dob && isNaN(parsedDob.getTime())) {
      return res.status(400).json({ message: 'Invalid Date of Birth format' });
    }

    const parsedStartDate = startDate ? new Date(startDate) : new Date();
    if (startDate && isNaN(parsedStartDate.getTime())) {
      return res.status(400).json({ message: 'Invalid Start Date format' });
    }

    const parsedEndDate = endDate ? new Date(endDate) : null;
    if (endDate && isNaN(parsedEndDate.getTime())) {
      return res.status(400).json({ message: 'Invalid End Date format' });
    }

    const code = await generateUniqueCode();

    // Create and save User document
    let newUser;
    try {
      newUser = new User({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phoneNumber: phoneNumber.trim(),
        address: address ? address.trim() : '',
        identity: identity ? identity.trim() : '',
        dob: parsedDob,
        role: 'TEACHER',
        isDeleted: false
      });
      await newUser.save();
    } catch (err) {
      console.error('Error saving user:', err);
      return res.status(500).json({ message: 'Failed to create user account: ' + err.message });
    }

    // Create and save Teacher document linked to the User
    try {
      const newTeacher = new Teacher({
        userId: newUser._id,
        code,
        isActive: isActive !== undefined ? isActive : true,
        isDeleted: false,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        teacherPositionsId: teacherPositionsId || [],
        degrees: degrees || []
      });
      await newTeacher.save();

      const populatedTeacher = await Teacher.findById(newTeacher._id)
        .populate('userId')
        .populate('teacherPositionsId');

      return res.status(201).json(populatedTeacher);
    } catch (error) {
      console.error('Error saving teacher, cleaning up user:', error);
      // Rollback: delete the created User if Teacher fails to ensure database consistency
      if (newUser && newUser._id) {
        await User.findByIdAndDelete(newUser._id);
      }
      return res.status(500).json({ message: 'Failed to create teacher profile: ' + error.message });
    }
  } catch (error) {
    console.error('Error creating teacher:', error);
    return res.status(500).json({ message: 'Internal server error: ' + error.message });
  }
};
