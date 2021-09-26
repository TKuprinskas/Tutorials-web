const express = require('express');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');

const router = express.Router();

const { loggedIn } = require('../../middleware');
const { dbConfig, jwtSecret } = require('../../config');
const logger = require('../../logger');

// GET - get all tutorials for specific authenticated user
router.get('/user-tutorials/:id', loggedIn, async (req, res) => {
  const { id = '' } = req.params;
  try {
    const con = await mysql.createConnection(dbConfig);
    const query = `SELECT * FROM tutorials LEFT JOIN users2 ON (tutorials.user_id = users2.id) ${
      id && `WHERE tutorials.user_id = ${mysql.escape(id)}`
    }`;
    const [data] = await con.execute(query);
    await con.end();
    return res.send(data);
  } catch (err) {
    logger.error(err);
    return res.status(500).send({ err: 'Please try again' });
  }
});

// GET - will get all tutorials for auth user if logged in, if not gives all tutorials with private = 0
router.get('/tutorials', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    const decodedToken = jwt.verify(token, jwtSecret);
    if (decodedToken) {
      const query =
        'SELECT u.username, u.email, t.title, t.content, t.user_id FROM users2 u LEFT JOIN tutorials t ON u.id = t.user_id WHERE title IS NOT NULL GROUP BY u.username, u.email, t.title, t.content, t.user_id';
      try {
        const con = await mysql.createConnection(dbConfig);
        const [data] = await con.execute(query);
        await con.end();
        return res.send(data);
      } catch (err) {
        return res.status(500).send({ err });
      }
    }
  } else {
    const query =
      'SELECT u.username, u.email, t.title, t.content, t.user_id FROM users2 u LEFT JOIN tutorials t ON u.id = t.user_id WHERE private = 0 AND title IS NOT NULL GROUP BY u.username, u.email, t.title, t.content, t.user_id';
    try {
      const con = await mysql.createConnection(dbConfig);
      const [data] = await con.execute(query);
      await con.end();
      return res.send(data);
    } catch (err) {
      return res.status(500).send({ err });
    }
  }
});

// POST - post new tutorial for only auth users
router.post('/tutorials', loggedIn, async (req, res) => {
  const { title, content, private } = req.body;
  if (!title || !content || !private) {
    return res.status(400).send({ err: 'Incorrect data passed' });
  }
  try {
    const con = await mysql.createConnection(dbConfig);
    const query = `INSERT INTO tutorials (user_id,title,content,private) VALUES (${mysql.escape(
      req.userData.user_id,
    )}, ${mysql.escape(title)}, ${mysql.escape(content)}, ${mysql.escape(
      private,
    )})`;
    const [data] = await con.execute(query);
    await con.end();
    return res.send(data);
  } catch (err) {
    logger.error(err);
    return res.status(500).send({ err: 'Please try again' });
  }
});

router.get('/test', loggedIn, async (req, res) => {
  console.log(req);
});

module.exports = router;
