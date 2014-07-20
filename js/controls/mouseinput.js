/* 
* Handles user mouse input events
* There will eventually be a lot of them
*/

var mouseEvents = function () {

	// --- Input Elements --- \\
	document.addEventListener( 'click', function (event) {

		var eventTarget = event.target;

		// Button to enter pointer lock
		if ( eventTarget.tagName.toLowerCase() === "button" ) {

			if ( eventTarget.classList.contains("esc-clause") ) {

				displayBlocks.toggleEditor();

			}  // end if .esc-clause

		}  // end if button

	} );


	// --- Intro --- \\
	// When first landing on the site. Escape key works too.
	// This event listener will not be removed, it's too much work for
	// one little event listener
	document.addEventListener( 'click', function () {
		
		// Perhaps put this in display.js
		if ( userState.arrival ) {

			// lockPointer() will hide the intro, turn userState.arrival
			// to false, and lock pointer
			displayBlocks.hideIntro();

		}

	} );

};
