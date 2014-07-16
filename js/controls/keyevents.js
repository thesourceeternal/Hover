/* 
* Handles user mouse input events
* There will eventually be a lot of them
*/


keyEvents = function () {

	document.addEventListener('keyup', function () {

		var keyCode = ('which' in event) ? event.which : event.keyCode;
		
		/* ===================================
		   RUNNING TESTS
		   ==================================== */

		// 't'
		if (keyCode === 84) {

			runTests();

		}

		
		/* ===================================
		   UI
		   ==================================== */

		else if (keyCode === 27) {
			// Keyup so it waits till after all other pointer
			// changes have been made
			pointerLock.toggleLock();

		}

	});

};
