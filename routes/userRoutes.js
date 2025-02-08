const express = require('express');
const { body, param } = require('express-validator');
const { getUsers, addUser, updateUser, deleteUser, checkEmail, checkUsername } = require('../controllers/userController');
const { validate } = require('../middleware/validate');

const router = express.Router();

// GET all users
router.get('/', getUsers);

// POST new user
router.post(
  '/',
  validate([
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
  ]),
  addUser
);

// PUT update user
router.put(
  '/:id',
  validate([
    param('id').isUUID().withMessage('Valid user ID is required'),
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
  ]),
  updateUser
);

// DELETE user
router.delete(
  '/:id',
  validate([param('id').isUUID().withMessage('Valid user ID is required')]),
  deleteUser
);

// Check if username is already taken
router.get('/check-username/:username', checkUsername);

// Check if email is already taken
router.get('/check-email/:email', checkEmail);

module.exports = router;
