// Starts things off

// Server stuff
var cubeWorld = require('./server/worlds/cubeworld.js');
var html = require('./server/htmlBlocks.js');

// User stuff
var pointerLock = require('./js/controls/pointerlock.js');
var mouseEvents = require('./js/controls/mouseevents.js');
var keyEvents = require('./js/controls/keyevents.js');

var transformControls = require('./js/thirdparty/transformControls.js');
// var axis = require('./js/ui/axis.js');


window.addEventListener( 'load', function () {
	console.log("PROJECT: Unwritten Exercise Hover Transforms Axes");

	/* ===================================
	    Server
	   ==================================== */

	// TODO: Need to seperate client stuff from this file
	cubeWorld();

	// The editor element representations of the objects
	html._init_();


	/* ===================================
	    User/Client
	   ==================================== */

	// Make all the pointer lock things work
	pointerLock._init_();

	// Add event listeners
	mouseEvents();
	keyEvents();

	// somehow transformControls is already being called
	var renderer = cubeWorld.renderer;
	var camera = cubeWorld.camera;
	var scene = cubeWorld.scene;
	var controls = new THREE.TransformControls( camera, renderer.dom );
	controls.scope = controls;
	controls.setMode("translate");


	// controls.addEventListener( 'change', render );

	function render() {

		controls.update();

		renderer.render( scene, camera );

	}

	cubeWorld.scene.add(controls);

	var attached = false;

	document.addEventListener('click', function () {
		debugger;
		if ( attached ) {

			controls.detach();
			attached = false;

		} else {

			controls.attach(userState.selectedObj);
			attached = true;

		}

	});

	// axis( "color", "object", "direction" );



} );  // end window on load
