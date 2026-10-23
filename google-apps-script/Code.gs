const SPREADSHEET_ID = "1szmwRiZyyxk-2IO2aQKwEfx-WhC0MjaIPkvL2UBpXm8";
const SHEET_NAME = "Waitlist";
const HEADERS = [
  "Email",
  "Joined at (UTC)",
  "Consent at (UTC)",
  "Consent version",
];

function doPost(event) {
  const lock = LockService.getScriptLock();
  try {
    const payload = JSON.parse((event && event.postData && event.postData.contents) || "{}");
    const expectedSecret = PropertiesService.getScriptProperties().getProperty("WAITLIST_SECRET");
    if (!expectedSecret || payload.secret !== expectedSecret) {
      return jsonResponse({ ok: false, error: "unauthorized" });
    }

    const email = String(payload.email || "").trim().toLowerCase();
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ ok: false, error: "invalid_email" });
    }

    lock.waitLock(10000);
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
    ensureHeaders(sheet);

    const duplicate = sheet
      .getRange(2, 1, Math.max(sheet.getLastRow() - 1, 1), 1)
      .getDisplayValues()
      .some(function (row) {
        return String(row[0]).trim().toLowerCase() === email;
      });

    if (!duplicate) {
      const now = new Date().toISOString();
      const safeEmail = /^[=+\-@]/.test(email) ? "'" + email : email;
      sheet.appendRow([
        safeEmail,
        now,
        now,
        String(payload.consentVersion || "2026-10-10"),
      ]);
    }
    return jsonResponse({ ok: true, duplicate: duplicate });
  } catch (error) {
    return jsonResponse({ ok: false, error: "save_failed" });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.autoResizeColumns(1, HEADERS.length);
  }
}

function jsonResponse(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
