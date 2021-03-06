/**
 * Authentication Routes for /api/auth
 * 
 * Written by Nicholas Cannon
 */
const express = require('express');
const globals = require('../config/globals');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const loggedIn = require('../middleware/auth').loggedIn;

const router = express.Router();

/**
 * Login Route. 
 */
router.post('/login', (req, res, next) => {
  // Check if request is complete
  if (!req.body.password) {
    res.status(400);
    return next(new Error('Please supply a password'));
  }

  // Compare passwords
  bcrypt.compare(req.body.password, globals.admin.password, (err, valid) => {
    if (err) return next(new Error(err));
    
    if (valid) {
      // Password is correct
      const token = jwt.sign({ user: 'admin' }, globals.secret, { expiresIn: '7d' });
      res.status(200).json({ token });
    } else {
      res.status(401).json({ msg: 'Invalid password' });
    }
  });
});

/**
 * Validates a JWT attached to Authorization header.
 */
router.get('/validate', loggedIn, (req, res) => {
  res.status(200).json({ valid: true });
});

module.exports = router;