var listenForPeers = require('./lib/network.js')

var LookingGlass = require('./lib/LookingGlass.js')
var LookingGlassObject = require('./lib/LookingGlassObject.js')

var LGMaterial = require('./example/LGMaterial.js')
var LGMeshBasicMaterial = require('./example/LGMeshBasicMaterial.js')

var LGGeometry = require('./example/LGGeometry.js')
var LGBoxGeometry = require('./example/LGBoxGeometry.js')

var LGObject3D = require('./example/LGObject3D.js')
var LGScene = require('./example/LGScene.js')
var LGMesh = require('./example/LGMesh.js')


var isServer = (location.search === '?server')
start()

function start() {

  if (isServer) console.log( 'SERVER' )
  
  listenForPeers(function( peerConnection ) {
    console.log( 'connected.' )

    // if Server, route conncetions through a WatchTower or Portcullis or something nifty

    // enhance connection (lol)
    peerConnection.emitReliable = peerConnection.emit
    peerConnection.emitUnreliable = peerConnection.emit
    
    universe = new LookingGlass( peerConnection )
    
    // note - you must manually register the whole class hierarchy
    // Material
    universe.registerClass( LGMaterial )
    universe.registerClass( LGMeshBasicMaterial )
    // Geometry
    universe.registerClass( LGGeometry )
    universe.registerClass( LGBoxGeometry )
    // Object3D
    universe.registerClass( LGObject3D )
    universe.registerClass( LGScene )
    universe.registerClass( LGMesh )

    // create some test stuff just on the server
    if (isServer) {

      var scene = new universe.classes.LGScene({ id: 'primaryScene' })

      var parentMaterial = new universe.classes.LGMeshBasicMaterial({ color: 0xff0000, })
      var childMaterial = new universe.classes.LGMeshBasicMaterial({ color: 0x00ff00, })

      var parentGeometry = new universe.classes.LGBoxGeometry({ size: 50, })
      var childGeometry = new universe.classes.LGBoxGeometry({ size: 25, })

      var parent = new universe.classes.LGMesh({ id: 'parent', geometry: parentGeometry.id, material: parentMaterial.id })
      var child = new universe.classes.LGMesh({ id: 'child', geometry: childGeometry.id, material: childMaterial.id })

      parent.add( child )
      scene.add( parent )

    }

    // wait one frame, for both scenes to sync
    setTimeout( function(){
      buildWorld( universe.instances.primaryScene.core )
    }, 0)

  })


}

window.buildWorld = buildWorld

function buildWorld( scene ) {

  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 )
  camera.position.set(-40,0,-40)
  camera.setRotationFromEuler( new THREE.Euler(Math.PI, -0.75, Math.PI) )

  var renderer = new THREE.WebGLRenderer()
  renderer.setClearColor( 0xffffff )
  renderer.setSize( window.innerWidth, window.innerHeight )
  document.body.appendChild( renderer.domElement )

  runLoop()

  function runLoop() {
    
    requestAnimationFrame( runLoop )

    // camera.rotateY( 0.025 )
    renderer.render( scene, camera )

  }
}

