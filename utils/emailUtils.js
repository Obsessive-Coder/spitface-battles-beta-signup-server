const normalizeEmail = email => {
  const [localPart, domain] = email.split('@');
  const normalizedDomain = domain.toLowerCase();

  // List of providers that ignore dots
  const providersIgnoringDots = ['gmail.com', 'googlemail.com'];

  if (providersIgnoringDots.includes(normalizedDomain)) {
    return localPart.replace(/\./g, '') + '@' + normalizedDomain;
  }

  return email;
};

const validateUsername = username => {
  const response = { isValid: true, message: "Valid username." };

  // Check for valid characters (letters, numbers, _.-')
  const validCharacters = /^[a-zA-Z0-9._'-]+$/;
  if (!validCharacters.test(username)) {
    response.isValid = false;
    response.message = "Username can only contain letters, numbers, and the characters: _ . ' -";
  }

  // Check for consecutive spaces or special characters
  if (/( {2,}|[-'._]{2,})/.test(username)) {
    response.isValid = false;
    response.message = "No consecutive spaces or special characters are allowed.";
  }

  // Check length (between 3 and 22 characters)
  if (username.length < 3 || username.length > 22) {
    response.isValid = false;
    response.message = "Username must be between 3 and 22 characters.";
  }

  return response;
};

const validateEmail = email => {
  const response = { isValid: true, message: "Valid email address." };

  // Regular expression for validating an email address
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  // Check if the email matches the general pattern
  if (!emailRegex.test(email)) {
    response.isValid = false;
    response.message = "Please enter a valid email address.";
  }

  // Check if the email is too short or too long (basic limits)
  if (email.length < 5 || email.length > 100) {
    response.isValid = false;
    response.message = "Email must be between 5 and 100 characters.";
  }

  return response;
};

module.exports = {
  normalizeEmail,
  validateUsername,
  validateEmail
};
