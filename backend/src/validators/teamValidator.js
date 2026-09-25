// ─── Team Validator ───────────────────────────────────────────────────────────

function validateCreateTeam(body) {
  const errors = [];
  const { teamName, college, department, problemStatement, leaderName, leaderEmail, maxMembers } = body;

  if (!teamName?.trim() || teamName.trim().length < 3) errors.push('teamName is required (min 3 chars).');
  if (!college?.trim())   errors.push('college is required.');
  if (!department?.trim()) errors.push('department is required.');
  if (!problemStatement?.trim()) errors.push('problemStatement is required.');
  if (!leaderName?.trim()) errors.push('leaderName is required.');
  if (!leaderEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leaderEmail)) errors.push('A valid leaderEmail is required.');
  if (![2, 3, 4].includes(Number(maxMembers))) errors.push('maxMembers must be 2, 3, or 4.');

  return errors;
}

function validateJoinTeam(body) {
  const errors = [];
  const { teamCode, name, college, department } = body;
  if (!teamCode?.trim()) errors.push('teamCode is required.');
  if (!name?.trim())     errors.push('name is required.');
  if (!college?.trim())  errors.push('college is required.');
  if (!department?.trim()) errors.push('department is required.');
  return errors;
}

module.exports = { validateCreateTeam, validateJoinTeam };
