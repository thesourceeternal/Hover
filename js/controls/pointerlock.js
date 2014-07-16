/*
* http://www.html5rocks.com/en/tutorials/pointerlock/intro/
* Also with functionality to toggle pointer lock
*/

pointerLock = {

	/* ===================================
	   Setup
	   ==================================== */

	// Element the pointer lock is assigned to
	lockElement: null,
	havePointerLock: null,
	// For toggling pointer lock (function below)
	isLocked: true,

	_init_: function () {

		// Does the user's browser support pointerlock
		this.havePointerLock = 'pointerLockElement' in document ||
		    'mozPointerLockElement' in document ||
		    'webkitPointerLockElement' in document;

		if ( !this.havePointerLock ) {  // For browsers that don't support pointerlock

			alert( "Sorry, your browser does not support pointer lock." );

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

	// Normalizes locking the pointer for all browsers
	lockPointer: function () {
		this.lockElement.requestPointerLock =
			this.lockElement.requestPointerLock ||
			this.lockElement.mozRequestPointerLock ||
			this.lockElement.webkitRequestPointerLock;

		this.lockElement.requestPointerLock();
	},

	// Normalize unlocking the pointer for all browsers
	unlockPointer: function () {
		document.exitPointerLock = document.exitPointerLock ||
			document.mozExitPointerLock ||
			document.webkitExitPointerLock;

		document.exitPointerLock();
	},

	// Always happens when the pointer lock is changed
	changePointerLock: function ( event ) {

		// lockElement is passed into here automatically, event is not needed
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

	// Toggles pointer lock independent of automatic changes
	toggleLock: function () {

		if ( this.isLocked ) {

			document.exitPointerLock();
			this.isLocked = false;

		} else {

			this.lockElement.requestPointerLock();
			this.isLocked = true;

		}
	},  // end toggleLock()

	// TODO: Comb https://dvcs.w3.org/hg/pointerlock/raw-file/default/index.html#dfn-target
	// to see if there are any other conditions to check for.
	pointerLockError: function () {

		console.log( "Pointer lock error:" );

		
		if ( document.pointerLockElement !== lockElement ||  // pointer locked
			document.mozPointerLockElement !== lockElement ||
			document.webkitPointerLockElement !== lockElement ) {

			console.log("The document pointer lock element is not the same as pointerlock.lockElement.");

		} else if ( !this.havePointerLock ) {

			console.log("This browser doesn't support pointer lock.");

		} else {

			console.log("I'm not sure what's wrong. Probably the user didn't make an engagement gesture.");

		}

	},  // end pointerLockError()

};  // end pointerLock {}
