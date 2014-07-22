/* based on libraries of three.js with @author mrdoob / http://mrdoob.com/ */

module.exports = cubeWorld = function () {

	// Hack to get require working
	this.controls = null;

	var camera, scene, renderer;
	var geometry, material, mesh;

	var objects = [];

	var ray;

	init();
	animate();

	function init() {

		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );

		scene = new THREE.Scene();
		scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

		var light = new THREE.DirectionalLight( 0xffffff, 1.5 );
		light.position.set( 1, 1, 1 );
		scene.add( light );

		var light = new THREE.DirectionalLight( 0xffffff, 0.75 );
		light.position.set( -1, - 0.5, -1 );
		scene.add( light );

		cubeWorld.controls = new THREE.PointerLockControls( camera );
		scene.add( cubeWorld.controls.getObject() );

		ray = new THREE.Raycaster();
		ray.ray.direction.set( 0, -1, 0 );

		// floor

		geometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

		for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {

			var vertex = geometry.vertices[ i ];
			vertex.x += Math.random() * 20 - 10;
			vertex.y += Math.random() * 2;
			vertex.z += Math.random() * 20 - 10;

		}

		for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {

			var face = geometry.faces[ i ];
			face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
			face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
			face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

		}

		material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

		mesh = new THREE.Mesh( geometry, material );
		scene.add( mesh );

		// objects

		geometry = new THREE.BoxGeometry( 20, 20, 20 );

		for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {

			var face = geometry.faces[ i ];
			face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
			face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
			face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

		}

		for ( var i = 0; i < 500; i ++ ) {

			material = new THREE.MeshPhongMaterial( { specular: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );

			var mesh = new THREE.Mesh( geometry, material );
			mesh.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
			mesh.position.y = Math.floor( Math.random() * 20 ) * 20 + 10;
			mesh.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;
			scene.add( mesh );

			material.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

			objects.push( mesh );

		}

		//

		renderer = new THREE.WebGLRenderer();
		renderer.setClearColor( 0xffffff );
		renderer.setSize( window.innerWidth, window.innerHeight );

		document.body.appendChild( renderer.domElement );

		//

		window.addEventListener( 'resize', onWindowResize, false );

	}

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

	}

	function animate() {

		requestAnimationFrame( animate );

		cubeWorld.controls.isOnObject( false );

		ray.ray.origin.copy( cubeWorld.controls.getObject().position );
		ray.ray.origin.y -= 10;

		var intersections = ray.intersectObjects( objects );

		if ( intersections.length > 0 ) {

			var distance = intersections[ 0 ].distance;

			if ( distance > 0 && distance < 10 ) {

				cubeWorld.controls.isOnObject( true );

			}

		}

		cubeWorld.controls.update();

		renderer.render( scene, camera );

	}

};
