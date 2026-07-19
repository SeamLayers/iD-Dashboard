/**
 * Phone-number normalization + validation for the dashboard forms.
 *
 * Phone is an OPTIONAL field, so an empty value is valid (e164 = undefined).
 *
 * Saudi mobile numbers are normalized to E.164 (`+9665XXXXXXXX`) so stored
 * values are consistent regardless of how the admin typed them:
 *   05XXXXXXXX · 5XXXXXXXX · 9665XXXXXXXX · +9665XXXXXXXX · 009665XXXXXXXX
 * (spaces, dashes, parentheses and dots are ignored).
 *
 * Any other number already written in international E.164 form (a leading `+`
 * or `00` followed by 8–15 digits) is accepted as-is, so foreign staff aren't
 * wrongly rejected. Everything else is invalid.
 *
 * @param {string} raw
 * @returns {{ valid: boolean, e164: string | undefined }}
 */
export function normalizeSaudiPhone(raw) {
  const trimmed = (raw ?? '').trim();
  if (!trimmed) return { valid: true, e164: undefined };

  const isInternational = trimmed.startsWith('+') || trimmed.startsWith('00');
  let digits = trimmed.replace(/[^\d]/g, '');
  // 00-prefixed international dialing → treat like a leading '+'.
  if (digits.startsWith('00')) digits = digits.slice(2);

  // Saudi national mobile part is 5XXXXXXXX (9 digits, leading 5).
  let national = null;
  if (/^9665\d{8}$/.test(digits)) national = digits.slice(3); // 9665XXXXXXXX
  else if (/^05\d{8}$/.test(digits)) national = digits.slice(1); // 05XXXXXXXX
  else if (/^5\d{8}$/.test(digits)) national = digits; // 5XXXXXXXX
  if (national) return { valid: true, e164: `+966${national}` };

  // Generic international E.164 (only when the user clearly meant international).
  if (isInternational && /^[1-9]\d{7,14}$/.test(digits)) {
    return { valid: true, e164: `+${digits}` };
  }

  return { valid: false, e164: undefined };
}

export default normalizeSaudiPhone;
