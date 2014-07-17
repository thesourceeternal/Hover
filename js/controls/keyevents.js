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
		// 't'
		if ( keyCode === 84 ) {

			runTests();

		}

		
		/* ===================================
		   UI
		   ==================================== */
		else if ( keyCode === 27 ) {
			// Keyup so it waits till after all other pointer
			// changes have been made
			pointerLock.toggleLock();

			// Perhaps put this in display.js
			if ( userStates.arrival ) {

				pointerLock.lockPointer();

				// Hide the intro
				// Perhaps remove instead
				document.getElementsByClassName( "intro" )[0].style.display = 'none';

				// Hide the majority element

				// Show inspector stuff


				// Don't do this again till they next land
				userStates.arrival = false;

			}

		}

	} );

};
