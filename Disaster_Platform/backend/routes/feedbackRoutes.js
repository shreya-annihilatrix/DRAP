const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Feedback = require('../models/Feedback');
const Task = require('../models/Task');
const volunteer = require('../models/Volunteer');

// Submit feedback - accessible to everyone
router.post('/submit', async (req, res) => {
  try {
    console.log(req.body);
    const { taskId, volunteerId, adminId, rating, comments, status } = req.body;
    
    // Validate if the task exists and is completed
    const Volunteer = await volunteer.findById(volunteerId);
    if (!Volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    
    if (Volunteer.taskStatus !== 4) { // Assuming 4 is the completed status
      return res.status(400).json({ message: 'Can only provide feedback for completed tasks' });
    }
    
    // Check if feedback already exists for this task
    const existingFeedback = await Feedback.findOne({ taskId });
    if (existingFeedback) {
      // Update existing feedback
      existingFeedback.rating = rating;
      existingFeedback.comments = comments;
      // Only update status if provided
      if (status !== undefined) {
        existingFeedback.status = status;
      }
      await existingFeedback.save();
      
      return res.status(200).json({
        message: 'Feedback updated successfully',
        feedback: existingFeedback
      });
    }
    
    // Create new feedback
    const newFeedback = new Feedback({
      taskId,
      volunteerId,
      adminId,
      rating,
      comments,
      status: status !== undefined ? status : 0 // Default to 0 (not viewed) if not provided
    });
    
    await newFeedback.save();
    
    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: newFeedback
    });
    
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark feedback as viewed (for volunteers)
router.patch('/:feedbackId/view', async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { status } = req.body;
    
    const feedback = await Feedback.findById(feedbackId);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    feedback.status = status;
    await feedback.save();
    
    res.status(200).json({
      message: 'Feedback status updated successfully',
      feedback
    });
    
  } catch (error) {
    console.error('Error updating feedback status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get feedback for a specific task
router.get('/task/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    
    const feedback = await Feedback.findOne({ taskId })
      .populate('volunteerId', 'name email')
      .populate('adminId', 'name email');
    
    if (!feedback) {
      return res.status(404).json({ message: 'No feedback found for this task' });
    }
    
    res.status(200).json(feedback);
    
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all feedback for a volunteer
router.get('/volunteer/:volunteerId', async (req, res) => {
  try {
    const { volunteerId } = req.params;
        //console.log(taskId)
        // console.log(userId)
        const Volunteer = await volunteer.findOne({ userId: volunteerId });
    console.log(Volunteer)
        if (!Volunteer) {
          return res.status(404).json({ message: 'Volunteer not found' });
        }
    
        const feedback = await Feedback.find({ volunteerId: Volunteer._id })
        .populate('taskId', 'taskType description')
      .populate('adminId', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json(feedback);
    
  } catch (error) {
    console.error('Error fetching volunteer feedback:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get average rating for a volunteer
router.get('/volunteer/:volunteerId/rating', async (req, res) => {
  try {
    const { volunteerId } = req.params;
    
    const result = await Feedback.aggregate([
      { $match: { volunteerId: mongoose.Types.ObjectId(volunteerId) } },
      { $group: { 
        _id: null, 
        averageRating: { $avg: '$rating' },
        totalFeedback: { $sum: 1 }
      }}
    ]);
    
    if (result.length === 0) {
      return res.status(200).json({ 
        averageRating: 0, 
        totalFeedback: 0 
      });
    }
    
    res.status(200).json({
      averageRating: result[0].averageRating,
      totalFeedback: result[0].totalFeedback
    });
    
  } catch (error) {
    console.error('Error calculating volunteer rating:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;