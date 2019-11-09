const express = require('express');
const app = express();
const config = require('config');
const PORT = process.env.port || 5000;
const db = config.get('mongoURI');
const connectDB = require('./config/db');
const path = require('path');

// Connect to database
connectDB(db);

// Middleware for body parser
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/users', require('./routes/api/users'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
