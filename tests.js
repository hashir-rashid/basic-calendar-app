// ====== Calendar Application Test Suite ======
// This file contains test cases for the calendar application functionality

/**
 * Main test runner function that executes all test groups
 * Expected output: 
 * - Logs "=== Running Calendar Application Tests ===" at start
 * - Logs each test group's results
 * - Logs "=== ALL TESTS PASSED ===" if all succeed
 * - Logs error message if any test fails
 * - Restores original application state when finished
 */
function runTests() {
    console.log("=== Running Calendar Application Tests ===");
    
    // Store original state to restore after tests
    const originalBookings = [...bookings];
    const originalLocalStorage = localStorage.getItem("save");
    
    try {
      // Execute test groups
      testInitialization();
      testDateNavigation();
      testBookingFunctionality();
      testLocalStorage();
      
      console.log("=== ALL TESTS PASSED ===");
    } catch (error) {
      console.error("=== TEST FAILED ===");
      console.error(error);
    } finally {
      // Cleanup: Restore original state
      bookings = originalBookings;
      if (originalLocalStorage) {
        localStorage.setItem("save", originalLocalStorage);
      } else {
        localStorage.removeItem("save");
      }
      
      // Refresh calendar display
      clearCalendarRows(tableBody);
      fillCalendarNums(tableBody, currentYear, currentMonth);
    }
  }
  
  /**
   * Tests calendar initialization
   * Verifies:
   * 1. Header displays current month/year correctly
   * 2. Month dropdown is set to current month
   * 3. Year input is set to current year
   * Expected output:
   * - "Initialization tests passed" if all checks succeed
   * - Error message if any check fails
   */
  function testInitialization() {
    console.group("Testing Initialization");
    
    const currentDate = new Date();
    const expectedMonth = months[currentDate.getMonth()];
    const expectedYear = currentDate.getFullYear();
    
    // Test header display
    const headerText = document.getElementById("month_name_display").textContent;
    if (!headerText.includes(expectedMonth)) {
      throw new Error(`Initial month display failed. Expected ${expectedMonth}, got ${headerText}`);
    }
    if (!headerText.includes(expectedYear)) {
      throw new Error(`Initial year display failed. Expected ${expectedYear}, got ${headerText}`);
    }
    
    // Test dropdown initialization
    const dropdownMonth = document.getElementById("month_name_dropdown").value;
    const inputYear = document.getElementById("input_year").value;
    
    if (dropdownMonth !== expectedMonth) {
      throw new Error(`Month dropdown initialization failed. Expected ${expectedMonth}, got ${dropdownMonth}`);
    }
    
    if (parseInt(inputYear) !== expectedYear) {
      throw new Error(`Year input initialization failed. Expected ${expectedYear}, got ${inputYear}`);
    }
    
    console.log("Initialization tests passed");
    console.groupEnd();
  }
  
  /**
   * Tests month/year navigation functionality
   * Verifies:
   * 1. Calendar updates correctly when changing to January 2023
   * 2. Calendar updates correctly when changing to December 2025
   * Expected output:
   * - "Date navigation tests passed" if both changes work
   * - Error message if any navigation fails
   */
  function testDateNavigation() {
    console.group("Testing Date Navigation");
    
    // Test navigation to January 2023
    document.getElementById("month_name_dropdown").selectedIndex = 0;
    document.getElementById("input_year").value = 2023;
    document.getElementById("submit_date").click();
    
    const headerText = document.getElementById("month_name_display").textContent;
    if (headerText !== "January, 2023") {
      throw new Error(`Date navigation failed. Expected "January, 2023", got "${headerText}"`);
    }
    
    // Test navigation to December 2025
    document.getElementById("month_name_dropdown").selectedIndex = 11;
    document.getElementById("input_year").value = 2025;
    document.getElementById("submit_date").click();
    
    const newHeaderText = document.getElementById("month_name_display").textContent;
    if (newHeaderText !== "December, 2025") {
      throw new Error(`Date navigation failed. Expected "December, 2025", got "${newHeaderText}"`);
    }
    
    console.log("Date navigation tests passed");
    console.groupEnd();
  }
  
  /**
   * Tests booking functionality
   * Verifies:
   * 1. Can add a booking to a date cell
   * 2. Duplicate dates are handled properly (only one entry per date)
   * 3. Can delete a booking
   * Expected output:
   * - "Booking functionality tests passed" if all operations work
   * - Error message if any booking operation fails
   */
  function testBookingFunctionality() {
    console.group("Testing Booking Functionality");
    
    // Set to known month/year for consistent testing
    currentYear = 2023;
    currentMonth = 0; // January
    clearCalendarRows(tableBody);
    fillCalendarNums(tableBody, currentYear, currentMonth);
    
    // Get first day cell for testing
    const dayCells = document.querySelectorAll(".day_of_month");
    if (dayCells.length === 0) {
      throw new Error("No day cells found for booking tests");
    }
    
    const testCell = dayCells[0];
    const testDate = "2023-1-1";
    const testReason = "Test booking";
    
    // Test adding a booking
    testCell.click();
    document.getElementById("reason-text").value = testReason;
    document.getElementById("submit_booking").click();
    
    // Verify booking was added
    if (!testCell.classList.contains("table-info")) {
      throw new Error("Booking did not apply table-info class to cell");
    }
    
    if (testCell.children[0].textContent !== testReason) {
      throw new Error(`Booking reason not displayed. Expected "${testReason}", got "${testCell.children[0].textContent}"`);
    }
    
    // Test duplicate date handling
    const originalLength = bookings.length;
    testCell.click();
    document.getElementById("reason-text").value = "Duplicate test";
    document.getElementById("submit_booking").click();
    
    if (bookings.length !== originalLength) {
      throw new Error(`Duplicate handling failed. Expected ${originalLength} bookings, got ${bookings.length}`);
    }
    
    // Test deleting a booking
    testCell.click();
    document.getElementById("delete_booking").click();
    
    if (testCell.classList.contains("table-info")) {
      throw new Error("Delete booking failed - cell still has table-info class");
    }
    
    if (testCell.children[0].textContent !== "") {
      throw new Error("Delete booking failed - reason text not cleared");
    }
    
    console.log("Booking functionality tests passed");
    console.groupEnd();
  }
  
  /**
   * Tests localStorage functionality
   * Verifies:
   * 1. Data can be saved to localStorage
   * 2. Data can be retrieved from localStorage
   * 3. Retrieved data matches what was stored
   * Expected output:
   * - "Local storage tests passed" if all operations work
   * - Error message if any storage operation fails
   */
  function testLocalStorage() {
    console.group("Testing Local Storage");
    
    // Start with clean storage
    localStorage.removeItem("save");
    
    // Test saving to localStorage
    bookings = [["2023-1-1", "Storage test"]];
    storeBookings(bookings);
    
    const storedData = localStorage.getItem("save");
    if (!storedData) {
      throw new Error("storeBookings failed - nothing saved to localStorage");
    }
    
    // Test retrieving from localStorage
    const retrieved = retrieveBookings();
    if (!retrieved || retrieved.length !== 1) {
      throw new Error(`retrieveBookings failed. Expected 1 booking, got ${retrieved ? retrieved.length : 0}`);
    }
    
    if (retrieved[0][0] !== "2023-1-1" || retrieved[0][1] !== "Storage test") {
      throw new Error(`retrieveBookings returned incorrect data. Expected ["2023-1-1", "Storage test"], got ${JSON.stringify(retrieved[0])}`);
    }
    
    console.log("Local storage tests passed");
    console.groupEnd();
  }