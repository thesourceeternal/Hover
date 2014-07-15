/*
* http://www.html5rocks.com/en/tutorials/pointerlock/intro/
*/

pointerLock = {

	/* ===================================
	   Setup
	   ==================================== */

	// Element the pointer lock is assigned to
	lockElement: null,

	_init_: function () {

		// Does the user's browser support pointerlock
		var havePointerLock = 'pointerLockElement' in document ||
		    'mozPointerLockElement' in document ||
		    'webkitPointerLockElement' in document;

		if (!havePointerLock) {  // For browsers that don't support pointerlock

			alert("Sorry, your browser does not support pointer lock.");

		} else {  // This is the bulk of the action

			this.lockElement = document.body;
			lockElement = this.lockElement;

			// Normalize the name for the function that locks the pointer, no
			// matter the browser
			lockElement.requestPointerLock = lockElement.requestPointerLock ||
				     lockElement.mozRequestPointerLock ||
				     lockElement.webkitRequestPointerLock;

			// Normalize the name for the function that releases/unlocks the pointer
			document.exitPointerLock = document.exitPointerLock ||
					   document.mozExitPointerLock ||
					   document.webkitExitPointerLock;

			// Hook pointer lock state change events (event names assigned by browser)
			document.addEventListener('pointerlockchange', this.changePointerLock, false);
			document.addEventListener('mozpointerlockchange', this.changePointerLock, false);
			document.addEventListener('webkitpointerlockchange', this.changePointerLock, false);

			document.addEventListener( 'pointerlockerror', this.pointerLockError, false );
			document.addEventListener( 'mozpointerlockerror', this.pointerLockError, false );
			document.addEventListener( 'webkitpointerlockerror', this.pointerLockError, false );

		}

	},  // end _init_()


	/* ===================================
	   Functions
	   ==================================== */

	// Always happens when the pointer lock is changed
	changePointerLock: function (event) {

		if ( document.pointerLockElement === lockElement ||  // pointer locked
			document.mozPointerLockElement === lockElement ||
			document.webkitPointerLockElement === lockElement ) {

			// Start fps controls
			controls.enabled = true;

			// toggleDisplay();

		} else {  // pointer is NOT locked

			// Stop fps controls
			controls.enabled = false;

			// toggleDisplay();

		}

	},  // end changePointerLock()

	// TODO: Check out https://dvcs.w3.org/hg/pointerlock/raw-file/default/index.html#dfn-target
	// to create more informative error messages.
	pointerLockError: function () {

		console.log("Pointer lock error");

	},  // end pointerLockError()

};  // end pointerLock {}
