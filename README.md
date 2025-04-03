# basic-calendar-app
Basic calendar app created for Principles of Software Engineering

## How to use:
- run calendar.html ensuring icon.jpg, script.js, and styles.css are all in the same directory

## Testing
- Date ranges can be input using the dropdown and number inputs to search a specific month and year
- Events can be added by clicking on a cell and filling in the necessary information as asked by the popup modal
- Events can be deleted by clicking an event and selecting "delete"
- All data is saved through localStorage and persists upon page refresh
 - To check bookings, enter `bookings` into the console at anytime to view the bookings array (this is the local version prior to JSON conversion and saving)
 - Save data can be checked in the "Application" window in the developer tools menu
- To check test cases, run the following command in the developer tools console: `runTests()`
 - All tests should PASS
