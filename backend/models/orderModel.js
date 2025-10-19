const pool = require('../config/db');

// Create a new order
const createOrder = async (user_id, total_amount, status = 'pending') => {
  const query = `
    INSERT INTO orders (user_id, total_amount, status)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const result = await pool.query(query, [user_id, total_amount, status]);
  return result.rows[0];
};

// Get order by ID
const getOrderById = async (id) => {
  const result = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
  return result.rows[0];
};

// Get orders by user
const getOrdersByUser = async (user_id) => {
  const result = await pool.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [user_id]);
  return result.rows;
};

// Update order
const updateOrder = async (id, updates) => {
  const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`).join(', ');
  const values = Object.values(updates);
  values.push(id);
  const query = `UPDATE orders SET ${fields} WHERE id = $${values.length} RETURNING *`;
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Delete order
const deleteOrder = async (id) => {
  const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = {
  createOrder,
  getOrderById,
  getOrdersByUser,
  updateOrder,
  deleteOrder
};
