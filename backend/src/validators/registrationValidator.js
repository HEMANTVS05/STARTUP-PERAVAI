// ─── Registration Validator ───────────────────────────────────────────────────
// Every field that arrives at POST /api/registrations is validated here.
// Never trust frontend-supplied data (spec §22).
// ─────────────────────────────────────────────────────────────────────────────

function validateRegistration(body) {
  const errors = [];
  const { role, name, email, phone, location } = body;

  if (!['student', 'startup'].includes(role)) {
    errors.push('role must be "student" or "startup".');
  }
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('name is required (min 2 characters).');
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('A valid email is required.');
  }
  if (!phone || !/^\+?[\d\s\-]{7,15}$/.test(phone.replace(/\s/g, ''))) {
    errors.push('A valid phone number is required.');
  }
  if (!location || location.trim().length < 2) {
    errors.push('location (city) is required.');
  }

  if (role === 'student') {
    if (!body.college?.trim()) errors.push('college is required for students.');
    if (!body.year?.trim())    errors.push('year is required for students.');
    if (!body.department?.trim()) errors.push('department is required for students.');
  }

  if (role === 'startup') {
    if (!body.companyName?.trim()) errors.push('companyName is required for startup owners.');
  }

  return errors;
}

module.exports = { validateRegistration };
