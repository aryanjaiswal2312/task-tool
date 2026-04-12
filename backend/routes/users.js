const express = require('express');
const router = express.Router();
const { readDB } = require('../middleware/db');

/** GET /api/users — list all registered users (no passwords). For local dev / inspection. */
router.get('/', (req, res) => {
  try {
    const db = readDB();
    const users = db.users.map(({ password: _, ...user }) => user);
    res.json({ count: users.length, users });
  } catch (e) {
    res.status(500).json({ message: 'Could not read users.' });
  }
});

module.exports = router;
