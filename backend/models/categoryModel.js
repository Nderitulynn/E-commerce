const pool = require('../config/db');

// Create a new category
const createCategory = async (name, description) => {
  const query = `
    INSERT INTO categories (name, description)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const result = await pool.query(query, [name, description]);
  return result.rows[0];
};

// Get all categories
const getAllCategories = async () => {
  const result = await pool.query('SELECT * FROM categories ORDER BY name');
  return result.rows;
};

// Get category by ID
const getCategoryById = async (id) => {
  const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
  return result.rows[0];
};

// Update category
const updateCategory = async (id, updates) => {
  const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`).join(', ');
  const values = Object.values(updates);
  values.push(id);
  const query = `UPDATE categories SET ${fields} WHERE id = $${values.length} RETURNING *`;
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Delete category
const deleteCategory = async (id) => {
  const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};
