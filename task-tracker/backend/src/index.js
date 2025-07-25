const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

const taskRoutes = require('./routes/task.routes');
const userRoutes = require('./routes/user.routes');

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));

app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Conditionally load testing routes
if (process.env.NODE_ENV === 'test') {
  const testingRoutes = require('./routes/testing.routes');
  app.use('/api/testing', testingRoutes);
  console.log('🧪 Testing routes enabled.');
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
