const SPREADSHEET_ID = "1lz6zQG3mTjysldO6NxCw-uWM3ybZVTHtoS1N6y-_wQw"; // Ensure this is your actual Spreadsheet ID

function doPost(e) {
  try {
    let payloadStr = e.parameter.payload;
    if (!payloadStr && e.postData && e.postData.contents) {
      payloadStr = e.postData.contents;
    }
    
    if (!payloadStr) {
      throw new Error("No payload found");
    }

    const payload = JSON.parse(payloadStr);

    // Determine if the payload is an RSVP or a Wish
    if (payload.attendance !== undefined) {
      handleRSVP(payload);
    } else {
      handleWishes(payload);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleRSVP(payload) {
  const sheetName = "RSVP";
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(sheetName);

  // If the sheet doesn't exist, create it and set the headers
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    const headers = [
      "Submitted At", "Attendance", "Party Type", "Total Guest Count",
      "Guest 1 Name", "Guest 1 Meal", "Guest 2 Name", "Guest 2 Meal",
      "Guest 3 Name", "Guest 3 Meal", "Guest 4 Name", "Guest 4 Meal",
      "Guest 5 Name", "Guest 5 Meal"
    ];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  // Format the data to append
  const rowData = [
    payload.submittedAt || new Date().toISOString(),
    payload.attendance,
    payload.partyType,
    payload.guestCount
  ];

  // Append guest details
  if (payload.guests && Array.isArray(payload.guests)) {
    payload.guests.forEach(guest => {
      rowData.push(guest.name || "");
      rowData.push(guest.meal || "");
    });
  }

  sheet.appendRow(rowData);
}

function handleWishes(payload) {
  const sheetName = "Wishes";
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(sheetName);

  // If the sheet doesn't exist, create it and set the headers
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    const headers = [
      "Submitted At", "Name", "Message"
    ];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  // Format the data to append
  const rowData = [
    payload.submittedAt || new Date().toISOString(),
    payload.name || "Anonymous",
    payload.message || payload.wish || ""
  ];

  sheet.appendRow(rowData);
}

// Function to handle CORS preflight requests
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}
