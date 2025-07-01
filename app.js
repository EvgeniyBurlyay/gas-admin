const express = require('express');
const { init } = require('./db');
const authRoutes = require('./routes/auth');
const gasRoutes = require('./routes/gases');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/gases', gasRoutes);

init().then(() => {
  app.listen(port, () => console.log(`Server running on port ${port}`));
}).catch(err => {
  console.error('Failed to initialize database', err);
  process.exit(1);
});
