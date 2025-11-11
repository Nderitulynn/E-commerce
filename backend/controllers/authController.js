import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = '1h';

// REGISTER
export const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: 'User already exists' });

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      email,
      password_hash,
      phone
    });

    // Respond immediately
    res.status(201).json({ msg: 'User registered.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // Generate JWT token - use _id for MongoDB
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// LOGOUT
export const logoutUser = async (req, res) => {
  res.json({ msg: 'User logged out' });
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });
    
    // Respond immediately
    res.json({ msg: 'Password reset functionality temporarily disabled.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    // Note: Since we removed email functionality, reset_token field doesn't exist
    // This function won't work until you add reset_token to User schema and re-enable email
    res.status(503).json({ msg: 'Password reset functionality temporarily disabled.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// GET CURRENT USER
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find user by ID and select specific fields
    const user = await User.findById(userId).select('name email phone role');
    
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};