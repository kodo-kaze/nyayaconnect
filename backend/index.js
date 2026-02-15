const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/cases', require('./routes/caseRoutes'));
app.use('/admin', require('./routes/adminRoutes'));
app.use('/police', require('./routes/policeRoutes'));
app.use('/evidence', require('./routes/evidenceRoutes'));
app.use('/ai', require('./routes/aiRoutes'));

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
