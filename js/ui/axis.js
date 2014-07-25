/*
* Creation, display, and updating of axes gizmos
*/

var cubeWorld = require('../../server/worlds/cubeworld.js');


'use strict'

module.exports = transformGizmos = {

	// create one line
	createLine: function ( color, object ) {

		var scene = cubeWorld.scene;
		var renderer = cubeWorld.renderer;
		var camera = cubeWorld.camera;

	console.log("in transformGizmos createLine()");

		// Later will use argument color
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

	},


};

