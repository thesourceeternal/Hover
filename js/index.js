// For now this starts things up
// Perhaps later it will be in a game.js

window.addEventListener('load', function () {

	// Make all the pointer lock things work
	pointerLock._init_();

	// Add event listeners
	mouseEvents();

	// Make intro screen appear
	// on click request pointer lock, change pointer lock (to enable controls),
	// hide intro screen

});  // end window on load

