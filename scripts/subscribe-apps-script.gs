/**
 * Subscriber capture endpoint — already pointed at the "BJBS Subscribers" sheet.
 *
 * Setup (2 minutes):
 * 1. Go to script.google.com/create (signed in as the account that owns the sheet)
 * 2. Delete the placeholder code, paste this entire file
 * 3. Deploy > New deployment > gear icon > Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Authorize when prompted, then copy the web app URL (ends in /exec)
 */
var SHEET_ID = '1TkIe5_xeP4F1j2OjWPOl3K75RclLxWLFGqabLDoGy9I';

function doPost(e) {
  var sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  var email = (e.parameter.email || '').trim();
  if (email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    sheet.appendRow([email, new Date()]);
  }
  return ContentService.createTextOutput('ok');
}
