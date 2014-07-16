/*
* Tests function functionality
*/

runTests = function () {

	console.log("*** Running Unit Tets ***");
	
	unitTests.testList = [
		// Unlock test has to come first. See notes with func
		unitTests.testPointerUnlock,
		unitTests.testPointerLock
	];

	// Run the first test to start us off
	unitTests.testList[0]();
	// checkResults will finish up for us

}

unitTests = {

	test: null,
	expected: null,
	// actual result will be passed in to checkResults()
	errorMsg: null,

	testList: [],

	numTestsRun: 0,
	numTestsFailed: 0,
	testsFailed: [],


	/* ===================================
	   Functions
	   ==================================== */

	// --- TEST RESULTS --- \\

	// Tests all the expected results agains the actual results
	// Runs the next test
	checkResults: function (result) {

		unitTests.numTestsRun += 1;

		var numTestsRun = unitTests.numTestsRun;
		var totalTests = unitTests.testList.length;
		var testRatio = " (" + numTestsRun + "/" + totalTests + ")";

		// - Test Message  (for each individual test) - \\
		if ( result !== unitTests.expected ) {

			unitTests.numTestsFailed += 1;
			unitTests.testsFailed.push(unitTests.test);
			// Print the name of the test that was failed
			console.log( "Failed: " + unitTests.test + testRatio );

			// Print an error message if there is one
			if ( unitTests.errorMsg ) {

				console.log( "Error: " + unitTests.errorMsg );
				// Clear the error message for the next one
				unitTests.errorMsg = null;

			}

		} else {
			// Do we really want a message for passed tests?
			console.log("Passed: " + unitTests.test + testRatio);

		}

		// - Fininsh or Continue Tests - \\
		// Run the next test if any remain
		if ( numTestsRun < totalTests ) {

			// numTestsRun is 1 more than the index of the tests just run
			unitTests.testList[numTestsRun]();

		} else if ( numTestsRun === totalTests ) {
		// If all the tests have been run, print how many tests failed

			var numTestsFailed = unitTests.numTestsFailed

			console.log( "*** Testing Completed ***" );
			console.log( "Number of tests passed: " + (numTestsRun - numTestsFailed) );
			console.log( "Number of tests failed: " + numTestsFailed );

			// Print list of failed tests
			var testsFailed = unitTests.testsFailed;
			if ( testsFailed.length <= 0 ) {

				testsFailed = "none";

			}

			console.log("Tests failed: " + testsFailed);

			unitTests.endTests();

		} else {

			console.log("Wait. How were more tests run than there are tests?!")

		}  // end if numTestsRun

	},  // end checkResults()

	// Get rid of all the event listeners and stuff
	endTests: function () {

		// Get rid of event listeners
		document.removeEventListener('pointerlockchange', unitTests.testLock, false);
		document.removeEventListener('mozpointerlockchange', unitTests.testLock, false);
		document.removeEventListener('webkitpointerlockchange', unitTests.testLock, false);

	},


	// --- TESTS --- \\

	// -- Pointer Tests -- \\
	// - Unlock Pointer - \\
	// This has to go first because the user has to
	// engage the lock before the tests for the lock can be run
	testPointerUnlock: function () {

		unitTests.test = "pointerLock.unlockPointer";
		unitTests.expected = false

		// Test to be written later, just setting up the lock test

		pointerLock.unlockPointer();
		window.setTimeout( unitTests.checkResults, 500, false );

	},

	// - Lock Pointer - \\
	testPointerLock: function () {

		unitTests.test = "pointerLock.lockPointer";
		unitTests.expected = true;

		// Hook pointer lock state change events (event names assigned by browser)
		document.addEventListener('pointerlockchange', unitTests.testLock, false);
		document.addEventListener('mozpointerlockchange', unitTests.testLock, false);
		document.addEventListener('webkitpointerlockchange', unitTests.testLock, false);

		pointerLock.lockPointer();

	},  // end testPointerLock()

	testLock: function (event) {
		// Check for locked pointer
		if (document.pointerLockElement === lockElement ||
			document.mozPointerLockElement === lockElement ||
			document.webkitPointerLockElement === lockElement) {  // Locked

			unitTests.errorMsg = "Pointer was locked";
			unitTests.checkResults(true);

		} else {  // Pointer is unlocked

			unitTests.errorMsg = "Pointer was FREE!";
			unitTests.checkResults(false);

		}
	},  // end testLock()

}
