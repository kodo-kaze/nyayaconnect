const Log = require('../models/Log');

const auditLog = (action) => async (req, res, next) => {
  const originalJson = res.json;
  res.json = function (data) {
    const logData = {
      userId: req.user ? req.user._id : null,
      action,
      role: req.user ? req.user.role : 'GUEST',
      status: res.statusCode < 400 ? 'SUCCESS' : 'FAILURE',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      details: {
        body: req.body,
        params: req.params,
        response: res.statusCode >= 400 ? data : 'REDACTED'
      }
    };
    Log.create(logData).catch(err => console.error('Audit Log Error:', err));
    return originalJson.call(this, data);
  };
  next();
};

module.exports = auditLog;
