// Starts things off

window.addEventListener( 'load', function () {

	/* ===================================
	    Server
	   ==================================== */

	// TODO: Need to seperate client stuff from this file
	cubeWorld();

	// The editor element representations of the objects
	htmlBlocks._init_();


	/* ===================================
	    User/Client
	   ==================================== */

	// Make all the pointer lock things work
	pointerLock._init_();

	// Add event listeners
	mouseEvents();
	keyEvents();

} );  // end window on load
