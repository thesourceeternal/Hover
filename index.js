// For now this starts things up
// Perhaps later it will be in a game.js

window.addEventListener( 'load', function () {

	// Make all the pointer lock things work
	pointerLock._init_();
	cubeWorld();

	// Add event listeners
	mouseEvents();
	keyEvents();

	// In here for testing
	document.getElementsByClassName( "editor-functionality" )[0]
							.innerHTML = htmlBlocks.editorTabs;
	document.getElementsByClassName( "sampler" )[0]
							.innerHTML = htmlBlocks.sampler;

} );  // end window on load

