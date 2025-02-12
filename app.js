const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const { handleError } = require('./middleware/errorHandler');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/users', userRoutes);

// Error handling middleware
app.use(handleError);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

