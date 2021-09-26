const express = require('express');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');

const router = express.Router();

const { loggedIn } = require('../../middleware');
const { dbConfig, jwtSecret } = require('../../config');
const logger = require('../../logger');

// GET - get all content pages for specific authenticated user
router.get('/pages', loggedIn, async (req, res) => {
  try {
    const con = await mysql.createConnection(dbConfig);
    const query = `SELECT title FROM tutorials GROUP BY title`;
    const [data] = await con.execute(query);
    await con.end();
    return res.send(data);
  } catch (err) {
    logger.error(err);
    return res.status(500).send({ err: 'Please try again' });
  }
});

// GET - get all content about selected sport
router.get('/sport/:id', loggedIn, async (req, res) => {
  const { id = '' } = req.params;
  try {
    const con = await mysql.createConnection(dbConfig);
    const query = `SELECT title, content FROM tutorials WHERE title = ${mysql.escape(
      id,
    )}`;
    const [data] = await con.execute(query);
    await con.end();
    return res.send(data);
  } catch (err) {
    logger.error(err);
    return res.status(500).send({ err: 'Please try again' });
  }
});

module.exports = router;
