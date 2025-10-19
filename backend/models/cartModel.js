const pool = require('../config/db');

// Add item to cart
const addToCart = async (user_id, product_id, quantity) => {
  const query = `
    INSERT INTO cart (user_id, product_id, quantity)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const result = await pool.query(query, [user_id, product_id, quantity]);
  return result.rows[0];
};

// Get cart items for a user
const getCartItems = async (user_id) => {
  const query = `
    SELECT c.*, p.name, p.price
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = $1
  `;
  const result = await pool.query(query, [user_id]);
  return result.rows;
};

// Update cart quantity
const updateCartItem = async (id, quantity) => {
  const query = 'UPDATE cart SET quantity = $1 WHERE id = $2 RETURNING *';
  const result = await pool.query(query, [quantity, id]);
  return result.rows[0];
};

// Remove item from cart
const removeCartItem = async (id) => {
  const result = await pool.query('DELETE FROM cart WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = {
  addToCart,
  getCartItems,
  updateCartItem,
  removeCartItem
};
