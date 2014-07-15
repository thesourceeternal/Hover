THREE = require('three')
var listenForPeers = require('./lib/network.js')
var EvilRobot = require('./lib/EvilRobot.js')
var FloatingCastle = require('./lib/FloatingCastle.js')

var peers = []
var isServer = (location.search === '?server')

// var camera
var renderer

// var castle

start()

function start() {

  if (isServer) console.log( 'SERVER' )
  listenForPeers(function( peerConnection ) {
    console.log( 'connected.' )
    
    // if Server, route conncetions through a WatchTower or Portcullis or something nifty

    castle = new FloatingCastle({ connection: peerConnection })
    castle.registerClass( EvilRobot )

    buildWorld()
    runLoop()

  })


}

function onPeerConnect( streamToPeer ) {

  console.log('connect')
  // peer.emit('initial', initialData)

}

function buildWorld() {
  // setup scene
  scene = castle.scene
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 )
  camera.position.set(-40,0,-40)
  camera.setRotationFromEuler( new THREE.Euler(Math.PI, -0.75, Math.PI) )
  // var light = new THREE.DirectionalLight( 0xffffff, 1.5 )
  // light.position.set( 1, 1, 1 )
  // scene.add( light )
  renderer = new THREE.WebGLRenderer()
  renderer.setClearColor( 0xffffff )
  renderer.setSize( window.innerWidth, window.innerHeight )
  document.body.appendChild( renderer.domElement )
}

function runLoop() {
  
  requestAnimationFrame( runLoop )

  // camera.rotateY( 0.025 )
  renderer.render( castle.scene, camera )

}

window.x = function() {

  var mike = new EvilRobot({
    name: 'mike',
    position: [ randomNumber(-40,40), randomNumber(-40,40), randomNumber(-40,40) ],
    rotation: [ randomNumber(0,90), randomNumber(0,90), randomNumber(0,90) ],
  })
  castle.add( mike )

}


function randomNumber(low,high) {
  return (high-low)*Math.random()+low
}















// var syncDocOverNetwork = require('./lib/network.js')
// var Crdt = require('crdt')

// sharedDocument = new Crdt.Doc()
// syncDocOverNetwork( sharedDocument )



// // stuff
// var boxRegistry = {}

// // start
// runLoop()

// window.x = function() {

//   sharedDocument.add({
//     boxSize: 10,
//     position: [ 40, 0, 0 ],
//     rotation: [0, 0, 0],
//   })

//   sharedDocument.add({
//     boxSize: 10,
//     position: [ -40, 0, 40 ],
//     rotation: [0, 0, 0],
//   })

//   sharedDocument.add({
//     boxSize: 10,
//     position: [ 40, 0, 40 ],
//     rotation: [0, 0, 0],
//   })

//   sharedDocument.add({
//     boxSize: 10,
//     position: [ 40, 0, -40 ],
//     rotation: [0, 0, 0],
//   })

// }

// window.y = function() {

//   setTimeout(spinEm,1)

//   function spinEm() {

//     setTimeout(spinEm,1)

//     Object.keys(boxRegistry).map(function(key){
//       var box = boxRegistry[key].syncedData
//       var rot = box.get('rotation')
//       rot[1] += 0.05
//       box.set('rotation',rot)
//     })

//   }

// }

// function runLoop() {
  
//   requestAnimationFrame( runLoop )

//   camera.rotateY( 0.025 )
//   renderer.render( scene, camera )

// }

// sharedDocument.on('create', createBox )
// sharedDocument.on('row_update', updateBox )

// function createBox(syncedData) {

//   console.log(  'creating box')

//   var data = syncedData.state

//   var geometry = new THREE.BoxGeometry( data.boxSize, data.boxSize, data.boxSize )
//   var material = new THREE.MeshNormalMaterial()
//   var mesh = new THREE.Mesh( geometry, material )
//   scene.add( mesh )

//   boxRegistry[ syncedData.id ] = { mesh: mesh, syncedData: syncedData }

// }

// function updateBox(syncedData) {

//   var data = syncedData.state
//   var mesh = boxRegistry[ syncedData.id ].mesh

//   var position = data.position || [0,0,0]
//   var rotation = data.rotation || [0,0,0]

//   console.log('update!')

//   mesh.position.set( position[0], position[1], position[2] )
//   mesh.rotation.set( rotation[0], rotation[1], rotation[2] )

// }