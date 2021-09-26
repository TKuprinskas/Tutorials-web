const express = require('express');

const router = express.Router();
const mysql = require('mysql2/promise');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const { dbConfig, jwtSecret } = require('../../config');
const logger = require('../../logger');

const userSchema = Joi.object({
  username: Joi.string().min(5).trim(),
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string().min(3).max(15).required(),
});

// Register post
router.post('/register', async (req, res) => {
  let userInput = req.body;
  try {
    userInput = await userSchema.validateAsync(userInput);
  } catch (err) {
    logger.error(err);
    return res.status(400).send({ err: 'Incorrect data passed' });
  }

  const encryptedPassword = bcrypt.hashSync(userInput.password);

  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(
      `INSERT INTO users2 (username,email,password) VALUES ('${userInput.username}','${userInput.email}', '${encryptedPassword}')`,
    );

    await con.end();
    return res.send(data);
  } catch (err) {
    logger.error(err);
    return res.status(500).send({ err: 'Please try again' });
  }
});

// Login post
router.post('/login', async (req, res) => {
  let userInput = req.body;
  try {
    userInput = await userSchema.validateAsync(userInput);
  } catch (err) {
    logger.error(err);
    return res.status(400).send({ err: 'Incorrect email or password' });
  }

  try {
    const con = await mysql.createConnection(dbConfig);
    const [data] = await con.execute(
      `SELECT * FROM users2 WHERE email = '${userInput.email}' LIMIT 1`,
    );
    await con.end();

    const answer = bcrypt.compareSync(userInput.password, data[0].password);

    const token = jwt.sign(
      {
        username: data[0].username,
        user_id: data[0].id,
        email: data[0].email,
      },
      jwtSecret,
    );

    return answer
      ? res.send({ msg: 'You have logged in successfully!', token })
      : res.status(400).send({ err: 'Incorrect email or password' });
  } catch (err) {
    logger.error(err);
    return res.status(500).send({ err: 'Please try again' });
  }
});

// GET - count users records
router.get('/users', async (req, res) => {
  try {
    const con = await mysql.createConnection(dbConfig);
    const query =
      'SELECT u.email, t.title, t.content FROM users2 u LEFT JOIN tutorials t ON u.id = t.user_id GROUP BY u.email, t.title, t.content  ';
    const [data] = await con.execute(query);
    await con.end();
    return res.send(data);
  } catch (err) {
    logger.error(err);
    return res.status(500).send({ err: 'Please try again' });
  }
});

module.exports = router;
