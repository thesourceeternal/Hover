/*
* Creation, display, and updating of axes gizmos
* Uses .prototype for inheritance to save on memory
*/

var cubeWorld = require('../../server/worlds/cubeworld.js');


'use strict'

module.exports = transformGizmos = function (color, object, direction) {

	// Places the axes depending on where it's center should be
	placeAxesOrigin = function ( point ) {};  // end placeAxesOrigin()

	// The basic material for all the bits of the axis:
	// The lines and ends/terminals of the lines and the circles
	// Doesn't include color
	GizmoMaterial = function () {};  // end GizmoMaterial();

	// THREE.MeshBasicMaterial.prototype is assumed
	GizmoMaterial.prototype = new THREE.MeshBasicMaterial;

	// Draws an axis line for translate and scale
	Line = function ( object, axis ) {

		var scene = cubeWorld.scene;
		var renderer = cubeWorld.renderer;
		var camera = cubeWorld.camera;

	console.log("in transformGizmos Line()");

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
	    renderer.render(scene, camera);

	};  // end Line()

	// Can't do Line.prototype: ... in an object declaration ( var x = {} )
	// THREE.MeshBasicMaterial.prototype is assumed
	Line.prototype = new THREE.LineBasicMaterial;

	// For testing: create one line with one axis
	Line( color, object, direction );

	// Draws an axis circle for rotation
	Circle = function ( object, axis ) {};  // end Circle()



	// The end of the line will go in Scale and Transform

};

