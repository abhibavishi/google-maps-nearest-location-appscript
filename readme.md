# README for Google Apps Script Project

## Overview
This project contains a Google Apps Script designed to work with Google Sheets to geocode addresses and find nearest locations using latitude and longitude coordinates. It consists of three main functions:

1. [geocodeAddresses()](file:///Users/abhi/Documents/GitHub/maps-nearest-distance-appscript/appscript.js#1%2C10-1%2C10): Geocodes addresses in "Sheet1" and fills in the latitude and longitude in specified columns.
2. [findNearestLocations()](file:///Users/abhi/Documents/GitHub/maps-nearest-distance-appscript/appscript.js#40%2C10-40%2C10): Finds the nearest locations from "Sheet2" for each entry in "Sheet1" based on the geocoded coordinates.
3. `calculateHaversine(lat1, lon1, lat2, lon2)`: A helper function to calculate the distance between two points on the Earth.

## Setup Instructions

### Preparing Your Google Sheet
1. Create a new Google Sheet or open an existing one.
2. Ensure you have two sheets named "Sheet1" and "Sheet2".
   - "Sheet1" should contain the addresses you wish to geocode. The expected format is addresses in column C, with latitude and longitude to be filled in columns D and E, respectively.
   - "Sheet2" should contain the lookup coordinates with latitude in column D and longitude in column E.

### Adding the Script to Your Google Sheet
1. In your Google Sheet, go to **Extensions > Apps Script**.
2. Delete any code in the script editor and paste the entire script provided.
3. Save the script with a relevant name, e.g., "Geocode and Find Nearest".

### Running the Script
1. Before running the script, replace `'YOUR_API_KEY'` in the `geocodeAddresses` function with your actual Google Maps API key.
2. To geocode addresses in "Sheet1", click on the function name `geocodeAddresses` near the play button in the toolbar of the Apps Script editor, then click the play button to run it.
3. After geocoding is complete, you can run the `findNearestLocations` function by selecting it in the same way and clicking the play button. This will populate "Sheet1" with the nearest locations from "Sheet2".

### Permissions
The first time you run the script, Google will prompt you to authorize the script to access your Google Sheet data. Follow the on-screen instructions to grant the necessary permissions.

## Important Notes
- Ensure that your Google Sheets API and Google Maps Geocoding API are enabled in your Google Cloud Platform project.
- Be mindful of the Google Maps API usage limits and billing settings to avoid unexpected charges.

## Troubleshooting
- If you encounter errors related to API limits or permissions, check your Google Cloud Platform project settings.
- Ensure that the column and sheet names in the script match those in your Google Sheet.

This script automates the process of geocoding addresses and finding the nearest locations, streamlining tasks that would otherwise require manual calculations or external tools.