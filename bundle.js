(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Starts things off


// TODO: GET RID OF MAJORITY ELEMENT
// TODO: Change transformControls' intersect to use pointerlock position


// Server stuff
var cubeWorld = require('./server/worlds/cubeworld.js');
var html = require('./server/htmlBlocks.js');

// User stuff
var pointerLock = require('./js/controls/pointerlock.js');
var mouseEvents = require('./js/controls/mouseevents.js');
var keyEvents = require('./js/controls/keyevents.js');
var selection = require('./js/ui/select.js');
var display = require('./js/display.js');


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

	// Get some elements for hiding and showing
	display._init_();
	display.showIntro();

} );  // end window on load

},{"./js/controls/keyevents.js":2,"./js/controls/mouseevents.js":3,"./js/controls/pointerlock.js":4,"./js/display.js":5,"./js/ui/select.js":7,"./server/htmlBlocks.js":19,"./server/worlds/cubeworld.js":20}],2:[function(require,module,exports){
/* 
* Handles user mouse input events
* There will eventually be a lot of them
*/

var display = require('../display.js');
var userState = require('../userstate.js');


module.exports = keyEvents = function () {

	document.addEventListener( 'keyup', function ( event ) {

		var keyCode = ( 'which' in event ) ? event.which : event.keyCode;

		/* ===================================
		   UI
		   ==================================== */
		if ( keyCode === userState.preferences.hotkeys.pointerLock[2] ) {

			// Toggle display of inspector/assests vs. object sampler
			// but not on first arrival where hideIntro() will take care of it
			if ( userState.arrival ) {

				// This will take care of pointer lock too
				display.hideIntro();

			} else {  // just lock the pointer

				// Keyup so it waits till after all other pointer
				// changes have been made, after toggleEditor() so arrival
				// will stay true and intro will hide properly
				display.toggleEditor();
			}

		}  // end keyCode pointerLock


		/* ===================================
		   RUNNING TESTS
		   ==================================== */
		else if ( keyCode === userState.preferences.hotkeys.tests[2] ) {

			if (pointerLock.isLocked) {

				runTests();

			} else {  // the user may have not engaged pointerlock
				// so pointerlock tests can't run properly,
				// will give incorrect results
				console.log("Pressing 't' for tests is only " +
					"for use while pointer is locked. Using it while " +
					"pointer is unlocked may cause errors in testing.");
			}

		}  // end keyCode tests

	} );  // end document on keyup ()

};

},{"../display.js":5,"../userstate.js":9}],3:[function(require,module,exports){
/* 
* Handles user mouse input events
* There will eventually be a lot of them
*/

var display = require('../display.js');
var userState = require('../userstate.js');
var selection = require('../ui/select.js');


module.exports = mouseEvents = function () {

	// Creates the object axis/transfrom manipulators (for movin' stuff)
	// Selection mouse events are in there
	selection._init_();

	// --- Input Elements --- \\
	document.addEventListener( 'click', function (event) {

		var eventTarget = event.target;
		var targetClasses = eventTarget.classList;

		// Keep buttons from scrolling to top of sidebar, etc.
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
		// NOTE: a .collaper's image has pointer-events: none so that it
		// won't become the target element and eat the click
		if ( targetClasses.contains("collapser") ) {

			display.toggleCollapse(eventTarget);

		}  // end if collapser


		// Pointer lock, get it back
		if ( targetClasses.contains("esc-clause") ) {

			display.toggleEditor();

		}  // end if .esc-clause

	} );


	// --- UI --- \\
	// Check PointerLockControls.js for more UI events

	// --- Objects --- \\
	// Check select.js for more object events


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

},{"../display.js":5,"../ui/select.js":7,"../userstate.js":9}],4:[function(require,module,exports){
/*
* http://www.html5rocks.com/en/tutorials/pointerlock/intro/
* Also with functionality to toggle pointer lock
*/

// var controls = require('./controls.js');
var cubeWorld = require('../../server/worlds/cubeworld.js');


module.exports = pointerLock = {

	/* ===================================
	   Setup
	   ==================================== */

	// Element the pointer lock is assigned to
	lockElement: null,
	havePointerLock: null,
	// For toggling pointer lock (function below)
	isLocked: false,

	_init_: function () {

		// Does the user's browser support pointerlock
		pointerLock.havePointerLock = 'pointerLockElement' in document ||
		    'mozPointerLockElement' in document ||
		    'webkitPointerLockElement' in document;

		if ( !pointerLock.havePointerLock ) {  // For browsers that don't support pointerlock

			alert( "Sorry, your browser does not support pointer lock." );

		} else {  // This is the bulk of the action

			pointerLock.lockElement = cubeWorld.renderer.domElement;
			lockElement = pointerLock.lockElement;

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
			document.addEventListener('pointerlockchange', pointerLock.changePointerLock, false);
			document.addEventListener('mozpointerlockchange', pointerLock.changePointerLock, false);
			document.addEventListener('webkitpointerlockchange', pointerLock.changePointerLock, false);

			document.addEventListener( 'pointerlockerror', pointerLock.pointerLockError, false );
			document.addEventListener( 'mozpointerlockerror', pointerLock.pointerLockError, false );
			document.addEventListener( 'webkitpointerlockerror', pointerLock.pointerLockError, false );

		}

	},  // end _init_()


	/* ===================================
	   Functions
	   ==================================== */

	// Normalizes locking the pointer for all browsers
	lockPointer: function () {
		pointerLock.lockElement.requestPointerLock =
			pointerLock.lockElement.requestPointerLock ||
			pointerLock.lockElement.mozRequestPointerLock ||
			pointerLock.lockElement.webkitRequestPointerLock;

		pointerLock.lockElement.requestPointerLock();

		pointerLock.isLocked = true;

	},

	// Normalize unlocking the pointer for all browsers
	unlockPointer: function () {

		document.exitPointerLock = document.exitPointerLock ||
			document.mozExitPointerLock ||
			document.webkitExitPointerLock;

		document.exitPointerLock();

		pointerLock.isLocked = false;

	},

	// Toggles pointer lock independent of automatic changes
	toggleLock: function () {

		if ( pointerLock.isLocked ) {

			// Accessing our own function so isLocked changes
			pointerLock.unlockPointer();

		} else {

			pointerLock.lockPointer();

		}

	},  // end toggleLock()

	// Always happens when the pointer lock is changed
	changePointerLock: function ( event ) {

		// lockElement is passed into here automatically, event is not needed
		if ( document.pointerLockElement === lockElement ||  // pointer locked
			document.mozPointerLockElement === lockElement ||
			document.webkitPointerLockElement === lockElement ) {

		} else {  // pointer is NOT locked

		}

	},  // end changePointerLock()

	// TODO: Comb https://dvcs.w3.org/hg/pointerlock/raw-file/default/index.html#dfn-target
	// to see if there are any other conditions to check for.
	pointerLockError: function () {

		console.log( "Pointer lock error:" );

		
		if ( document.pointerLockElement !== lockElement ||  // pointer locked
			document.mozPointerLockElement !== lockElement ||
			document.webkitPointerLockElement !== lockElement ) {

			console.log("The document pointer lock element is not the same as pointerlock.lockElement.");

		} else if ( !pointerLock.havePointerLock ) {

			console.log("This browser doesn't support pointer lock.");

		} else {

			console.log("I'm not sure what's wrong. Probably the user didn't make an engagement gesture.");

		}

	},  // end pointerLockError()

};  // end pointerLock {}

},{"../../server/worlds/cubeworld.js":20}],5:[function(require,module,exports){
/* 
* Controls the hiding and showing of element blocks
*/

var userState = require('./userState.js');
var select = require('./ui/select.js');


module.exports = displayBlocks = {

	// Bools
	// editorShowing: false,
	// inspectorShowing: true,
	// assetsShowing: false,
	// samplerShowing: false,
	// codeShowing: false,

	// Maybe place in userstate.js
	lockElements: [],  // Elements visible during pointer lock
	freeElements: [],  // Elements visible when pointer is free

	_init_: function () {

		// Used to hide and show for pointer lock
		// Elements visible during pointer lock
		displayBlocks.lockElements = [
			document.getElementsByClassName("sampler")[0],
			document.getElementsByClassName("reticule")[0]
		]

		// Elements visible when pointer is free
		displayBlocks.freeElements = [
			document.getElementsByClassName("editor-sidebar")[0],
			document.getElementsByClassName("bottombar")[0],
			document.getElementsByClassName("code")[0]
		]

		// intro is its own thing
		// sidebar and inventory are always visible after intro


	},  // end _init_


	/* ===================================
	   Functions
	   ==================================== */

	// --- Smaller Effects --- \\

	// Expands and collapses the first sibling of a .collapser element
	// Changes the arrow image too
	toggleCollapse: function (element) {

		var sib = element.parentNode.nextSibling;

		// Uses jquery slideToggle function for nice animation
		$(sib).slideToggle();

		// Change the arrow image and it's alt text (accessibility)
		if ( element.classList.contains("expanded") ) {

			element.classList.remove("expanded");
			element.alt = "Click to expand";

		} else {

			element.classList.add("expanded");
			element.alt = "Click to collapse";

		}

	},


	// --- Editor Blocks --- \\
	toggleEditor: function () {
		
		if (userState.editorShowing) {
			displayBlocks.hideEditor();
		} else {
			displayBlocks.showEditor();
		}

	},  // end toggleEditor()

	showEditor: function () {

		pointerLock.unlockPointer();

		var lockElems = displayBlocks.lockElements;
		var freeElems = displayBlocks.freeElements;

		for ( var indx = 0; indx < lockElems.length; indx++ ) {
			lockElems[indx].classList.add("collapsed");
		}

		for ( var indx = 0; indx < freeElems.length ;indx++ ) {
			freeElems[indx].classList.remove("collapsed");
		}

		userState.editorShowing = true;

		// Start fppov controls
		cubeWorld.controls.enabled = false;
		select.disableHoverSelection();

	},  // end showEditor()

	hideEditor: function () {

		pointerLock.lockPointer();

		var freeElems = displayBlocks.freeElements;
		var lockElems = displayBlocks.lockElements;

		for ( var indx = 0; indx < freeElems.length ;indx++ ) {
			freeElems[indx].classList.add("collapsed");
		}

		for ( var indx = 0; indx < lockElems.length; indx++ ) {
			lockElems[indx].classList.remove("collapsed");
		}

		userState.editorShowing = false;

		// Start fppov controls
		cubeWorld.controls.enabled = true;

		select.enableHoverSelection();

	},  // end hideEditor()

	// --- Tabs --- \\
	// toggleTabs: function () {

	// 	// Toggle visibility of the inspector and assets in sidebar
	// 	if ( userState.inspectorShowing ) {

		// displayBlocks.showAssets();

	// 	} else {

		// displayBlocks.showInspector();

	// 	}

	// },  // end toggleTabs()

	showInspector: function () {

		// Show inspector, hide assets
		document.getElementsByClassName( "inspector" )[0].classList.remove("collapsed");
		document.getElementsByClassName( "assets" )[0].classList.add("collapsed");

		// Change the appearence of the inspector tabs
		document.getElementsByClassName( "inspector-get" )[0].classList.add("active-tab");
		document.getElementsByClassName( "assets-get" )[0].classList.remove("active-tab");

		userState.inspectorShowing = true;

	},  // end showInspector()

	showAssets: function () {

		// Show assets, hide inspector
		document.getElementsByClassName( "assets" )[0].classList.remove("collapsed");
		document.getElementsByClassName( "inspector" )[0].classList.add("collapsed");

		// Change the appearence of the inspector tabs
		document.getElementsByClassName( "assets-get" )[0].classList.add("active-tab");
		document.getElementsByClassName( "inspector-get" )[0].classList.remove("active-tab");

		userState.inspectorShowing = false;


	},  // end showAssets()

	// // --- Sampler --- \\
	// // Sampler? Info box?
	// showSampler: function () {},  // end showSampler()

	// hideSampler: function () {},  // end hideSampler()

	// --- Code --- \\
	toggleCode: function () {
		// toggle code mirror editor
	},  // end toggleCode()

	showCode: function () {},  // end showCode()

	hideCode: function () {},  // end hideCode()

	// --- Intro --- \\
	showIntro: function () {

		// Hide everything other than the intro and canvas
		var freeElems = displayBlocks.freeElements;
		var lockElems = displayBlocks.lockElements;

		for ( var indx = 0; indx < freeElems.length ;indx++ ) {
			freeElems[indx].classList.add("collapsed");
		}

		for ( var indx = 0; indx < lockElems.length; indx++ ) {
			lockElems[indx].classList.add("collapsed");
		}


		document.getElementsByClassName( "sidebar" )[0].classList.add("collapsed");


		// hide any sidebar contents, the bars, reticule and the inventory
		// document.getElementsByClassName( "sampler" )[0].classList.add("collapsed");
		// document.getElementsByClassName( "editor-sidebar" )[0].classList.add("collapsed");
		// document.getElementsByClassName( "bottombar" )[0].classList.add("collapsed");
		// document.getElementsByClassName( "reticule" )[0].classList.add("collapsed");
		// document.getElementsByClassName( "inventory" )[0].classList.add("collapsed");

		// show the majority with the intro in it
		document.getElementsByClassName( "intro" )[0].classList.remove("collapsed");
		// document.getElementsByClassName( "majority" )[0].classList.remove("collapsed");
		// show the sidebar

	},  // end showIntro()

	hideIntro: function () {

		// Remove the intro
		var intro = document.getElementsByClassName( "intro" )[0];
		intro.parentNode.removeChild(intro);

		document.getElementsByClassName( "sidebar" )[0].classList.remove("collapsed");

		// The sidebar and sampler are exposed
		displayBlocks.hideEditor();

		userState.arrival = false;

	},  // end hideIntro()


}

},{"./ui/select.js":7,"./userState.js":8}],6:[function(require,module,exports){
/**
 * @author arodic / https://github.com/arodic
 */
 /*jshint sub:true*/

var userState = require('../userstate.js');


module.exports = transormControls = function () {

	'use strict';

	var GizmoMaterial = function ( parameters ) {

		THREE.MeshBasicMaterial.call( this );

		this.depthTest = false;
		this.depthWrite = false;
		this.side = THREE.FrontSide;
		this.transparent = true;

		this.setValues( parameters );

		this.oldColor = this.color.clone();
		this.oldOpacity = this.opacity;

		this.highlight = function( highlighted ) {

			if ( highlighted ) {

				this.color.setRGB( 1, 1, 0 );
				this.opacity = 1;

			} else {

					this.color.copy( this.oldColor );
					this.opacity = this.oldOpacity;

			}

		};

	};

	GizmoMaterial.prototype = Object.create( THREE.MeshBasicMaterial.prototype );

	var GizmoLineMaterial = function ( parameters ) {

		THREE.LineBasicMaterial.call( this );

		this.depthTest = false;
		this.depthWrite = false;
		this.transparent = true;
		this.linewidth = 1;

		this.setValues( parameters );

		this.oldColor = this.color.clone();
		this.oldOpacity = this.opacity;

		this.highlight = function( highlighted ) {

			if ( highlighted ) {

				this.color.setRGB( 1, 1, 0 );
				this.opacity = 1;

			} else {

					this.color.copy( this.oldColor );
					this.opacity = this.oldOpacity;

			}

		};

	};

	GizmoLineMaterial.prototype = Object.create( THREE.LineBasicMaterial.prototype );

	THREE.TransformGizmo = function () {

		var scope = this;
		var showPickers = false; //debug
		var showActivePlane = false; //debug

		this.init = function () {

			THREE.Object3D.call( this );

			this.handles = new THREE.Object3D();
			this.pickers = new THREE.Object3D();
			this.planes = new THREE.Object3D();

			this.add(this.handles);
			this.add(this.pickers);
			this.add(this.planes);

			//// PLANES

			var planeGeometry = new THREE.PlaneGeometry( 50, 50, 2, 2 );
			var planeMaterial = new THREE.MeshBasicMaterial( { wireframe: true } );
			planeMaterial.side = THREE.DoubleSide;

			var planes = {
				"XY":   new THREE.Mesh( planeGeometry, planeMaterial ),
				"YZ":   new THREE.Mesh( planeGeometry, planeMaterial ),
				"XZ":   new THREE.Mesh( planeGeometry, planeMaterial ),
				"XYZE": new THREE.Mesh( planeGeometry, planeMaterial )
			};

			this.activePlane = planes["XYZE"];

			planes["YZ"].rotation.set( 0, Math.PI/2, 0 );
			planes["XZ"].rotation.set( -Math.PI/2, 0, 0 );

			for (var i in planes) {
				planes[i].name = i;
				this.planes.add(planes[i]);
				this.planes[i] = planes[i];
				planes[i].visible = false;
			}

			//// HANDLES AND PICKERS

			var setupGizmos = function( gizmoMap, parent ) {

				for ( var name in gizmoMap ) {

					for ( i = gizmoMap[name].length; i--;) {
						
						var object = gizmoMap[name][i][0];
						var position = gizmoMap[name][i][1];
						var rotation = gizmoMap[name][i][2];

						object.name = name;

						if ( position ) object.position.set( position[0], position[1], position[2] );
						if ( rotation ) object.rotation.set( rotation[0], rotation[1], rotation[2] );
						
						parent.add( object );

					}

				}

			};

			setupGizmos(this.handleGizmos, this.handles);
			setupGizmos(this.pickerGizmos, this.pickers);

			// reset Transformations

			this.traverse(function ( child ) {
				if (child instanceof THREE.Mesh) {
					child.updateMatrix();

					var tempGeometry = new THREE.Geometry();
					tempGeometry.merge( child.geometry, child.matrix );

					child.geometry = tempGeometry;
					child.position.set( 0, 0, 0 );
					child.rotation.set( 0, 0, 0 );
					child.scale.set( 1, 1, 1 );
				}
			});

		};

		this.hide = function () {
			this.traverse(function( child ) {
				child.visible = false;
			});
		};

		this.show = function () {
			this.traverse(function( child ) {
				child.visible = true;
				if (child.parent == scope.pickers ) child.visible = showPickers;
				if (child.parent == scope.planes ) child.visible = false;
			});
			this.activePlane.visible = showActivePlane;
		};

		this.highlight = function ( axis ) {

			this.traverse(function( child ) {
				if ( child.material && child.material.highlight ){
					if ( child.name == axis ) {
						child.material.highlight( true );
					} else {
						child.material.highlight( false );
					}
				}
			});
		};

	};

	THREE.TransformGizmo.prototype = Object.create( THREE.Object3D.prototype );

	THREE.TransformGizmo.prototype.update = function ( rotation, eye ) {


		var vec1 = new THREE.Vector3( 0, 0, 0 );
		var vec2 = new THREE.Vector3( 0, 1, 0 );
		var lookAtMatrix = new THREE.Matrix4();

		this.traverse(function(child) {
			if ( child.name.search("E") != -1 ) {
				child.quaternion.setFromRotationMatrix( lookAtMatrix.lookAt( eye, vec1, vec2 ) );
			} else if ( child.name.search("X") != -1 || child.name.search("Y") != -1 || child.name.search("Z") != -1 ) {
				child.quaternion.setFromEuler( rotation );
			}
		});

	};

	THREE.TransformGizmoTranslate = function () {

		THREE.TransformGizmo.call( this );

		var arrowGeometry = new THREE.Geometry();
		var mesh = new THREE.Mesh( new THREE.CylinderGeometry( 0, 0.05, 0.2, 12, 1, false ) );
		mesh.position.y = 0.5;
		mesh.updateMatrix();

		arrowGeometry.merge( mesh.geometry, mesh.matrix );
		
		var lineXGeometry = new THREE.Geometry();
		lineXGeometry.vertices.push( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 1, 0, 0 ) );

		var lineYGeometry = new THREE.Geometry();
		lineYGeometry.vertices.push( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 1, 0 ) );

		var lineZGeometry = new THREE.Geometry();
		lineZGeometry.vertices.push( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, 1 ) );

		this.handleGizmos = {
			X: [
				[ new THREE.Mesh( arrowGeometry, new GizmoMaterial( { color: 0xff0000 } ) ), [ 0.5, 0, 0 ], [ 0, 0, -Math.PI/2 ] ],
				[ new THREE.Line( lineXGeometry, new GizmoLineMaterial( { color: 0xff0000 } ) ) ]
			],
			Y: [
				[ new THREE.Mesh( arrowGeometry, new GizmoMaterial( { color: 0x00ff00 } ) ), [ 0, 0.5, 0 ] ],
				[	new THREE.Line( lineYGeometry, new GizmoLineMaterial( { color: 0x00ff00 } ) ) ]
			],
			Z: [
				[ new THREE.Mesh( arrowGeometry, new GizmoMaterial( { color: 0x0000ff } ) ), [ 0, 0, 0.5 ], [ Math.PI/2, 0, 0 ] ],
				[ new THREE.Line( lineZGeometry, new GizmoLineMaterial( { color: 0x0000ff } ) ) ]
			],
			XYZ: [
				[ new THREE.Mesh( new THREE.OctahedronGeometry( 0.1, 0 ), new GizmoMaterial( { color: 0xffffff, opacity: 0.25 } ) ), [ 0, 0, 0 ], [ 0, 0, 0 ] ]
			],
			XY: [
				[ new THREE.Mesh( new THREE.PlaneGeometry( 0.29, 0.29 ), new GizmoMaterial( { color: 0xffff00, opacity: 0.25 } ) ), [ 0.15, 0.15, 0 ] ]
			],
			YZ: [
				[ new THREE.Mesh( new THREE.PlaneGeometry( 0.29, 0.29 ), new GizmoMaterial( { color: 0x00ffff, opacity: 0.25 } ) ), [ 0, 0.15, 0.15 ], [ 0, Math.PI/2, 0 ] ]
			],
			XZ: [
				[ new THREE.Mesh( new THREE.PlaneGeometry( 0.29, 0.29 ), new GizmoMaterial( { color: 0xff00ff, opacity: 0.25 } ) ), [ 0.15, 0, 0.15 ], [ -Math.PI/2, 0, 0 ] ]
			]
		};

		this.pickerGizmos = {
			X: [
				[ new THREE.Mesh( new THREE.CylinderGeometry( 0.2, 0, 1, 4, 1, false ), new GizmoMaterial( { color: 0xff0000, opacity: 0.25 } ) ), [ 0.6, 0, 0 ], [ 0, 0, -Math.PI/2 ] ]
			],
			Y: [
				[ new THREE.Mesh( new THREE.CylinderGeometry( 0.2, 0, 1, 4, 1, false ), new GizmoMaterial( { color: 0x00ff00, opacity: 0.25 } ) ), [ 0, 0.6, 0 ] ]
			],
			Z: [
				[ new THREE.Mesh( new THREE.CylinderGeometry( 0.2, 0, 1, 4, 1, false ), new GizmoMaterial( { color: 0x0000ff, opacity: 0.25 } ) ), [ 0, 0, 0.6 ], [ Math.PI/2, 0, 0 ] ]
			],
			XYZ: [
				[ new THREE.Mesh( new THREE.OctahedronGeometry( 0.2, 0 ), new GizmoMaterial( { color: 0xffffff, opacity: 0.25 } ) ) ]
			],
			XY: [
				[ new THREE.Mesh( new THREE.PlaneGeometry( 0.4, 0.4 ), new GizmoMaterial( { color: 0xffff00, opacity: 0.25 } ) ), [ 0.2, 0.2, 0 ] ]
			],
			YZ: [
				[ new THREE.Mesh( new THREE.PlaneGeometry( 0.4, 0.4 ), new GizmoMaterial( { color: 0x00ffff, opacity: 0.25 } ) ), [ 0, 0.2, 0.2 ], [ 0, Math.PI/2, 0 ] ]
			],
			XZ: [
				[ new THREE.Mesh( new THREE.PlaneGeometry( 0.4, 0.4 ), new GizmoMaterial( { color: 0xff00ff, opacity: 0.25 } ) ), [ 0.2, 0, 0.2 ], [ -Math.PI/2, 0, 0 ] ]
			]
		};

		this.setActivePlane = function ( axis, eye ) {

			var tempMatrix = new THREE.Matrix4();
			eye.applyMatrix4( tempMatrix.getInverse( tempMatrix.extractRotation( this.planes[ "XY" ].matrixWorld ) ) );

			if ( axis == "X" ) {
				this.activePlane = this.planes[ "XY" ];
				if ( Math.abs(eye.y) > Math.abs(eye.z) ) this.activePlane = this.planes[ "XZ" ];
			}

			if ( axis == "Y" ){
				this.activePlane = this.planes[ "XY" ];
				if ( Math.abs(eye.x) > Math.abs(eye.z) ) this.activePlane = this.planes[ "YZ" ];
			}

			if ( axis == "Z" ){
				this.activePlane = this.planes[ "XZ" ];
				if ( Math.abs(eye.x) > Math.abs(eye.y) ) this.activePlane = this.planes[ "YZ" ];
			}

			if ( axis == "XYZ" ) this.activePlane = this.planes[ "XYZE" ];

			if ( axis == "XY" ) this.activePlane = this.planes[ "XY" ];

			if ( axis == "YZ" ) this.activePlane = this.planes[ "YZ" ];

			if ( axis == "XZ" ) this.activePlane = this.planes[ "XZ" ];

			this.hide();
			this.show();

		};

		this.init();

	};

	THREE.TransformGizmoTranslate.prototype = Object.create( THREE.TransformGizmo.prototype );

	THREE.TransformGizmoRotate = function () {

		THREE.TransformGizmo.call( this );

		var CircleGeometry = function ( radius, facing, arc ) {

				var geometry = new THREE.Geometry();
				arc = arc ? arc : 1;
				for ( var i = 0; i <= 64 * arc; ++i ) {
					if ( facing == 'x' ) geometry.vertices.push( new THREE.Vector3( 0, Math.cos( i / 32 * Math.PI ), Math.sin( i / 32 * Math.PI ) ).multiplyScalar(radius) );
					if ( facing == 'y' ) geometry.vertices.push( new THREE.Vector3( Math.cos( i / 32 * Math.PI ), 0, Math.sin( i / 32 * Math.PI ) ).multiplyScalar(radius) );
					if ( facing == 'z' ) geometry.vertices.push( new THREE.Vector3( Math.sin( i / 32 * Math.PI ), Math.cos( i / 32 * Math.PI ), 0 ).multiplyScalar(radius) );
				}

				return geometry;
		};

		this.handleGizmos = {
			X: [
				[ new THREE.Line( new CircleGeometry(1,'x',0.5), new GizmoLineMaterial( { color: 0xff0000 } ) ) ]
			],
			Y: [
				[ new THREE.Line( new CircleGeometry(1,'y',0.5), new GizmoLineMaterial( { color: 0x00ff00 } ) ) ]
			],
			Z: [
				[ new THREE.Line( new CircleGeometry(1,'z',0.5), new GizmoLineMaterial( { color: 0x0000ff } ) ) ]
			],
			E: [
				[ new THREE.Line( new CircleGeometry(1.25,'z',1), new GizmoLineMaterial( { color: 0xcccc00 } ) ) ]
			],
			XYZE: [
				[ new THREE.Line( new CircleGeometry(1,'z',1), new GizmoLineMaterial( { color: 0x787878 } ) ) ]
			]
		};

		this.pickerGizmos = {
			X: [
				[ new THREE.Mesh( new THREE.TorusGeometry( 1, 0.12, 4, 12, Math.PI ), new GizmoMaterial( { color: 0xff0000, opacity: 0.25 } ) ), [ 0, 0, 0 ], [ 0, -Math.PI/2, -Math.PI/2 ] ]
			],
			Y: [
				[ new THREE.Mesh( new THREE.TorusGeometry( 1, 0.12, 4, 12, Math.PI ), new GizmoMaterial( { color: 0x00ff00, opacity: 0.25 } ) ), [ 0, 0, 0 ], [ Math.PI/2, 0, 0 ] ]
			],
			Z: [
				[ new THREE.Mesh( new THREE.TorusGeometry( 1, 0.12, 4, 12, Math.PI ), new GizmoMaterial( { color: 0x0000ff, opacity: 0.25 } ) ), [ 0, 0, 0 ], [ 0, 0, -Math.PI/2 ] ]
			],
			E: [
				[ new THREE.Mesh( new THREE.TorusGeometry( 1.25, 0.12, 2, 24 ), new GizmoMaterial( { color: 0xffff00, opacity: 0.25 } ) ) ]
			],
			XYZE: [
				[ new THREE.Mesh( new THREE.Geometry() ) ]// TODO
			]
		};

		this.setActivePlane = function ( axis ) {

			if ( axis == "E" ) this.activePlane = this.planes[ "XYZE" ];

			if ( axis == "X" ) this.activePlane = this.planes[ "YZ" ];

			if ( axis == "Y" ) this.activePlane = this.planes[ "XZ" ];

			if ( axis == "Z" ) this.activePlane = this.planes[ "XY" ];

			this.hide();
			this.show();

		};

		this.update = function ( rotation, eye2 ) {

			THREE.TransformGizmo.prototype.update.apply( this, arguments );

			var group = {
				handles: this["handles"],
				pickers: this["pickers"],
			};

			var tempMatrix = new THREE.Matrix4();
			var worldRotation = new THREE.Euler( 0, 0, 1 );
			var tempQuaternion = new THREE.Quaternion();
			var unitX = new THREE.Vector3( 1, 0, 0 );
			var unitY = new THREE.Vector3( 0, 1, 0 );
			var unitZ = new THREE.Vector3( 0, 0, 1 );
			var quaternionX = new THREE.Quaternion();
			var quaternionY = new THREE.Quaternion();
			var quaternionZ = new THREE.Quaternion();
			var eye = eye2.clone();

			worldRotation.copy( this.planes["XY"].rotation );
			tempQuaternion.setFromEuler( worldRotation );

			tempMatrix.makeRotationFromQuaternion( tempQuaternion ).getInverse( tempMatrix );
			eye.applyMatrix4( tempMatrix );

			this.traverse(function(child) {

				tempQuaternion.setFromEuler( worldRotation );

				if ( child.name == "X" ) {
					quaternionX.setFromAxisAngle( unitX, Math.atan2( -eye.y, eye.z ) );
					tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionX );
					child.quaternion.copy( tempQuaternion );
				}

				if ( child.name == "Y" ) {
					quaternionY.setFromAxisAngle( unitY, Math.atan2( eye.x, eye.z ) );
					tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionY );
					child.quaternion.copy( tempQuaternion );
				}

				if ( child.name == "Z" ) {
					quaternionZ.setFromAxisAngle( unitZ, Math.atan2( eye.y, eye.x ) );
					tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionZ );
					child.quaternion.copy( tempQuaternion );
				}

			});

		};

		this.init();

	};

	THREE.TransformGizmoRotate.prototype = Object.create( THREE.TransformGizmo.prototype );

	THREE.TransformGizmoScale = function () {

		THREE.TransformGizmo.call( this );

		var arrowGeometry = new THREE.Geometry();
		var mesh = new THREE.Mesh( new THREE.BoxGeometry( 0.125, 0.125, 0.125 ) );
		mesh.position.y = 0.5;
		mesh.updateMatrix();

		arrowGeometry.merge( mesh.geometry, mesh.matrix );

		var lineXGeometry = new THREE.Geometry();
		lineXGeometry.vertices.push( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 1, 0, 0 ) );

		var lineYGeometry = new THREE.Geometry();
		lineYGeometry.vertices.push( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 1, 0 ) );

		var lineZGeometry = new THREE.Geometry();
		lineZGeometry.vertices.push( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, 1 ) );

		this.handleGizmos = {
			X: [
				[ new THREE.Mesh( arrowGeometry, new GizmoMaterial( { color: 0xff0000 } ) ), [ 0.5, 0, 0 ], [ 0, 0, -Math.PI/2 ] ],
				[ new THREE.Line( lineXGeometry, new GizmoLineMaterial( { color: 0xff0000 } ) ) ]
			],
			Y: [
				[ new THREE.Mesh( arrowGeometry, new GizmoMaterial( { color: 0x00ff00 } ) ), [ 0, 0.5, 0 ] ],
				[ new THREE.Line( lineYGeometry, new GizmoLineMaterial( { color: 0x00ff00 } ) ) ]
			],
			Z: [
				[ new THREE.Mesh( arrowGeometry, new GizmoMaterial( { color: 0x0000ff } ) ), [ 0, 0, 0.5 ], [ Math.PI/2, 0, 0 ] ],
				[ new THREE.Line( lineZGeometry, new GizmoLineMaterial( { color: 0x0000ff } ) ) ]
			],
			XYZ: [
				[ new THREE.Mesh( new THREE.BoxGeometry( 0.125, 0.125, 0.125 ), new GizmoMaterial( { color: 0xffffff, opacity: 0.25 } ) ) ]
			]
		};

		this.pickerGizmos = {
			X: [
				[ new THREE.Mesh( new THREE.CylinderGeometry( 0.2, 0, 1, 4, 1, false ), new GizmoMaterial( { color: 0xff0000, opacity: 0.25 } ) ), [ 0.6, 0, 0 ], [ 0, 0, -Math.PI/2 ] ]
			],
			Y: [
				[ new THREE.Mesh( new THREE.CylinderGeometry( 0.2, 0, 1, 4, 1, false ), new GizmoMaterial( { color: 0x00ff00, opacity: 0.25 } ) ), [ 0, 0.6, 0 ] ]
			],
			Z: [
				[ new THREE.Mesh( new THREE.CylinderGeometry( 0.2, 0, 1, 4, 1, false ), new GizmoMaterial( { color: 0x0000ff, opacity: 0.25 } ) ), [ 0, 0, 0.6 ], [ Math.PI/2, 0, 0 ] ]
			],
			XYZ: [
				[ new THREE.Mesh( new THREE.BoxGeometry( 0.4, 0.4, 0.4 ), new GizmoMaterial( { color: 0xffffff, opacity: 0.25 } ) ) ]
			]
		};

		this.setActivePlane = function ( axis, eye ) {

			var tempMatrix = new THREE.Matrix4();
			eye.applyMatrix4( tempMatrix.getInverse( tempMatrix.extractRotation( this.planes[ "XY" ].matrixWorld ) ) );

			if ( axis == "X" ) {
				this.activePlane = this.planes[ "XY" ];
				if ( Math.abs(eye.y) > Math.abs(eye.z) ) this.activePlane = this.planes[ "XZ" ];
			}

			if ( axis == "Y" ){
				this.activePlane = this.planes[ "XY" ];
				if ( Math.abs(eye.x) > Math.abs(eye.z) ) this.activePlane = this.planes[ "YZ" ];
			}

			if ( axis == "Z" ){
				this.activePlane = this.planes[ "XZ" ];
				if ( Math.abs(eye.x) > Math.abs(eye.y) ) this.activePlane = this.planes[ "YZ" ];
			}

			if ( axis == "XYZ" ) this.activePlane = this.planes[ "XYZE" ];

			this.hide();
			this.show();

		};

		this.init();

	};

	THREE.TransformGizmoScale.prototype = Object.create( THREE.TransformGizmo.prototype );

	THREE.TransformControls = function ( camera, domElement ) {

		// TODO: Make non-uniform scale and rotate play nice in hierarchies
		// TODO: ADD RXYZ contol

		THREE.Object3D.call( this );

		domElement = ( domElement !== undefined ) ? domElement : document;

		this.gizmo = {};
		this.gizmo["translate"] = new THREE.TransformGizmoTranslate();
		this.gizmo["rotate"] = new THREE.TransformGizmoRotate();
		this.gizmo["scale"] = new THREE.TransformGizmoScale();

		this.add(this.gizmo["translate"]);
		this.add(this.gizmo["rotate"]);
		this.add(this.gizmo["scale"]);

		this.gizmo["translate"].hide();
		this.gizmo["rotate"].hide();
		this.gizmo["scale"].hide();

		this.object = undefined;
		this.snap = null;
		this.space = "world";
		this.size = 1;
		this.axis = null;

		var scope = this;
		
		var _dragging = false;
		var _mode = "translate";
		var _plane = "XY";

		var changeEvent = { type: "change" };

		var ray = new THREE.Raycaster();
		var projector = new THREE.Projector();
		var pointerVector = new THREE.Vector3();

		var point = new THREE.Vector3();
		var offset = new THREE.Vector3();

		var rotation = new THREE.Vector3();
		var offsetRotation = new THREE.Vector3();
		var scale = 1;

		var lookAtMatrix = new THREE.Matrix4();
		var eye = new THREE.Vector3();

		var tempMatrix = new THREE.Matrix4();
		var tempVector = new THREE.Vector3();
		var tempQuaternion = new THREE.Quaternion();
		var unitX = new THREE.Vector3( 1, 0, 0 );
		var unitY = new THREE.Vector3( 0, 1, 0 );
		var unitZ = new THREE.Vector3( 0, 0, 1 );

		var quaternionXYZ = new THREE.Quaternion();
		var quaternionX = new THREE.Quaternion();
		var quaternionY = new THREE.Quaternion();
		var quaternionZ = new THREE.Quaternion();
		var quaternionE = new THREE.Quaternion();

		var oldPosition = new THREE.Vector3();
		var oldScale = new THREE.Vector3();
		var oldRotationMatrix = new THREE.Matrix4();

		var parentRotationMatrix  = new THREE.Matrix4();
		var parentScale = new THREE.Vector3();

		var worldPosition = new THREE.Vector3();
		var worldRotation = new THREE.Euler();
		var worldRotationMatrix  = new THREE.Matrix4();
		var camPosition = new THREE.Vector3();
		var camRotation = new THREE.Euler();

		domElement.addEventListener( "mousedown", onPointerDown, false );
		domElement.addEventListener( "touchstart", onPointerDown, false );

		domElement.addEventListener( "mousemove", onPointerHover, false );
		domElement.addEventListener( "touchmove", onPointerHover, false );

		domElement.addEventListener( "mousemove", onPointerMove, false );
		domElement.addEventListener( "touchmove", onPointerMove, false );

		domElement.addEventListener( "mouseup", onPointerUp, false );
		domElement.addEventListener( "mouseout", onPointerUp, false );
		domElement.addEventListener( "touchend", onPointerUp, false );
		domElement.addEventListener( "touchcancel", onPointerUp, false );
		domElement.addEventListener( "touchleave", onPointerUp, false );

		this.attach = function ( object ) {

			scope.object = object;

			this.gizmo["translate"].hide();
			this.gizmo["rotate"].hide();
			this.gizmo["scale"].hide();
			this.gizmo[_mode].show();

			scope.update();

		};

		this.detach = function ( object ) {

			scope.object = undefined;
			this.axis = undefined;

			this.gizmo["translate"].hide();
			this.gizmo["rotate"].hide();
			this.gizmo["scale"].hide();

		};

		this.setMode = function ( mode ) {

			_mode = mode ? mode : _mode;

			if ( _mode == "scale" ) scope.space = "local";

			this.gizmo["translate"].hide();
			this.gizmo["rotate"].hide();
			this.gizmo["scale"].hide();	
			this.gizmo[_mode].show();

			this.update();
			scope.dispatchEvent( changeEvent );

		};

		this.setSnap = function ( snap ) {

			scope.snap = snap;

		};

		this.setSize = function ( size ) {

			scope.size = size;
			this.update();
			scope.dispatchEvent( changeEvent );
			
		};

		this.setSpace = function ( space ) {

			scope.space = space;
			this.update();
			scope.dispatchEvent( changeEvent );

		};

		this.update = function () {

			if ( scope.object === undefined ) return;

			scope.object.updateMatrixWorld();
			worldPosition.setFromMatrixPosition( scope.object.matrixWorld );
			worldRotation.setFromRotationMatrix( tempMatrix.extractRotation( scope.object.matrixWorld ) );

			camera.updateMatrixWorld();
			camPosition.setFromMatrixPosition( camera.matrixWorld );
			camRotation.setFromRotationMatrix( tempMatrix.extractRotation( camera.matrixWorld ) );

			scale = worldPosition.distanceTo( camPosition ) / 6 * scope.size;
			this.position.copy( worldPosition );
			this.scale.set( scale, scale, scale );

			eye.copy( camPosition ).sub( worldPosition ).normalize();

			if ( scope.space == "local" )
				this.gizmo[_mode].update( worldRotation, eye );

			else if ( scope.space == "world" )
				this.gizmo[_mode].update( new THREE.Euler(), eye );

			this.gizmo[_mode].highlight( scope.axis );

		};

		function onPointerHover( event ) {

			if ( scope.object === undefined || _dragging === true ) return;

			event.preventDefault();

			var pointer = event.changedTouches ? event.changedTouches[ 0 ] : event;

			var intersect = intersectObjects( pointer, scope.gizmo[_mode].pickers.children );

			if ( intersect ) {

				scope.axis = intersect.object.name;
				scope.update();
				scope.dispatchEvent( changeEvent );

			} else if ( scope.axis !== null ) {

				scope.axis = null;
				scope.update();
				scope.dispatchEvent( changeEvent );

			}

		}

		function onPointerDown( event ) {

			if ( scope.object === undefined || _dragging === true ) return;

			// This is stopping mouse from clicking on input
			// Also the clicking carries through the overlaying element and into
			// the canvas.
			// event.preventDefault();
			event.stopPropagation();

			var pointer = event.changedTouches ? event.changedTouches[ 0 ] : event;

			if ( pointer.button === 0 || pointer.button === undefined ) {

				var intersect = intersectObjects( pointer, scope.gizmo[_mode].pickers.children );

				if ( intersect ) {

					scope.axis = intersect.object.name;

					scope.update();

					eye.copy( camPosition ).sub( worldPosition ).normalize();

					scope.gizmo[_mode].setActivePlane( scope.axis, eye );

					var planeIntersect = intersectObjects( pointer, [scope.gizmo[_mode].activePlane] );

					oldPosition.copy( scope.object.position );
					oldScale.copy( scope.object.scale );

					oldRotationMatrix.extractRotation( scope.object.matrix );
					worldRotationMatrix.extractRotation( scope.object.matrixWorld );

					parentRotationMatrix.extractRotation( scope.object.parent.matrixWorld );
					parentScale.setFromMatrixScale( tempMatrix.getInverse( scope.object.parent.matrixWorld ) );

					offset.copy( planeIntersect.point );
					// console.log("offset changed");

				}

			}

			_dragging = true;

		}

		function onPointerMove( event ) {

			if ( scope.object === undefined || scope.axis === null || _dragging === false ) return;

			event.preventDefault();
			event.stopPropagation();

			var pointer = event.changedTouches? event.changedTouches[0] : event;

			var planeIntersect = intersectObjects( pointer, [scope.gizmo[_mode].activePlane] );
			// console.log(planeIntersect);

			point.copy( planeIntersect.point );

			if ( _mode == "translate" ) {
				point.sub( offset );
				point.multiply(parentScale);

				if ( scope.space == "local" ) {

					point.applyMatrix4( tempMatrix.getInverse( worldRotationMatrix ) );

					if ( scope.axis.search("X") == -1 ) point.x = 0;
					if ( scope.axis.search("Y") == -1 ) point.y = 0;
					if ( scope.axis.search("Z") == -1 ) point.z = 0;

					point.applyMatrix4( oldRotationMatrix );

					scope.object.position.copy( oldPosition );
					scope.object.position.add( point );

				} 

				if ( scope.space == "world" || scope.axis.search("XYZ") != -1 ) {
						// console.log(point);

					if ( scope.axis.search("X") == -1 ) point.x = 0;
					if ( scope.axis.search("Y") == -1 ) point.y = 0;
					if ( scope.axis.search("Z") == -1 ) point.z = 0;

					point.applyMatrix4( tempMatrix.getInverse( parentRotationMatrix ) );

					scope.object.position.copy( oldPosition );
					scope.object.position.add( point );

				}
				
				if ( scope.snap !== null ) {
				
					if ( scope.axis.search("X") != -1 ) scope.object.position.x = Math.round( scope.object.position.x / scope.snap ) * scope.snap;
					if ( scope.axis.search("Y") != -1 ) scope.object.position.y = Math.round( scope.object.position.y / scope.snap ) * scope.snap;
					if ( scope.axis.search("Z") != -1 ) scope.object.position.z = Math.round( scope.object.position.z / scope.snap ) * scope.snap;
				
				}

			} else if ( _mode == "scale" ) {

				point.sub( offset );
				point.multiply(parentScale);

				if ( scope.space == "local" ) {

					if ( scope.axis == "XYZ") {

						scale = 1 + ( ( point.y ) / 50 );

						scope.object.scale.x = oldScale.x * scale;
						scope.object.scale.y = oldScale.y * scale;
						scope.object.scale.z = oldScale.z * scale;

					} else {

						point.applyMatrix4( tempMatrix.getInverse( worldRotationMatrix ) );

						if ( scope.axis == "X" ) scope.object.scale.x = oldScale.x * ( 1 + point.x / 50 );
						if ( scope.axis == "Y" ) scope.object.scale.y = oldScale.y * ( 1 + point.y / 50 );
						if ( scope.axis == "Z" ) scope.object.scale.z = oldScale.z * ( 1 + point.z / 50 );

					}

				}

			} else if ( _mode == "rotate" ) {

				point.sub( worldPosition );
				point.multiply(parentScale);
				tempVector.copy(offset).sub( worldPosition );
				tempVector.multiply(parentScale);

				if ( scope.axis == "E" ) {

					point.applyMatrix4( tempMatrix.getInverse( lookAtMatrix ) );
					tempVector.applyMatrix4( tempMatrix.getInverse( lookAtMatrix ) );

					rotation.set( Math.atan2( point.z, point.y ), Math.atan2( point.x, point.z ), Math.atan2( point.y, point.x ) );
					offsetRotation.set( Math.atan2( tempVector.z, tempVector.y ), Math.atan2( tempVector.x, tempVector.z ), Math.atan2( tempVector.y, tempVector.x ) );

					tempQuaternion.setFromRotationMatrix( tempMatrix.getInverse( parentRotationMatrix ) );

					quaternionE.setFromAxisAngle( eye, rotation.z - offsetRotation.z );
					quaternionXYZ.setFromRotationMatrix( worldRotationMatrix );

					tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionE );
					tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionXYZ );

					scope.object.quaternion.copy( tempQuaternion );

				} else if ( scope.axis == "XYZE" ) {

					quaternionE.setFromEuler( point.clone().cross(tempVector).normalize() ); // rotation axis

					tempQuaternion.setFromRotationMatrix( tempMatrix.getInverse( parentRotationMatrix ) );
					quaternionX.setFromAxisAngle( quaternionE, - point.clone().angleTo(tempVector) );
					quaternionXYZ.setFromRotationMatrix( worldRotationMatrix );

					tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionX );
					tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionXYZ );

					scope.object.quaternion.copy( tempQuaternion );

				} else if ( scope.space == "local" ) {

					point.applyMatrix4( tempMatrix.getInverse( worldRotationMatrix ) );

					tempVector.applyMatrix4( tempMatrix.getInverse( worldRotationMatrix ) );

					rotation.set( Math.atan2( point.z, point.y ), Math.atan2( point.x, point.z ), Math.atan2( point.y, point.x ) );
					offsetRotation.set( Math.atan2( tempVector.z, tempVector.y ), Math.atan2( tempVector.x, tempVector.z ), Math.atan2( tempVector.y, tempVector.x ) );

					quaternionXYZ.setFromRotationMatrix( oldRotationMatrix );
					quaternionX.setFromAxisAngle( unitX, rotation.x - offsetRotation.x );
					quaternionY.setFromAxisAngle( unitY, rotation.y - offsetRotation.y );
					quaternionZ.setFromAxisAngle( unitZ, rotation.z - offsetRotation.z );

					if ( scope.axis == "X" ) quaternionXYZ.multiplyQuaternions( quaternionXYZ, quaternionX );
					if ( scope.axis == "Y" ) quaternionXYZ.multiplyQuaternions( quaternionXYZ, quaternionY );
					if ( scope.axis == "Z" ) quaternionXYZ.multiplyQuaternions( quaternionXYZ, quaternionZ );

					scope.object.quaternion.copy( quaternionXYZ );

				} else if ( scope.space == "world" ) {

					rotation.set( Math.atan2( point.z, point.y ), Math.atan2( point.x, point.z ), Math.atan2( point.y, point.x ) );
					offsetRotation.set( Math.atan2( tempVector.z, tempVector.y ), Math.atan2( tempVector.x, tempVector.z ), Math.atan2( tempVector.y, tempVector.x ) );

					tempQuaternion.setFromRotationMatrix( tempMatrix.getInverse( parentRotationMatrix ) );

					quaternionX.setFromAxisAngle( unitX, rotation.x - offsetRotation.x );
					quaternionY.setFromAxisAngle( unitY, rotation.y - offsetRotation.y );
					quaternionZ.setFromAxisAngle( unitZ, rotation.z - offsetRotation.z );
					quaternionXYZ.setFromRotationMatrix( worldRotationMatrix );

					if ( scope.axis == "X" ) tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionX );
					if ( scope.axis == "Y" ) tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionY );
					if ( scope.axis == "Z" ) tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionZ );

					tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionXYZ );

					scope.object.quaternion.copy( tempQuaternion );

				}

			}

			scope.update();
			scope.dispatchEvent( changeEvent );

		}

		function onPointerUp( event ) {

			_dragging = false;
			onPointerHover( event );

		}

		// Always the vector for mouse in pointer lock (screen center)
		var pLockVector = new THREE.Vector3();

		function intersectObjects( pointer, objects ) {

			var rect;

			// This if statement makes sure our current test works
			if ( domElement === document ) {

				// ALWAYS GETS SELECTED ATM
				rect = document.body.getBoundingClientRect();

			} else {  // This situation makes the behavior incorrect

				// ALWAYS GETS SELECTED ATM
				rect = domElement.getBoundingClientRect();
			}

			// Get the position of the mouse inside the canvas
			var realX = (( event.clientX - rect.left ) / rect.width) * 2 - 1;
		    var realY = - (( event.clientY - rect.top ) / rect.height) * 2 + 1;

			pointerVector.set( realX, realY, 0.5 );  // need accuracy for offset

			if ( userState.editorShowing ) {
				// offset will determine how far to move the object
				projector.unprojectVector( pointerVector, camera );
				ray.set( camPosition, pointerVector.sub( camPosition ).normalize() );

			} else {

				// For some reason this keeps changing if I don't set it in here
				pLockVector.set(0, 0, 0.5);
				// pointer lock mouse is centered and needs to select axis as such
				projector.unprojectVector( pLockVector, camera );
				ray.set( camPosition, pLockVector.sub( camPosition ).normalize() );
				
			}

			var intersections = ray.intersectObjects( objects, true );
			return intersections[0] ? intersections[0] : false;

		}

		// Make accessible to others
		this.intersectObjects = intersectObjects;

	};

	THREE.TransformControls.prototype = Object.create( THREE.Object3D.prototype );

}();

},{"../userstate.js":9}],7:[function(require,module,exports){
/*
* Handles selection of objects in fps and with the editor
*/

var cubeWorld = require('../../server/worlds/cubeworld.js');
var userState = require('../userState.js');

var axis = require('../thirdparty/transformControls.js');

module.exports = select = {

	// Perhaps relocate raycaster and projector into here

	// Perhaps relocate to userState
	// selected: null,
	oldSelected: null,

	axis: null,

	enabled: true,


	// Set up the transform controlers/axis
	// TODO: Make only one axis object and move it around
	// TODO: Make a pointerlock select locking mechanism so
	// objects can be selected and moved while in pointerlock
	// TODO: make an arrow point to the axis if the axis is off-screen
	_init_: function () {

		var disableSelection = select.disableSelection;
		var enableSelection = select.enableSelection;

		// Add event listeners to prevent object selection when clicking
		// on hud elements
		var editor = document.getElementsByClassName("editor-sidebar")[0];
		var bottombar = document.getElementsByClassName("bottombar")[0];
		// var codeEditor = document.getElementsByClassName("code-editor")[0];

		editor.addEventListener( "mousedown", disableSelection, false );
		editor.addEventListener( "mouseup", enableSelection, false );

		bottombar.addEventListener( "mousedown", disableSelection, false );
		bottombar.addEventListener( "mouseup", enableSelection, false );

		// codeEditor.addEventListener( "mousedown", disableSelection, false );
		// codeEditor.addEventListener( "mouseup", enableSelection, false );

		var renderer = cubeWorld.renderer;
		var camera = cubeWorld.camera;
		var scene = cubeWorld.scene;

		// With this, selecting and moving axis works in pointer lock
		// select.axis = new THREE.TransformControls( camera, undefined );

		// With this, selecting and moving axis doesn't work in pointer lock
		select.axis = new THREE.TransformControls( camera, renderer.domElement );

		select.axis.setMode("translate");

		scene.add(select.axis);

		document.getElementsByClassName("reticule")

	},


	// --- Enablers --- \\

	disableSelection: function () {

		select.enabled = false;

	},  // end disableSelection()

	enableSelection: function () {

		select.enabled = true;

	},  // end enableSelection()

	// Called in display.js
	// Hovering will select objects to get show info
	enableHoverSelection: function () {
		// Has to be mousedown for selection lock to work
		document.removeEventListener("mousedown", select.selctionHandler, false);
		document.addEventListener('mousemove', select.selctionHandler, false);

	},  // end enableHoverSelection()

	// Called in display.js
	// Clicking will select objects
	disableHoverSelection: function () {
		// Has to be mousedown for selection lock to work
		document.removeEventListener('mousemove', select.selctionHandler, false);
		document.addEventListener("mousedown", select.selctionHandler, false);

	},  // end disableHoverSelection()


	// --- Selection --- \\
	// Determines and, if needed sets, the object currently being selected
	selctionHandler: function (event) {

		if ( select.enabled ) {

			var newObj = select.getObject(event);

			if ( newObj !== userState.selectedObj ) {

				select.selectObject(newObj);

			}

		}

	},  // end selctionHandler()

	// Determines what object the mouse is currently on
	getObject: function (event) {

		// return cubeWorld.scene.children[0];
		var intersectors = select.getScreenIntersects(event);

		// Get the closest object under the mouse, if any
		if ( intersectors[0] ) {

			// change color of reticule

			return intersectors[0].object;

		} else {  // no object is selected, show that

			userState.selectedObj = undefined;

		}

	},  // end getObject()

	// Checks what the nearest object intersection is
	getScreenIntersects: function (event) {
		// Would like to use tansformControls version, but can't
		// pass pointer at this time

		// The screen coordinates of the origin of the ray
		var mouseCoords;
		var element = cubeWorld.renderer.domElement;

		if ( userState.editorShwoing ) {

			var rect = element.getBoundingClientRect();
			// Get the position of the mouse on the screen
			mouseCoords = {
				// The mouse position inside the window
				// TODO: discuss - is centering not enough with pointer lock?
				x: (( event.clientX - rect.left ) / rect.width) * 2 - 1,
			    y: (( event.clientY - rect.top ) / rect.height) * -2 + 1,
			}

		} else {
			mouseCoords = { x: 0, y: 0, };
		}

		// Why two vectors? Good question.
		// This one is set from the position of the active camera
		var raycastOrigin = new THREE.Vector3();
		raycastOrigin.setFromMatrixPosition( cubeWorld.camera.matrixWorld );

		// This one is set from the poition of the mouse on the screen
		var mouseVector = new THREE.Vector3( mouseCoords.x, mouseCoords.y, 1 );
		cubeWorld.projector.unprojectVector( mouseVector, cubeWorld.camera );
		mouseVector.sub( raycastOrigin ).normalize();

		cubeWorld.raycaster.set( raycastOrigin, mouseVector );


		// TODO: Test if this returns anything when the mouse is on the editor
		return cubeWorld.raycaster.intersectObjects( cubeWorld.scene.children )

	},  // end getIntersects()

	// This is seperate for when objects are selectable
	// through the scene tree. It's a one-liner, but will
	// hopefully streamline future functions
	selectObject: function (newObject) {

			select.axis.detach( userState.selectedObj );

			userState.selectedObj = newObject;
			select.axis.attach( userState.selectedObj );

		// Set the sampler to display the info of this
			// object (perhaps this should be done in sampler's
			// functions since sometimes the sampler won't
			// be showing)

	},  // end selectObject()

	// Show whichever version of the axis is currently desired
	// at whatever spot on the object is desired.
	// Yeah, it's singular, but no one knows axes as the plural
	showAxis: function (object) {

	// 	object.axis.attach


	// function setTransformControlTarget() {
      
 //      var target = this.getSelectedObject()
 //      this.axis.detach()
 //      if ( this.currentMode === 'scene' && target ) {
 //        // attach gizmo
 //        this.axis.attach( target )
 //        // // orient gizmo
 //        // var lookTarget = this.fpsControls.getObject().position
 //        // directionVector = this.axis.position.clone().sub(lookTarget).setY(0).normalize()
 //        // var angle = 0.75 * Math.PI + Math.atan2(directionVector.x,directionVector.z)
 //        // this.axis.setRotationFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), angle )
 //      }

    // }  // end setTransformControlTarget()

		// showAxis(type)
		// place(where)

	},

}


},{"../../server/worlds/cubeworld.js":20,"../thirdparty/transformControls.js":6,"../userState.js":8}],8:[function(require,module,exports){
/*
* User variables that need to be stored and accessed
*/

module.exports = userState = {

	// Bools
	arrival: true,

	editorShowing: false,
	inspectorShowing: true,
	// assetsShowing: false,
	// samplerShowing: false,
	// codeShowing: false,

	selectedObj: undefined,


	preferences: {

		hotkeys: {

			// --- FPS Movement --- \\
			// NOT YET IMPLEMENTED
			forwards: ["forwards", "w", 87],
			left: ["left", "a", 65],
			backwards: ["backwards", "s", 83],
			right: ["right", "d", 68],
			jumpup: ["jump/up", "spacebar", 32],  // just up
			crouchdown: ["crouch/down", "shift", 16],  // just down
			// TODO: Implement double tapping, holding, and other behavior
			// TODO: Discuss implications of this behavior for user experience
			// startFlying: ["start flying", "double tap space bar", 32],
			toggleFlying: ["toggle flying", "f", 70],

			// --- pointerlock --- \\
			pointerLock: ["pointer lock", "esc", 27],

			// --- Testing --- \\
			tests: ["run tests", "t", 84],

		},  // end hotkeys{}

		flying: true,

	},  // end preferences{}

}


},{}],9:[function(require,module,exports){
module.exports=require(8)
},{}],10:[function(require,module,exports){

},{}],11:[function(require,module,exports){
var split = require('browser-split')
var ClassList = require('class-list')
var DataSet = require('data-set')
require('html-element')

function context () {

  var cleanupFuncs = []

  function h() {
    var args = [].slice.call(arguments), e = null
    function item (l) {
      var r
      function parseClass (string) {
        var m = split(string, /([\.#]?[a-zA-Z0-9_:-]+)/)
        if(/^\.|#/.test(m[1]))
          e = document.createElement('div')
        forEach(m, function (v) {
          var s = v.substring(1,v.length)
          if(!v) return
          if(!e)
            e = document.createElement(v)
          else if (v[0] === '.')
            ClassList(e).add(s)
          else if (v[0] === '#')
            e.setAttribute('id', s)
        })
      }

      if(l == null)
        ;
      else if('string' === typeof l) {
        if(!e)
          parseClass(l)
        else
          e.appendChild(r = document.createTextNode(l))
      }
      else if('number' === typeof l
        || 'boolean' === typeof l
        || l instanceof Date
        || l instanceof RegExp ) {
          e.appendChild(r = document.createTextNode(l.toString()))
      }
      //there might be a better way to handle this...
      else if (isArray(l))
        forEach(l, item)
      else if(isNode(l))
        e.appendChild(r = l)
      else if(l instanceof Text)
        e.appendChild(r = l)
      else if ('object' === typeof l) {
        for (var k in l) {
          if('function' === typeof l[k]) {
            if(/^on\w+/.test(k)) {
              if (e.addEventListener){
                e.addEventListener(k.substring(2), l[k], false)
                cleanupFuncs.push(function(){
                  e.removeEventListener(k.substring(2), l[k], false)
                })
              }else{
                e.attachEvent(k, l[k])
                cleanupFuncs.push(function(){
                  e.detachEvent(k, l[k])
                })
              }
            } else {
              // observable
              e[k] = l[k]()
              cleanupFuncs.push(l[k](function (v) {
                e[k] = v
              }))
            }
          }
          else if(k === 'style') {
            if('string' === typeof l[k]) {
              e.style.cssText = l[k]
            }else{
              for (var s in l[k]) (function(s, v) {
                if('function' === typeof v) {
                  // observable
                  e.style.setProperty(s, v())
                  cleanupFuncs.push(v(function (val) {
                    e.style.setProperty(s, val)
                  }))
                } else
                  e.style.setProperty(s, l[k][s])
              })(s, l[k][s])
            }
          } else if (k.substr(0, 5) === "data-") {
            DataSet(e)[k.substr(5)] = l[k]
          } else {
            e[k] = l[k]
          }
        }
      } else if ('function' === typeof l) {
        //assume it's an observable!
        var v = l()
        e.appendChild(r = isNode(v) ? v : document.createTextNode(v))

        cleanupFuncs.push(l(function (v) {
          if(isNode(v) && r.parentElement)
            r.parentElement.replaceChild(v, r), r = v
          else
            r.textContent = v
        }))
      }

      return r
    }
    while(args.length)
      item(args.shift())

    return e
  }

  h.cleanup = function () {
    for (var i = 0; i < cleanupFuncs.length; i++){
      cleanupFuncs[i]()
    }
  }

  return h
}

var h = module.exports = context()
h.context = context

function isNode (el) {
  return el && el.nodeName && el.nodeType
}

function isText (el) {
  return el && el.nodeName === '#text' && el.nodeType == 3
}

function forEach (arr, fn) {
  if (arr.forEach) return arr.forEach(fn)
  for (var i = 0; i < arr.length; i++) fn(arr[i], i)
}

function isArray (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]'
}

},{"browser-split":12,"class-list":13,"data-set":15,"html-element":10}],12:[function(require,module,exports){
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},{}],13:[function(require,module,exports){
// contains, add, remove, toggle
var indexof = require('indexof')

module.exports = ClassList

function ClassList(elem) {
    var cl = elem.classList

    if (cl) {
        return cl
    }

    var classList = {
        add: add
        , remove: remove
        , contains: contains
        , toggle: toggle
        , toString: $toString
        , length: 0
        , item: item
    }

    return classList

    function add(token) {
        var list = getTokens()
        if (indexof(list, token) > -1) {
            return
        }
        list.push(token)
        setTokens(list)
    }

    function remove(token) {
        var list = getTokens()
            , index = indexof(list, token)

        if (index === -1) {
            return
        }

        list.splice(index, 1)
        setTokens(list)
    }

    function contains(token) {
        return indexof(getTokens(), token) > -1
    }

    function toggle(token) {
        if (contains(token)) {
            remove(token)
            return false
        } else {
            add(token)
            return true
        }
    }

    function $toString() {
        return elem.className
    }

    function item(index) {
        var tokens = getTokens()
        return tokens[index] || null
    }

    function getTokens() {
        var className = elem.className

        return filter(className.split(" "), isTruthy)
    }

    function setTokens(list) {
        var length = list.length

        elem.className = list.join(" ")
        classList.length = length

        for (var i = 0; i < list.length; i++) {
            classList[i] = list[i]
        }

        delete list[length]
    }
}

function filter (arr, fn) {
    var ret = []
    for (var i = 0; i < arr.length; i++) {
        if (fn(arr[i])) ret.push(arr[i])
    }
    return ret
}

function isTruthy(value) {
    return !!value
}

},{"indexof":14}],14:[function(require,module,exports){

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},{}],15:[function(require,module,exports){
var Weakmap = require("weakmap")
var Individual = require("individual")

var datasetMap = Individual("__DATA_SET_WEAKMAP", Weakmap())

module.exports = DataSet

function DataSet(elem) {
    if (elem.dataset) {
        return elem.dataset
    }

    var hash = datasetMap.get(elem)

    if (!hash) {
        hash = createHash(elem)
        datasetMap.set(elem, hash)
    }

    return hash
}

function createHash(elem) {
    var attributes = elem.attributes
    var hash = {}

    if (attributes === null || attributes === undefined) {
        return hash
    }

    for (var i = 0; i < attributes.length; i++) {
        var attr = attributes[i]

        if (attr.name.substr(0,5) !== "data-") {
            continue
        }

        hash[attr.name.substr(5)] = attr.value
    }

    return hash
}

},{"individual":16,"weakmap":18}],16:[function(require,module,exports){
var root = require("global")

module.exports = Individual

function Individual(key, value) {
    if (root[key]) {
        return root[key]
    }

    Object.defineProperty(root, key, {
        value: value
        , configurable: true
    })

    return value
}

},{"global":17}],17:[function(require,module,exports){
(function (global){
/*global window, global*/
if (typeof global !== "undefined") {
    module.exports = global
} else if (typeof window !== "undefined") {
    module.exports = window
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],18:[function(require,module,exports){
/* (The MIT License)
 *
 * Copyright (c) 2012 Brandon Benvie <http://bbenvie.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the 'Software'), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included with all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
 * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY  CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// Original WeakMap implementation by Gozala @ https://gist.github.com/1269991
// Updated and bugfixed by Raynos @ https://gist.github.com/1638059
// Expanded by Benvie @ https://github.com/Benvie/harmony-collections

void function(global, undefined_, undefined){
  var getProps = Object.getOwnPropertyNames,
      defProp  = Object.defineProperty,
      toSource = Function.prototype.toString,
      create   = Object.create,
      hasOwn   = Object.prototype.hasOwnProperty,
      funcName = /^\n?function\s?(\w*)?_?\(/;


  function define(object, key, value){
    if (typeof key === 'function') {
      value = key;
      key = nameOf(value).replace(/_$/, '');
    }
    return defProp(object, key, { configurable: true, writable: true, value: value });
  }

  function nameOf(func){
    return typeof func !== 'function'
          ? '' : 'name' in func
          ? func.name : toSource.call(func).match(funcName)[1];
  }

  // ############
  // ### Data ###
  // ############

  var Data = (function(){
    var dataDesc = { value: { writable: true, value: undefined } },
        datalock = 'return function(k){if(k===s)return l}',
        uids     = create(null),

        createUID = function(){
          var key = Math.random().toString(36).slice(2);
          return key in uids ? createUID() : uids[key] = key;
        },

        globalID = createUID(),

        storage = function(obj){
          if (hasOwn.call(obj, globalID))
            return obj[globalID];

          if (!Object.isExtensible(obj))
            throw new TypeError("Object must be extensible");

          var store = create(null);
          defProp(obj, globalID, { value: store });
          return store;
        };

    // common per-object storage area made visible by patching getOwnPropertyNames'
    define(Object, function getOwnPropertyNames(obj){
      var props = getProps(obj);
      if (hasOwn.call(obj, globalID))
        props.splice(props.indexOf(globalID), 1);
      return props;
    });

    function Data(){
      var puid = createUID(),
          secret = {};

      this.unlock = function(obj){
        var store = storage(obj);
        if (hasOwn.call(store, puid))
          return store[puid](secret);

        var data = create(null, dataDesc);
        defProp(store, puid, {
          value: new Function('s', 'l', datalock)(secret, data)
        });
        return data;
      }
    }

    define(Data.prototype, function get(o){ return this.unlock(o).value });
    define(Data.prototype, function set(o, v){ this.unlock(o).value = v });

    return Data;
  }());


  var WM = (function(data){
    var validate = function(key){
      if (key == null || typeof key !== 'object' && typeof key !== 'function')
        throw new TypeError("Invalid WeakMap key");
    }

    var wrap = function(collection, value){
      var store = data.unlock(collection);
      if (store.value)
        throw new TypeError("Object is already a WeakMap");
      store.value = value;
    }

    var unwrap = function(collection){
      var storage = data.unlock(collection).value;
      if (!storage)
        throw new TypeError("WeakMap is not generic");
      return storage;
    }

    var initialize = function(weakmap, iterable){
      if (iterable !== null && typeof iterable === 'object' && typeof iterable.forEach === 'function') {
        iterable.forEach(function(item, i){
          if (item instanceof Array && item.length === 2)
            set.call(weakmap, iterable[i][0], iterable[i][1]);
        });
      }
    }


    function WeakMap(iterable){
      if (this === global || this == null || this === WeakMap.prototype)
        return new WeakMap(iterable);

      wrap(this, new Data);
      initialize(this, iterable);
    }

    function get(key){
      validate(key);
      var value = unwrap(this).get(key);
      return value === undefined_ ? undefined : value;
    }

    function set(key, value){
      validate(key);
      // store a token for explicit undefined so that "has" works correctly
      unwrap(this).set(key, value === undefined ? undefined_ : value);
    }

    function has(key){
      validate(key);
      return unwrap(this).get(key) !== undefined;
    }

    function delete_(key){
      validate(key);
      var data = unwrap(this),
          had = data.get(key) !== undefined;
      data.set(key, undefined);
      return had;
    }

    function toString(){
      unwrap(this);
      return '[object WeakMap]';
    }

    try {
      var src = ('return '+delete_).replace('e_', '\\u0065'),
          del = new Function('unwrap', 'validate', src)(unwrap, validate);
    } catch (e) {
      var del = delete_;
    }

    var src = (''+Object).split('Object');
    var stringifier = function toString(){
      return src[0] + nameOf(this) + src[1];
    };

    define(stringifier, stringifier);

    var prep = { __proto__: [] } instanceof Array
      ? function(f){ f.__proto__ = stringifier }
      : function(f){ define(f, stringifier) };

    prep(WeakMap);

    [toString, get, set, has, del].forEach(function(method){
      define(WeakMap.prototype, method);
      prep(method);
    });

    return WeakMap;
  }(new Data));

  var defaultCreator = Object.create
    ? function(){ return Object.create(null) }
    : function(){ return {} };

  function createStorage(creator){
    var weakmap = new WM;
    creator || (creator = defaultCreator);

    function storage(object, value){
      if (value || arguments.length === 2) {
        weakmap.set(object, value);
      } else {
        value = weakmap.get(object);
        if (value === undefined) {
          value = creator(object);
          weakmap.set(object, value);
        }
      }
      return value;
    }

    return storage;
  }


  if (typeof module !== 'undefined') {
    module.exports = WM;
  } else if (typeof exports !== 'undefined') {
    exports.WeakMap = WM;
  } else if (!('WeakMap' in global)) {
    global.WeakMap = WM;
  }

  WM.createStorage = createStorage;
  if (global.WeakMap)
    global.WeakMap.createStorage = createStorage;
}((0, eval)('this'));

},{}],19:[function(require,module,exports){
/* 
* The building blocks of contextual interactivity
* TODO: discuss - should bottombar be in here? Should all
* html be in here?
*/

var hyper = require('hyperscript');

var htmlBlocks = module.exports = {

	// Existing elements
	// majority: document.getElementsByClassName( "majority" )[0],
	// sampler: document.getElementsByClassName( "sampler" )[0],
	// editor-sidebar: document.getElementsByClassName( "editor-sidebar" )[0],
	// inspector: document.getElementsByClassName( "inspector" )[0],
	// assets: document.getElementsByClassName( "assets" )[0],

	_init_: function () {

		var blocks = htmlBlocks;

		// Add the main elements of .editor-sidebar
		var editorSidebar = document.getElementsByClassName( "editor-sidebar" )[0];
		editorSidebar.appendChild(blocks.editorTabs);
		editorSidebar.appendChild(blocks.inspector);
		editorSidebar.appendChild(blocks.assets);

		// Fill in the inspector
		// TODO: discuss - have a bool to determine if values will be updated?
		var inspector = document.getElementsByClassName( "inspector" )[0];

		// Assign allPermanent its values
		htmlBlocks.allPermanent = [
			htmlBlocks.sceneTree,
			htmlBlocks.objectInfo,
			htmlBlocks.transforms,
			htmlBlocks.material
		];

		// Cycle through the permanent inspector elements and add them to inspector
		var permanentElements = htmlBlocks.allPermanent;
		var numPermanent = permanentElements.length;

		for ( var indx = 0; indx < numPermanent; indx++ ) {
			inspector.appendChild(permanentElements[indx]);

			// Add an hr after, but not after the last component
			// To better understand, see userComponents loop
			if ( indx < numPermanent - 1 ) {
				var hr = document.createElement('hr');
				inspector.appendChild(hr);
			}
		}

		// Assign userComponents its values (hard coded right now)
		htmlBlocks.userComponents = [
			htmlBlocks.sample1
		];

		// Iterate through components, adding each to the inspector
		var userComponents = htmlBlocks.userComponents;
		var numComponents = userComponents.length;

		for ( var indx = 0; indx < numComponents; indx++ ) {

			// This time add a hr above each element
			var hr = document.createElement('hr');
			inspector.appendChild(hr);

			inspector.appendChild(userComponents[indx]);

		}

		document.getElementsByClassName( "sampler" )[0].appendChild(blocks.sampler);

	},


	/* ===================================
	   Blocks
	   ==================================== */

	sampler: hyper( 'div', 'Test sampler' ),

	editorTabs:
		hyper( 'div.tab-container',  // element for js
			hyper( 'div.tab.spacer', 'Inspector' ),
			hyper( 'menu#sidebar-nav.tab-bar',  // id for jump to top
				hyper( 'li.tab.inspector-get.active-tab', 'Inspector' ),
				hyper( 'li.tab.assets-get', 'Assets' )
			)
		),  // end editorTabs

	inspector: hyper( 'div.inspector' ),
	// "<div class='inspector'></div>",

	assets: hyper( 'div.assets.collapsed' ),
	// "<div class='assets'></div>",

	sceneTree:
		hyper( 'section.scene-tree-container',

			hyper( 'h1',
				hyper( 'button.collapser.expanded',
					hyper( 'img', { src: 'images/arrow-small.png', alt: 'Click to collapse' })
				),
				'Scene Object Tree'
			),

			hyper( 'div.collapsible',
				// Maybe not a menu, menu isn't supported by most browsers
				hyper( 'menu.scene-tree',
					// Clicking on an object should select it in the scene
					hyper( 'ul',

						hyper( 'li.scene-obj.obj-1',

							hyper( 'div.selectable',
								// TODO: only give an object a collapser if it has children
								hyper( 'button.collapser.expanded',
									hyper('img',  { src: 'images/arrow-small.png',
										alt: 'Click to collapse' })
								),  // end button.collapser
								'Some Object 1'
							)

						)  // end li.obj-1
					)  // end ul

				),  // end menu.scene-tree
					
				hyper( 'div.jump-container',
					hyper( 'a.tiny-text.jump-to-top', {href: '#sidebar-nav'},
						'Jump to top'
					)
				)
			)  // end div.collapsible

		)  // end .scene-tree-container
	,  // end sceneTree

	objectInfo:
		hyper( 'section.component.obj-info', 

			hyper( 'h1',
				hyper( 'button.collapser.expanded',
					hyper( 'img',  { src: 'images/arrow-small.png',
						alt: 'Click to collapse' })
				),  // end button.collapser
				'Object Info'
			),

			hyper( 'div.collapsible',
				hyper( 'form',

					hyper( 'ul',

						hyper( 'li.child',
							hyper( 'label', 'Prefab:',
								hyper( 'select', {name: 'prefab'},
									hyper('option', 'None (make unique)'),
									hyper('option', 'Prefab 1'),
									hyper('option', 'Prefab 2')
								)
							)  // end label (Prefab)
						),  // end li

						hyper( 'li.child',
							hyper( 'label', 'name:',
								hyper( 'input', {name: 'name', type: 'text'}
								)
							)  // end label (name)
						),  // end li

						hyper( 'li.child',
							hyper( 'label', 'id:',
								hyper( 'input', {name: 'id', type: 'text'}
								)
							)  // end label (id)
						),  // end li

						hyper( 'li.child',
							hyper( 'label', 'foo:',
								hyper( 'input', {name: 'foo', type: 'text'}
								)
							)  // end label (foo)
						)  // end li

					)  // end ul

				),  // end form

				hyper( 'div.jump-container',
					hyper( 'a.tiny-text.jump-to-top', {href: '#sidebar-nav'},
						'Jump to top'
					)
				)
			)  // end div.collapsible

		),  // end objectInfo

	// Editable transforms with buttons to activate manipulation
	// of position, rotation, and scale
	transforms:
		hyper( 'section.component.transforms',

			hyper( 'h1',
				hyper( 'button.collapser.expanded',
					hyper( 'img',  { src: 'images/arrow-small.png',
						alt: 'Click to collapse' })
				),  // end button.collapser
				'Transforms'
			),

			hyper( 'div.collapsible',

				hyper( 'form',

					hyper( 'fieldset.position',
						hyper( 'legend', hyper('button', 'position')),

						hyper( 'ul',

							hyper( 'li.child',
								hyper( 'label', 'x:',
									// .number for alternative num manipulation
									hyper('input.x-coord.number', {name: 'x-coord', type: 'number'})
								)
							),  // end li

							hyper( 'li.child',
								hyper( 'label', 'y:',
									hyper('input.y-coord.number', {name: 'y-coord', type: 'number'})
								)
							),

							hyper( 'li.child',
								hyper( 'label', 'z:',
									hyper('input.z-coord.number', {name: 'z-coord', type: 'number'})
								)
							)

						)  // end ul

					),  // end .position

					hyper( 'fieldset.rotation',
						hyper( 'legend', hyper('button', 'rotation')),

						hyper( 'ul',

							hyper( 'li.child',
								hyper( 'label', 'x:',
									hyper('input.x-rot.number', {name: 'x-rot', type: 'number'})
								)
							),  // end li

							hyper( 'li.child',
								hyper( 'label', 'y:',
									hyper('input.y-rot.number', {name: 'y-rot', type: 'number'})
								)
							),  // end li

							hyper( 'li.child',
								hyper( 'label', 'z:',
									hyper('input.z-rot.number', {name: 'z-rot', type: 'number'})
								)
							)  // end li

						)  // end ul

					),  // end .rotation

					hyper( 'fieldset.scale',
						hyper( 'legend', hyper('button', 'scale')),

						hyper( 'ul',

							hyper( 'li.child',
								hyper( 'label', 'x:',
									// .number for alternative num manipulation
									hyper('input.x-scale.number', {name: 'x-scale', type: 'number'})
								)
							),  // end li

							hyper( 'li.child',
								hyper( 'label', 'y:',
									// .number for alternative num manipulation
									hyper('input.y-scale.number', {name: 'y-scale', type: 'number'})
								)
							),  // end li

							hyper( 'li.child',
								hyper( 'label', 'z:',
									// .number for alternative num manipulation
									hyper('input.z-scale.number', {name: 'z-scale', type: 'number'})
								)
							)  // end li

						)  // end ul

					)  // end .scale

				),  // end form

				hyper( 'div.jump-container',
					hyper( 'a.tiny-text.jump-to-top', {href: '#sidebar-nav'},
						'Jump to top'
					)
				)
			)  // end div.collapsible

		)  // end .transforms
	,  // end transforms

	material:
		hyper( 'section.component.material',
			hyper( 'h1',
				hyper( 'button.collapser.expanded',
					hyper( 'img',  { src: 'images/arrow-small.png',
						alt: 'Click to collapse' })
				),  // end button.collapser
				'Material'
			),

			hyper ( 'div.collapsible',
				hyper( 'form',

					hyper( 'ul',

						hyper( 'li.child',
							hyper( 'label', 'var blar:',
								// .number for alternative num manipulation
								hyper('input.blar.number', {type: 'number'})
							)
						),  // end li

						hyper( 'li.child',
							'color interface'
						)  // end li

					)  // end ul

				),  // end form

				hyper( 'div.jump-container',
					hyper( 'a.tiny-text.jump-to-top', {href: '#sidebar-nav'},
						'Jump to top'
					)
				)
			)  // end div.collapsible

		)  // end section.material
	,  // end material

	sample1:
		hyper( 'section.component.componentType',

			hyper( 'h1',
				hyper( 'button.collapser.expanded',
					hyper( 'img',  { src: 'images/arrow-small.png',
						alt: 'Click to collapse' })
				),  // end button.collapser
				'Sample Component 1'
			),

			hyper( 'div.collapsible',
				hyper( 'form',

					hyper( 'ul',

						hyper( 'li.child',
							hyper( 'label', 'var num 2:',
								// .number for alternative num manipulation
								hyper('input.num1.number', {type: 'number'})
							)
						),  // end li

						hyper( 'li.child',
							hyper( 'label', 'var num 1:',
								// .number for alternative num manipulation
								hyper('input.num2.number', {type: 'number'})
							)
						)  // end li

					)  // end ul

				),  // end form

				hyper( 'div.jump-container',
					hyper( 'a.tiny-text.jump-to-top', {href: '#sidebar-nav'},
						'Jump to top'
					)
				)
			)  // end div.collapsible

		)  // end .componentType
	,  // end sample1

	// 'Components' that are always present
	allPermanent: [
		// Will contain (assigned in _init_()):
		// htmlBlocks.sceneTree,
		// htmlBlocks.objectInfo,
		// htmlBlocks.transforms
		// htmlBlocks.material
	],

	// Components the user adds
	userComponents: [
		// htmlBlocks.sample1
	],

	/* ===================================
	   Functions
	   ==================================== */

	// --- Components --- \\
	createComponent: function () {

	},

	changeComponent: function () {

	},

};  // end htmlBlocks{}

},{"hyperscript":11}],20:[function(require,module,exports){
/* based on libraries of three.js with @author mrdoob / http://mrdoob.com/ */

module.exports = cubeWorld = function () {

	var camera, scene, renderer;
	var geometry, material, mesh;

	var objects = [];

	var ray;

	init();
	animate();

	function init() {

		// Hack to get require and hover working
		// Need to be declared in here or values = undefined.
		cubeWorld.controls = null;
		
		cubeWorld.camera = null;
		cubeWorld.scene = null;
		cubeWorld.renderer = null;

		cubeWorld.geometroy = null;
		cubeWorld.material = null;
		cubeWorld.mesh = null;

		cubeWorld.objects = [];

		cubeWorld.ray = null;

		// For selecting objects
		cubeWorld.projector = new THREE.Projector();
		cubeWorld.raycaster = new THREE.Raycaster();

		// Onwards!
		cubeWorld.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );

		cubeWorld.scene = new THREE.Scene();
		cubeWorld.scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

		var light = new THREE.DirectionalLight( 0xffffff, 1.5 );
		light.position.set( 1, 1, 1 );
		cubeWorld.scene.add( light );

		var light = new THREE.DirectionalLight( 0xffffff, 0.75 );
		light.position.set( -1, - 0.5, -1 );
		cubeWorld.scene.add( light );

		cubeWorld.controls = new THREE.PointerLockControls( cubeWorld.camera );
		cubeWorld.scene.add( cubeWorld.controls.getObject() );

		ray = new THREE.Raycaster();
		ray.ray.direction.set( 0, -1, 0 );

		// floor

		cubeWorld.geometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
		cubeWorld.geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

		for ( var i = 0, l = cubeWorld.geometry.vertices.length; i < l; i ++ ) {

			var vertex = cubeWorld.geometry.vertices[ i ];
			vertex.x += Math.random() * 20 - 10;
			vertex.y += Math.random() * 2;
			vertex.z += Math.random() * 20 - 10;

		}

		for ( var i = 0, l = cubeWorld.geometry.faces.length; i < l; i ++ ) {

			var face = cubeWorld.geometry.faces[ i ];
			face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
			face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
			face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

		}

		cubeWorld.material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

		cubeWorld.mesh = new THREE.Mesh( cubeWorld.geometry, cubeWorld.material );
		cubeWorld.scene.add( cubeWorld.mesh );

		// objects

		cubeWorld.geometry = new THREE.BoxGeometry( 20, 20, 20 );

		for ( var i = 0, l = cubeWorld.geometry.faces.length; i < l; i ++ ) {

			var face = cubeWorld.geometry.faces[ i ];
			face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
			face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
			face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

		}

		for ( var i = 0; i < 500; i ++ ) {

			cubeWorld.material = new THREE.MeshPhongMaterial( { specular: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );

			var mesh = new THREE.Mesh( cubeWorld.geometry, cubeWorld.material );
			mesh.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
			mesh.position.y = Math.floor( Math.random() * 20 ) * 20 + 10;
			mesh.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;
			cubeWorld.scene.add( mesh );

			cubeWorld.material.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

			cubeWorld.objects.push( mesh );

		}

		//

		cubeWorld.renderer = new THREE.WebGLRenderer();
		cubeWorld.renderer.setClearColor( 0xffffff );
		cubeWorld.renderer.setSize( window.innerWidth, window.innerHeight );

		document.body.appendChild( cubeWorld.renderer.domElement );

		//

		window.addEventListener( 'resize', onWindowResize, false );

	}

	function onWindowResize() {

		cubeWorld.camera.aspect = window.innerWidth / window.innerHeight;
		cubeWorld.camera.updateProjectionMatrix();

		cubeWorld.renderer.setSize( window.innerWidth, window.innerHeight );

	}

	function animate() {

		requestAnimationFrame( animate );

		cubeWorld.controls.isOnObject( false );

		ray.ray.origin.copy( cubeWorld.controls.getObject().position );
		ray.ray.origin.y -= 10;

		var intersections = ray.intersectObjects( cubeWorld.objects );

		if ( intersections.length > 0 ) {

			var distance = intersections[ 0 ].distance;

			if ( distance > 0 && distance < 10 ) {

				cubeWorld.controls.isOnObject( true );

			}

		}

		cubeWorld.controls.update();

		cubeWorld.renderer.render( cubeWorld.scene, cubeWorld.camera );

	}

};

},{}]},{},[1])