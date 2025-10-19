const pool = require('../config/db');

// Create address
const createAddress = async (user_id, address_line1, address_line2, city, state, postal_code, country, type = 'shipping') => {
  const query = `
    INSERT INTO addresses (user_id, address_line1, address_line2, city, state, postal_code, country, type)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *;
  `;
  const values = [user_id, address_line1, address_line2, city, state, postal_code, country, type];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Get addresses by user
const getAddressesByUser = async (user_id) => {
  const result = await pool.query('SELECT * FROM addresses WHERE user_id = $1', [user_id]);
  return result.rows;
};

// Update address
const updateAddress = async (id, updates) => {
  const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`).join(', ');
  const values = Object.values(updates);
  values.push(id);
  const query = `UPDATE addresses SET ${fields} WHERE id = $${values.length} RETURNING *`;
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Delete address
const deleteAddress = async (id) => {
  const result = await pool.query('DELETE FROM addresses WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = {
  createAddress,
  getAddressesByUser,
  updateAddress,
  deleteAddress
};
