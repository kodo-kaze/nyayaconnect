const Log = require('../models/Log');

const auditLogger = (action) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function (data) {
      const logData = {
        userId: req.user ? req.user._id : null,
        action: action,
        caseId: req.params.id || req.body.caseId || null,
        ipAddress: req.ip,
      };

      Log.create(logData).catch(err => console.error('Logging error:', err));
      
      return originalSend.apply(res, arguments);
    };

    next();
  };
};

module.exports = auditLogger;
