/*
* Creation, display, and updating of axes gizmos
* Uses .prototype for inheritance to save on memory
*/

var cubeWorld = require('../../server/worlds/cubeworld.js');


'use strict'

module.exports = transformGizmos = function (color, object, direction) {

	// The axes
	var xColor = "rgb(217, 37, 37)",
		yColor = "rgb(42, 199, 115)",
		zColor = "rgb(87, 91, 217)";

	var xEndpoint = new THREE.Vector3(3, 0, 0),
		yEndpoint = new THREE.Vector3(0, 3, 0),
		zEndpoint = new THREE.Vector3(0, 0, 3);


	// // Places the axes depending on where it's center should be
	// // object is the data for the object that will have the axis
	// // mode will determine where the axis will be relative to the object
	// var placeAxesOrigin = function ( object, mode ) {};  // end placeAxesOrigin()

	// IS THIS NECESSARY?
	// The basic material for all the bits of the axis:
	// The ends/terminals of the lines, the circles,
	// the center, and the planes
	// Doesn't include color
	var GizmoMaterial = function () {	

		this.transparent = true;
		material.opacity = 0.75;

	};  // end GizmoMaterial();

	// THREE.MeshBasicMaterial.prototype is assumed
	GizmoMaterial.prototype = new THREE.MeshBasicMaterial;

	// --- Line --- \\
	// Draws an axis line for translate and scale
	// axis sets which axis is being drawn. Determines
	// direction and color
	// originMode sets where the origin of the line will
	// be in relation to object
	var Line = function ( object, originMode, axis ) {

		var scene = cubeWorld.scene;

		var	material;
		// The location of the center of the cube
		var x, y, z;

		if ( axis === "x" ) {

			material = new THREE.LineBasicMaterial({ color: xColor });
			x = 3.5; y = 0; z = 0;

		} else if ( axis === "y" ) {

			material = new THREE.LineBasicMaterial({ color: yColor });
			x = 0; y = 3.5; z = 0;

		} else if ( axis === "z" ) {

			material = new THREE.LineBasicMaterial({ color: zColor });
			x = 0; y = 0; z = 3.5;

		} else {

			console.error("You have provided an invalid axis. Permited: x, y, z");
			return;

		}

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
	Line( "color", "object", "y" );

	// --- Circle --- \\
	// Draws an axis circle for rotation
	var Circle = function ( object, originMode, axis ) {};  // end Circle()

	Circle.prototype = new THREE.LineBasicMaterial();;


	// --- Cube --- \\
	// axis sets which axis is being drawn. Determines
	// color and location
	// originMode sets where the origin of the line will
	// be in relation to object
	var Cube = function ( object, originMode, axis ) {

		var scene = cubeWorld.scene;
		var geometry = new THREE.BoxGeometry(1, 1, 1);
		
		var	material;
		// The location of the center of the cube
		var x, y, z;

		if ( axis === "x" ) {

			material = new THREE.MeshLambertMaterial({ color: xColor });
			x = 3.5; y = 0; z = 0;

		} else if ( axis === "y" ) {

			material = new THREE.MeshLambertMaterial({ color: yColor });
			x = 0; y = 3.5; z = 0;

		} else if ( axis === "z" ) {

			material = new THREE.MeshLambertMaterial({ color: zColor });
			x = 0; y = 0; z = 3.5;

		} else {

			console.error("You have provided an invalid axis. Permited: x, y, z");
			return;

		}

		material.transparent = true;
		material.opacity = 0.75;

		var cube = new THREE.Mesh( geometry, material );
		cube.position = new THREE.Vector3( x, y, z );

		scene.add(cube);

	};  // end Cube

	Cube("object", "center", "x");
	Cube("object", "center", "y");
	Cube("object", "center", "z");


	// The end of the line will go in Scale and Transform

};

