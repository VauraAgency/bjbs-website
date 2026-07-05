/**
 * Subscriber capture endpoint — paste into Google Apps Script (script.google.com).
 *
 * Setup (2 minutes):
 * 1. Create a Google Sheet named "BJBS Subscribers" with headers: Email | Date
 * 2. In the sheet: Extensions > Apps Script, paste this file's contents
 * 3. Deploy > New deployment > Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the web app URL (ends in /exec) and put it in js/main.js as SHEETS_ENDPOINT
 */
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var email = (e.parameter.email || '').trim();
  if (email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    sheet.appendRow([email, new Date()]);
  }
  return ContentService.createTextOutput('ok');
}
