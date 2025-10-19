import jwt from 'jsonwebtoken';
import pool from '../config/db.js'; // make sure the path ends with .js

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await pool.query('SELECT id, name, email, role FROM users WHERE id=$1', [decoded.id]);
    if (!result.rows.length) return res.status(401).json({ msg: 'User not found' });

    req.user = result.rows[0]; // attach user to request
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Restrict access based on user roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'You do not have permission to perform this action' });
    }
    next();
  };
};
