import express from 'express';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
app.use(express.json());

// Add this right after app.use(express.json());
app.get('/ping', (req, res) => {
  res.json({ msg: 'pong', timestamp: Date.now() });
});

// Routes
app.use('/api/auth', authRoutes); //Auth Routes
app.use('/api/products', productRoutes);


// Global Error Handler
app.use(errorHandler);

app.listen(3000, () => console.log('🚀 Server running on port 3000'));
