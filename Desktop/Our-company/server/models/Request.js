const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
    default: '',
  },
  projectType: {
    type: String,
    required: [true, 'Project type is required'],
  },
  budget: {
    type: String,
    required: [true, 'Budget range is required'],
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    maxlength: [2000, 'Description max 2000 characters'],
  },
  status: {
    type: String,
    enum: ['new', 'reviewed', 'contacted', 'closed'],
    default: 'new',
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
