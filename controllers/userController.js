const db = require('../db/connection');
const { normalizeEmail, validateUsername, validateEmail } = require('../utils/emailUtils');

// Fetch all users
const getUsers = async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT id, username, email FROM users');
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// Add a new user
const addUser = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    const normalizedEmail = normalizeEmail(email);

    const { isValid: isUsernameValid = false, message: usernameMessage = '' } = validateUsername(username);
    const { isValid: isEmailValid = false, message: emailMessage = '' } = validateEmail(normalizedEmail);

    console.log('Username: ', isUsernameValid, usernameMessage);
    console.log('Email: ',  isEmailValid, emailMessage);

    // Check for existing username or email
    const [existingUser] = await db.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, normalizedEmail]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        error: 'Username or email already exists',
      });
    }

    // Insert new user
    const [result] = await db.query('INSERT INTO users (username, email) VALUES (?, ?)', [username, normalizedEmail]);

    res.status(201).json({
      id: result.insertId,
      username,
      normalizedEmail,
    });
  } catch (error) {
    next(error);
  }
};


// Update an existing user
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;
    await db.query('UPDATE users SET username = ?, email = ? WHERE id = ?', [username, email, id]);
    res.json({ id, username, email });
  } catch (error) {
    next(error);
  }
};

// Delete a user
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Check if a username is already taken
const checkUsername = async (req, res, next) => {
  try {
    const { username } = req.params;

    const [result] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    if (result.length > 0) {
      return res.status(200).json({ exists: true });
    }

    res.status(200).json({ exists: false });
  } catch (error) {
    next(error);
  }
};

// Check if an email is already taken
const checkEmail = async (req, res, next) => {
  try {
    const { email } = req.params;
    const normalizedEmail = normalizeEmail(email);

    const [result] = await db.query('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
    if (result.length > 0) {
      return res.status(200).json({ exists: true });
    }

    res.status(200).json({ exists: false });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, addUser, updateUser, deleteUser, checkEmail, checkUsername };
