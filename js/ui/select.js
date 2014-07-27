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
		select.axis = new THREE.TransformControls( camera, undefined );
		// With this, selecting and moving axis doesn't work in pointer lock
		// select.axis = new THREE.TransformControls( camera, renderer.domElement );

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

