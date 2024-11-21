const handleError = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
};

module.exports = { handleError };