const pool = require('../config/db');

// Create a new product
const createProduct = async (data) => {
  const { name, description, price, stock, category_id } = data;
  const query = `
    INSERT INTO products (name, description, price, stock, category_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [name, description, price, stock, category_id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Get all products with pagination
const getAllProducts = async (limit = 20, offset = 0) => {
  const query = 'SELECT * FROM products ORDER BY created_at DESC LIMIT $1 OFFSET $2';
  const result = await pool.query(query, [limit, offset]);
  return result.rows;
};

// Get product by ID
const getProductById = async (id) => {
  const query = 'SELECT * FROM products WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Get products by category
const getProductsByCategory = async (categoryId) => {
  const query = 'SELECT * FROM products WHERE category_id = $1';
  const result = await pool.query(query, [categoryId]);
  return result.rows;
};

// Update product
const updateProduct = async (id, data) => {
  const fields = Object.keys(data).map((key, index) => `${key} = $${index + 1}`).join(', ');
  const values = Object.values(data);
  values.push(id);
  const query = `UPDATE products SET ${fields} WHERE id = $${values.length} RETURNING *`;
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Delete product
const deleteProduct = async (id) => {
  const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Update stock
const updateStock = async (id, quantity) => {
  const query = 'UPDATE products SET stock = $1 WHERE id = $2 RETURNING *';
  const result = await pool.query(query, [quantity, id]);
  return result.rows[0];
};

// Search products
const searchProducts = async (searchTerm) => {
  const query = 'SELECT * FROM products WHERE name ILIKE $1 OR description ILIKE $1';
  const result = await pool.query(query, [`%${searchTerm}%`]);
  return result.rows;
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
  updateStock,
  searchProducts
};
