const normalizeEmail = (email) => {
  const [localPart, domain] = email.split('@');
  const normalizedDomain = domain.toLowerCase();

  // List of providers that ignore dots
  const providersIgnoringDots = ['gmail.com', 'googlemail.com'];

  if (providersIgnoringDots.includes(normalizedDomain)) {
    return localPart.replace(/\./g, '') + '@' + normalizedDomain;
  }

  return email;
};

module.exports = {
  normalizeEmail,
};
