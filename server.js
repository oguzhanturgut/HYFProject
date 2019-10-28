const express = require('express');
const app = express();
const config = require('config');
const PORT = process.env.port || 5000;
const db = config.get('mongoURI');
const connectDB = require('./config/db');

// Connect to database
connectDB(db);

// Middleware for body parser
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/users', require('./routes/api/users'));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
