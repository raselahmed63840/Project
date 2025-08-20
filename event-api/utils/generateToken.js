const mongoose = require('mongoose');




const eventSchema = new mongoose.Schema(
{
title: { type: String, required: true, trim: true },
description: { type: String, required: true },
date: { type: String, required: true }, // ISO date string (YYYY-MM-DD)
time: { type: String, required: true }, // e.g., 18:30
location: { type: String, required: true },
organizerName: { type: String, required: true },
eventBanner: { type: String }, // file path / URL
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
},
{ timestamps: true }
);




module.exports = mongoose.model('Event', eventSchema);