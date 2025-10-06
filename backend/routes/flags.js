const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Validate flag submission
router.post('/validate', async (req, res) => {
  try {
    const { flag, moduleId } = req.body;
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Define correct flags with fallback defaults
    const correctFlags = {
      1: process.env.FLAG_MODULE_1 ? 
         Buffer.from(process.env.FLAG_MODULE_1, 'base64').toString() : 
         'CYBER{x55_1n_f33db4ck_p0rt4l}',
      2: process.env.FLAG_MODULE_2 ? 
         Buffer.from(process.env.FLAG_MODULE_2, 'base64').toString() : 
         'CYBER{55rf_3xpl01t_5ucc355}',
      3: process.env.FLAG_MODULE_3 ? 
         Buffer.from(process.env.FLAG_MODULE_3, 'base64').toString() : 
         'CYBER{br0k3n_4uth_byp455}',
      4: process.env.FLAG_MODULE_4 ? 
         Buffer.from(process.env.FLAG_MODULE_4, 'base64').toString() : 
         'CYBER{n05ql_1nj3ct10n_pwn3d}'
    };

    const correctFlag = correctFlags[moduleId];
    
    if (!correctFlag) {
      return res.status(400).json({ error: 'Invalid module ID' });
    }

    if (flag.trim() === correctFlag) {
      // Check if already completed
      const alreadyCompleted = user.progress.completedModules.some(
        module => module.moduleId === parseInt(moduleId)
      );

      if (!alreadyCompleted) {
        // Add to completed modules
        user.progress.completedModules.push({
          moduleId: parseInt(moduleId),
          completedAt: new Date(),
          flag: flag
        });
        user.progress.totalFlags += 1;
        await user.save();
      }

      res.json({
        success: true,
        message: 'Correct flag! Module completed.',
        moduleId: moduleId,
        alreadyCompleted
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Incorrect flag. Try again!',
        hint: 'Make sure you\'ve successfully exploited the vulnerability.'
      });
    }

  } catch (error) {
    console.error('Flag validation error:', error);
    res.status(500).json({ error: 'Flag validation failed' });
  }
});

// Get user's found flags
router.get('/user', async (req, res) => {
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

    res.json({
      totalFlags: user.progress.totalFlags,
      completedModules: user.progress.completedModules,
      completionRate: (user.progress.totalFlags / 4) * 100
    });

  } catch (error) {
    console.error('Get flags error:', error);
    res.status(500).json({ error: 'Failed to get user flags' });
  }
});

module.exports = router;