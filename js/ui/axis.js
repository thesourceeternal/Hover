/*
* Creation, display, and updating of axes gizmos
* Uses .prototype for inheritance to save on memory
*/

var cubeWorld = require('../../server/worlds/cubeworld.js');


'use strict'

module.exports = transformGizmos = function (color, object, direction) {

	// Places the axes depending on where it's center should be
	// object is the data for the object that will have the axis
	// mode will determine where the axis will be relative to the object
	placeAxesOrigin = function ( object, mode ) {};  // end placeAxesOrigin()

	// The basic material for all the bits of the axis:
	// The ends/terminals of the lines, the circles,
	// the center, and the planes
	// Doesn't include color
	GizmoMaterial = function () {};  // end GizmoMaterial();

	// THREE.MeshBasicMaterial.prototype is assumed
	GizmoMaterial.prototype = new THREE.MeshBasicMaterial;

	// Draws an axis line for translate and scale
	// axis sets which axis is being drawn. Determines
	// direction and color
	// originMode sets where the origin of the line will
	// be in relation to object
	Line = function ( object, originMode, axis ) {

		console.log("in transformGizmos Line()");

		var scene = cubeWorld.scene;
		var renderer = cubeWorld.renderer;
		var camera = cubeWorld.camera;

		// Later will be determined by axis
		var material = new THREE.LineBasicMaterial({
			color: 0x0000ff
		});

		// Later will be in the object
		// Can prototype fit in here? No need, over optimization
		// jus curious about future performance
		var geometry = new THREE.Geometry();
	    geometry.vertices.push(new THREE.Vector3(-10, 0, 0));
	    geometry.vertices.push(new THREE.Vector3(0, 30, 0));
	    geometry.vertices.push(new THREE.Vector3(10, 0, 0));

	    var line = new THREE.Line(geometry, material);
	    scene.add(line);

	};  // end Line()

	// Can't do Line.prototype: ... in an object declaration ( var x = {} )
	// THREE.MeshBasicMaterial.prototype is assumed
	Line.prototype = new THREE.LineBasicMaterial;

	// For testing: create one line with one axis
	Line( color, object, direction );

	// Draws an axis circle for rotation
	Circle = function ( object, originMode, axis ) {};  // end Circle()

	Cube = function ( object, originMode, axis ) {

		var geometry = new THREE.BoxGeometry(100, 100, 100);
		var material = new THREE.MeshLambertMaterial({ color: 0x1ec876 });
		var cube = new THREE.Mesh(geometry, material);



	};

	Cube();


	// The end of the line will go in Scale and Transform

};

