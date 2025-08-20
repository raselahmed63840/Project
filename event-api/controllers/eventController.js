const { validationResult } = require('express-validator');
const Event = require('../models/Event');


// POST /api/events (creator only)
async function createEvent(req, res) {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });


const { title, description, date, time, location, organizerName } = req.body;
const event = await Event.create({
title,
description,
date,
time,
location,
organizerName,
eventBanner: req.file ? `/uploads/${req.file.filename}` : undefined,
user: req.user._id,
});
res.status(201).json(event);
}


// GET /api/events
async function getEvents(req, res) {
const events = await Event.find().sort({ createdAt: -1 }).populate('user', 'name email');
res.json(events);
}


// GET /api/events/:id
async function getEvent(req, res) {
const event = await Event.findById(req.params.id).populate('user', 'name email');
if (!event) return res.status(404).json({ message: 'Event not found' });
res.json(event);
}


// PATCH /api/events/:id (only creator)
async function updateEvent(req, res) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // check if logged in user is the creator
    if (event.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    // updatable fields
    const fields = ['title', 'description', 'date', 'time', 'location', 'organizerName'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) {
        event[f] = req.body[f];
      }
    });

    // if new banner uploaded
    if (req.file) {
      event.eventBanner = `/uploads/${req.file.filename}`;
    }

    const updated = await event.save();
    res.json(updated);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
}
