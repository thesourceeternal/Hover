/*
* Tests function functionality
*/

var runTests = function () {

	console.log( "*** Running Unit Tests ***" );
	
	unitTests.testList = [
		// Unlock test has to come before lock test. See notes with func
		unitTests.testPointerUnlock,
		unitTests.testPointerLock
	];

	// Run the first test to start us off
	unitTests.testList[0]();
	// checkResults will finish up for us

}  // end runTests()

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
	checkResults: function ( result ) {

		unitTests.numTestsRun += 1;

		var numTestsRun = unitTests.numTestsRun;
		var totalTests = unitTests.testList.length;
		var testRatio = " (" + numTestsRun + "/" + totalTests + ")";

		// - Handle Current Test - \\
		if ( result !== unitTests.expected ) {

			// Add test to the tally and list of failed tests
			unitTests.numTestsFailed += 1;
			unitTests.testsFailed.push( unitTests.test );
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
			console.log( "Passed: " + unitTests.test + testRatio );

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

			console.log( "Tests failed: " + testsFailed );

			unitTests.endTests();

		} else {

			console.log( "Wait. How were more tests run than there are tests?!" )

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

	// -- Pointer Lock Tests -- \\

	// Because of the way we handle changing pointer lock, every time
	// we change it happens twice, we only want to test one of those times
	// each time we test pointer lock. If this circumstance changes, this
	// will have to be redone
	lockChangeNum: 0,

	// - Unlock Pointer - \\
	// This has to go first because the user has to
	// engage the lock before the tests for the lock can be run
	testPointerUnlock: function () {

		unitTests.test = "pointerLock.unlockPointer";
		unitTests.expected = false

		unitTests.lockChangeNum = 0;

		// Hook pointer lock state change events (event names assigned by browser)
		// specifically to our test function. Will be removed later
		document.addEventListener('pointerlockchange', unitTests.testLock, false);
		document.addEventListener('mozpointerlockchange', unitTests.testLock, false);
		document.addEventListener('webkitpointerlockchange', unitTests.testLock, false);

		pointerLock.unlockPointer();

	},

	// - Lock Pointer - \\
	testPointerLock: function () {

		unitTests.test = "pointerLock.lockPointer";
		unitTests.expected = true;

		unitTests.lockChangeNum = 0;

		pointerLock.lockPointer();

	},  // end testPointerLock()

	testLock: function ( event ) {

		// The pointer lock got changed one more time
		unitTests.lockChangeNum += 1;

		// The second time the pointer lock gets changed
		// (see notes above at lockChangeNum)
		if (unitTests.lockChangeNum > 2) {

			// Get rid of event listeners
			document.removeEventListener('pointerlockchange', unitTests.testLock, false);
			document.removeEventListener('mozpointerlockchange', unitTests.testLock, false);
			document.removeEventListener('webkitpointerlockchange', unitTests.testLock, false);

			console.log("WARNING: The number of consecutive pointer " +
				"lock changes has exceeded 2.\nThe variable unitTests.lockChangeNum " + 
				"has not been reset in some function and effective testing cannot " + 
				"continue.\nPointer lock change event for testing have been removed.")

		} else if (unitTests.lockChangeNum > 1) {

			// Check for locked pointer
			if (document.pointerLockElement === lockElement ||
				document.mozPointerLockElement === lockElement ||
				document.webkitPointerLockElement === lockElement) {  // Locked

				unitTests.errorMsg = "Pointer was locked";
				unitTests.checkResults( true );

			} else {  // Pointer is unlocked

				unitTests.errorMsg = "Pointer was FREE!";
				unitTests.checkResults( false );

			}

		}  // end if lockChangeNum

	},  // end testLock()

}  // end unitTests{}
