exports.success = (res, data, message = 'Success') =>
  res.json({ status: 'success', message, ...data });

exports.error = (res, message, code = 400, errors = null) =>
  res.status(code).json({ status: 'error', message, errors });
