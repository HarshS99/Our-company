const Request = require('../models/Request');
const sendEmail = require('../utils/sendEmail');

// @desc    Submit a project request (public)
// @route   POST /api/requests
// @access  Public
const createRequest = async (req, res, next) => {
  try {
    const request = await Request.create(req.body);

    // Send email notification to admin
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `🚀 New Project Request from ${request.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #6366f1;">New Project Request — DevMarket</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; font-weight: bold;">Name:</td><td style="padding: 8px;">${request.name}</td></tr>
              <tr style="background: #f9fafb;"><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${request.email}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${request.phone || 'N/A'}</td></tr>
              <tr style="background: #f9fafb;"><td style="padding: 8px; font-weight: bold;">Project Type:</td><td style="padding: 8px;">${request.projectType}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Budget:</td><td style="padding: 8px;">${request.budget}</td></tr>
              <tr style="background: #f9fafb;"><td style="padding: 8px; font-weight: bold;">Description:</td><td style="padding: 8px;">${request.description}</td></tr>
            </table>
            <p style="margin-top: 20px; color: #6b7280;">Submitted at: ${new Date().toLocaleString()}</p>
            <a href="${process.env.CLIENT_URL}/admin" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background: #6366f1; color: white; border-radius: 6px; text-decoration: none;">View in Dashboard</a>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('Email notification failed:', emailErr.message);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Your request has been submitted! We will contact you soon.',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all requests (admin)
// @route   GET /api/requests
// @access  Private
const getRequests = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Request.countDocuments(query);
    const requests = await Request.find(query)
      .populate('project', 'title slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: requests.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      data: requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single request
// @route   GET /api/requests/:id
// @access  Private
const getRequest = async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id).populate('project', 'title slug');
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });
    res.json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

// @desc    Update request status
// @route   PATCH /api/requests/:id/status
// @access  Private
const updateRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });
    res.json({ success: true, message: 'Status updated.', data: request });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete request
// @route   DELETE /api/requests/:id
// @access  Private
const deleteRequest = async (req, res, next) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });
    res.json({ success: true, message: 'Request deleted.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createRequest, getRequests, getRequest, updateRequestStatus, deleteRequest };
