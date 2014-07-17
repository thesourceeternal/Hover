/* 
* Handles user mouse input events
* There will eventually be a lot of them
*/


keyEvents = function () {

	document.addEventListener( 'keyup', function () {

		var keyCode = ( 'which' in event ) ? event.which : event.keyCode;
		
		/* ===================================
		   RUNNING TESTS
		   ==================================== */
		if ( keyCode === userState.preferences.hotkeys.test[2] ) {

			if (pointerLock.isLocked) {

				runTests();

			} else {  // the user may have not engaged pointerlock
				// so pointerlock tests can't run properly,
				// will give incorrect results
				console.log("Warning: Pressing 't' for tests is only " +
					"for use while pointer is locked. Using it while " +
					"pointer is unlocked may cause errors in testing.")
			}

		}

		
		/* ===================================
		   UI
		   ==================================== */
		else if ( keyCode === userState.preferences.hotkeys.pointerLock[2] ) {

			// Keyup so it waits till after all other pointer
			// changes have been made
			pointerLock.toggleLock();
			// lockPointer() should take care of the user's arrival

		}

	} );

};
