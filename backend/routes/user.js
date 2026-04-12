const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { readDB, writeDB } = require('../middleware/db');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// GET /api/user/profile
router.get('/profile', (req, res) => {
  try {
    const db = readDB();
    const user = db.users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const userTodos = db.todos.filter(t => t.userId === req.user.id);
    const completedCount = userTodos.filter(t => t.completed).length;
    const completionRate = userTodos.length > 0
      ? Math.round((completedCount / userTodos.length) * 100)
      : 0;

    const { password, ...userWithoutPassword } = user;
    res.json({
      ...userWithoutPassword,
      stats: {
        total: userTodos.length,
        completed: completedCount,
        pending: userTodos.length - completedCount,
        completionRate
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile.' });
  }
});

// PUT /api/user/profile
router.put('/profile', (req, res) => {
  try {
    const { name, bio, location, timezone } = req.body;
    const db = readDB();
    const userIndex = db.users.findIndex(u => u.id === req.user.id);
    if (userIndex === -1) return res.status(404).json({ message: 'User not found.' });

    if (name) db.users[userIndex].name = name;
    if (bio !== undefined) db.users[userIndex].bio = bio;
    if (location !== undefined) db.users[userIndex].location = location;
    if (timezone !== undefined) db.users[userIndex].timezone = timezone;

    writeDB(db);
    const { password, ...userWithoutPassword } = db.users[userIndex];
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile.' });
  }
});

// PUT /api/user/password
router.put('/password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both passwords required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be 6+ characters.' });
    }

    const db = readDB();
    const userIndex = db.users.findIndex(u => u.id === req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, db.users[userIndex].password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect.' });

    db.users[userIndex].password = await bcrypt.hash(newPassword, 10);
    writeDB(db);
    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating password.' });
  }
});

module.exports = router;
