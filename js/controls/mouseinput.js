/* 
* Handles user mouse input events
* There will eventually be a lot of them
*/

var mouseEvents = function () {

	// Make global into local
	var display = displayBlocks;

	// --- Input Elements --- \\
	document.addEventListener( 'click', function (event) {

		var eventTarget = event.target;
		var targetClasses = eventTarget.classList;

		// Keep buttons from scrolling to top of sidebar, etc.
		// TODO: Need to allow some defaults for part of the time, perhaps move this to bottom
		if ( eventTarget.tagName === "BUTTON" ) {
			event.preventDefault();
		}

		// -- Editor Functionality -- \\

		// Switch between inspector and assets
		if ( targetClasses.contains("tab") ) {

			if ( targetClasses.contains("inspector-get") ) {

				display.showInspector();

			} else if ( targetClasses.contains("assets-get") ) {

				display.showAssets();

			} else {

				console.log("You clicked a tab that does not exist...");

			}  // end if inspector or assets

		}  // end if .tab


		// Collapsing and expanding
		if ( targetClasses.contains("collapser") ) {

			display.toggleCollapse(eventTarget);

		}  // end if collapser


		// Pointer lock, get it back
		if ( targetClasses.contains("esc-clause") ) {

			display.toggleEditor();

		}  // end if .esc-clause

	} );


	// --- Intro --- \\
	// When first landing on the site. Escape key works too.
	// This event listener will not be removed, it's too much work for
	// one little event listener
	document.addEventListener( 'click', function () {

		if ( userState.arrival ) {

			// Will take care of pointer lock and all that jazz
			display.hideIntro();

		}

	} );

};
