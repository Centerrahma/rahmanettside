/**
 * Validates a Norwegian fødselsnummer (or D-nummer) using the two
 * mod-11 control digits. Accepts an 11-digit string with no separators.
 */
export function isValidFodselsnummer(fnr: string): boolean {
  if (!/^\d{11}$/.test(fnr)) return false;

  // The first six digits are DDMMYY. D-nummer adds 40 to the day and
  // H-nummer adds 40 to the month. Degenerate inputs like all zeros
  // satisfy the mod-11 checks below, so the date part must be checked too.
  const rawDay = Number(fnr.slice(0, 2));
  const rawMonth = Number(fnr.slice(2, 4));
  const day = rawDay > 40 ? rawDay - 40 : rawDay;
  const month = rawMonth > 40 ? rawMonth - 40 : rawMonth;
  if (day < 1 || day > 31 || month < 1 || month > 12) return false;

  const digits = fnr.split('').map(Number);

  // Control digit 1 (position 10)
  const weights1 = [3, 7, 6, 1, 8, 9, 4, 5, 2];
  let sum1 = 0;
  for (let i = 0; i < 9; i++) {
    sum1 += digits[i] * weights1[i];
  }
  const remainder1 = sum1 % 11;
  const control1 = remainder1 === 0 ? 0 : 11 - remainder1;
  if (control1 === 11 || control1 !== digits[9]) return false;

  // Control digit 2 (position 11)
  const weights2 = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  let sum2 = 0;
  for (let i = 0; i < 10; i++) {
    sum2 += digits[i] * weights2[i];
  }
  const remainder2 = sum2 % 11;
  const control2 = remainder2 === 0 ? 0 : 11 - remainder2;
  if (control2 === 11 || control2 !== digits[10]) return false;

  return true;
}
