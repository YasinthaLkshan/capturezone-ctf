const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Get user progress
router.get('/', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const totalModules = 4;
    const completedCount = user.progress.completedModules.length;
    const completionPercentage = (completedCount / totalModules) * 100;

    // Module completion status
    const moduleStatus = [1, 2, 3, 4].map(moduleId => {
      const completed = user.progress.completedModules.find(
        m => m.moduleId === moduleId
      );
      return {
        moduleId,
        completed: !!completed,
        completedAt: completed?.completedAt || null
      };
    });

    res.json({
      user: {
        username: user.username,
        email: user.email,
        role: user.role
      },
      progress: {
        totalModules,
        completedModules: completedCount,
        completionPercentage: Math.round(completionPercentage),
        totalFlags: user.progress.totalFlags,
        moduleStatus,
        lastActivity: user.updatedAt
      }
    });

  } catch (error) {
    console.error('Progress fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find({ 'progress.totalFlags': { $gt: 0 } })
      .select('username progress.totalFlags progress.completedModules')
      .sort({ 'progress.totalFlags': -1, 'updatedAt': 1 })
      .limit(10);

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      totalFlags: user.progress.totalFlags,
      completedModules: user.progress.completedModules.length,
      lastFlag: user.progress.completedModules.length > 0 
        ? user.progress.completedModules[user.progress.completedModules.length - 1].completedAt
        : null
    }));

    res.json(leaderboard);

  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

module.exports = router;