/* 
* Handles user mouse input events
* There will eventually be a lot of them
*/

var mouseEvents = function () {

	// --- Input Elements --- \\
	document.addEventListener( 'click', function (event) {

		var eventTarget = event.target;

			if ( eventTarget.classList.contains("esc-clause") ) {

				displayBlocks.toggleEditor();

			}  // end if .esc-clause

	} );


	// --- Intro --- \\
	// When first landing on the site. Escape key works too.
	// This event listener will not be removed, it's too much work for
	// one little event listener
	document.addEventListener( 'click', function () {

		if ( userState.arrival ) {

			// Will take care of pointer lock and all that jazz
			displayBlocks.hideIntro();

		}

	} );

};
