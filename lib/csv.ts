/** RFC 4180 CSV assembly with a spreadsheet formula-injection guard. */

const FORMULA_PREFIX = /^[=+\-@\t\r]/;

export function csvCell(raw: string | null | undefined): string {
  if (raw == null || raw === "") return "";
  // OWASP guard: a leading = + - @ tab or CR is a formula to Excel and
  // Sheets. The apostrophe costs a literal quote on "+1 415..." phone
  // numbers; that is the standard, accepted trade.
  const guarded = FORMULA_PREFIX.test(raw) ? `'${raw}` : raw;
  return /[",\n\r]/.test(guarded)
    ? `"${guarded.replaceAll('"', '""')}"`
    : guarded;
}

export function csvDocument(
  header: string[],
  rows: (string | null | undefined)[][],
): string {
  const lines = [header, ...rows].map((cells) => cells.map(csvCell).join(","));
  // CRLF per RFC 4180; the leading BOM makes Excel detect UTF-8.
  return "\uFEFF" + lines.join("\r\n") + "\r\n";
}
