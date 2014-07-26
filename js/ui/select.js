/*
* Handles selection of objects in fps and with the editor
*/

var cubeWorld = require('../../server/worlds/cubeworld.js');
var userState = require('../userState.js');

var transformControls = require('../thirdparty/transformControls.js');

module.exports = select = {

	// Perhaps relocate to userState
	// selected: null,
	oldSelected: null,

	axis: null,

	// Set up the transform controlers/axis
	// TODO: Make only one axis object and move it around
	// TODO: Make a pointerlock select locking mechanism so
	// objects can be selected and moved while in pointerlock
	// TODO: make an arrow point to the axis if the axis is off-screen
	_init_: function () {

		var renderer = cubeWorld.renderer;
		var camera = cubeWorld.camera;
		var scene = cubeWorld.scene;

		var domElement = document.getElementsByTagName("canvas")[0];

		select.axis = new THREE.TransformControls( camera, renderer.dom );

		select.axis.setMode("translate");

		scene.add(select.axis);

	},

	// Perhaps relocate raycaster and projector into here

	// Hovering will select objects to get show info
	enableHoverSelection: function () {

		document.removeEventListener('click', select.ifSceneObject, false);
		document.addEventListener('mousemove', select.ifSceneObject, false);

	},  // end enableHoverSelection()

	// Clicking will select objects
	disableHoverSelection: function () {

		document.removeEventListener('mousemove', select.ifSceneObject, false);
		document.addEventListener('click', select.ifSceneObject, false);

	},  // end disableHoverSelection()

	// Determines and, if needed sets, the object currently being selected
	ifSceneObject: function (event) {

		// TODO: Test if the mouse is over the canvas
		var inScene = true;

		if ( inScene ) {

			var newObj = select.getHover(event);

			if ( newObj !== userState.selectedObj ) {

				select.selectObject(newObj);

			}

		}

	},  // end ifSceneObject()

	// Determines what object the mouse is currently on
	getHover: function (event) {

		// return cubeWorld.scene.children[0];
		var intersectors = select.getScreenIntersects(event);

		// Get the closest object under the mouse, if any
		if ( intersectors[0] ) {

			// change color of reticule

			return intersectors[0].object;

		} else {  // no object is selected, show that

			userState.selectedObj = undefined;

		}

	},  // end getHover()

	// Checks what the nearest object intersection is
	getScreenIntersects: function (event) {

		// The screen coordinates of the origin of the ray
		var mouseCoords;
		var element = cubeWorld.renderer.domElement;

		if ( event ) {

			var rect = element.getBoundingClientRect();
			// Get the position of the mouse on the screen
			mouseCoords = {
				// The mouse position inside the window
				// TODO: discuss - is centering not enough with pointer lock?
				x: (( event.clientX - rect.left ) / rect.width) * 2 - 1,
			    y: (( event.clientY - rect.top ) / rect.height) * -2 + 1,
			}

		} else {
			console.error("select.getScreenIntersects was called with no event.");
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

	// 	object.transformControls.attach


	// function setTransformControlTarget() {
      
 //      var target = this.getSelectedObject()
 //      this.transformControls.detach()
 //      if ( this.currentMode === 'scene' && target ) {
 //        // attach gizmo
 //        this.transformControls.attach( target )
 //        // // orient gizmo
 //        // var lookTarget = this.fpsControls.getObject().position
 //        // directionVector = this.transformControls.position.clone().sub(lookTarget).setY(0).normalize()
 //        // var angle = 0.75 * Math.PI + Math.atan2(directionVector.x,directionVector.z)
 //        // this.transformControls.setRotationFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), angle )
 //      }

    // }  // end setTransformControlTarget()

		// showAxis(type)
		// place(where)

	},

}

