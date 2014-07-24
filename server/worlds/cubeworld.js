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
