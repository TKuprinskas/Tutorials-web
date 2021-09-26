const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { port } = require('./config');
const auth = require('./routes/v1/auth');
const tutorials = require('./routes/v1/tutorials');
const content = require('./routes/v1/content');
const logger = require('./logger');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/v1/auth', auth);
app.use('/v1/', tutorials);
app.use('/v1/content', content);

// GET - check server is running
app.get('/', (req, res) => {
  res.send({ msg: 'Server is running successfully' });
});

// GET - all other routes
app.all('*', (req, res) => {
  logger.warn(`Page not found: ${req.url}`);
  res.status(404).send({ msg: 'Page Not Found' });
});

app.listen(port, () => logger.info(`Server is running on port ${port}`));
