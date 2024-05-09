function geocodeAddresses() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1"); 
  const lastRow = sheet.getLastRow();
  const dataRange = "A2:C" + lastRow; // Define range for addresses
  const latLongRange = "D2:E" + lastRow; // Define range for latitude and longitude
  const values = sheet.getRange(dataRange).getValues();
  const latLongValues = sheet.getRange(latLongRange).getValues();
  const apiKey = 'YOUR_API_KEY'; // Replace YOUR_API_KEY with your actual API key

  for (let i = 0; i < values.length; i++) {
    let fullAddress = values[i][2]; 
    if (!latLongValues[i][0] || !latLongValues[i][1]) { // Check if latitude (column D) and longitude (column E) are not filled
      let geocodeData = getGeocodeData(fullAddress, apiKey);
      if (geocodeData) {
        sheet.getRange(i + 2, 4).setValue(geocodeData.lat); // Sets latitude in column D
        sheet.getRange(i + 2, 5).setValue(geocodeData.lng); // Sets longitude in column E
      } else {
        // Optionally write an error message directly to the sheet
        sheet.getRange(i + 2, 4).setValue("Error: No Results");
        sheet.getRange(i + 2, 5).setValue("Check Address");
      }
    }
  }
}

function getGeocodeData(address, apiKey) {
  const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(address) + '&key=' + apiKey;
  const response = UrlFetchApp.fetch(url);
  const json = JSON.parse(response.getContentText());

  if (json.status === 'OK') {
    const location = json.results[0].geometry.location;
    return {lat: location.lat, lng: location.lng};
  } else {
    console.log('No valid response for address:', address, 'Status:', json.status);
    return null;
  }
}

function findNearestLocations() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const leadsSheet = ss.getSheetByName("Sheet1");
  const targetsSheet = ss.getSheetByName("Sheet2");

  // Fetch leads data, assuming latitude, longitude, nearest city, and distance are in columns D, E, F, and G, respectively
  const leadsRange = leadsSheet.getRange("A2:G" + leadsSheet.getLastRow());
  const leads = leadsRange.getValues();

  // Fetch targets data, assuming latitude and longitude are in columns D and E, respectively
  const targetsRange = targetsSheet.getRange("A2:E" + targetsSheet.getLastRow());
  const targets = targetsRange.getValues();

  // Iterate through each lead and calculate distances to all targets
  leads.forEach((lead, i) => {
    let nearestLocation = lead[5]; // Existing nearest location in column F
    let nearestDistance = lead[6]; // Existing distance in column G

    // Check if nearest location and distance are not already calculated
    if (!nearestLocation || nearestLocation === "" || nearestDistance === "" || isNaN(nearestDistance)) {
      nearestDistance = Infinity; // Reset to calculate anew
      nearestLocation = null;

      // Ensure latitude and longitude are valid numbers before calculating distances
      if (!isNaN(lead[3]) && !isNaN(lead[4])) {
        targets.forEach(target => {
          const distance = calculateHaversine(lead[3], lead[4], target[3], target[4]);
          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestLocation = target[0]; 
          }
        });

        // Set the nearest location and distance in columns F and G of leadsSheet
        leadsSheet.getRange(i + 2, 6).setValue(nearestLocation);
        leadsSheet.getRange(i + 2, 7).setValue(nearestDistance);
      } else {
        // Handle cases where geocode results were errors
        leadsSheet.getRange(i + 2, 6).setValue("Check Address");
        leadsSheet.getRange(i + 2, 7).setValue("Invalid Coordinates");
      }
    }
  });
}


function calculateHaversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}


