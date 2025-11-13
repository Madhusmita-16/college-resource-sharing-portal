const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const { initDB } = require('./config/db');

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/student', require('./routes/student'));
app.use('/api/admin', require('./routes/admin'));

app.get('/health', (req, res) => res.json({ status: 'OK' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Error]', err);
  res.status(500).json({ status: 'error', message: err.message || 'Internal Server Error' });
});

app.use((req, res) => res.status(404).json({ status: 'error', message: 'Route not found' }));

const PORT = process.env.PORT || 4000;
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
