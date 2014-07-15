THREE = require('three')

module.exports = function( universe ) {

  var LGGeometry = universe.classes.LGGeometry
  var __instances__ = universe.instances

  LGBoxGeometry.prototype = Object.create( LGGeometry.prototype )
  LGBoxGeometry.prototype.constructor = LGBoxGeometry
  LGBoxGeometry.type = 'LGBoxGeometry'

  function LGBoxGeometry( args, skipInitialization, fromRemote ) {

    // call SuperClass, but skip initialization
    LGGeometry.call( this, args, true, fromRemote )

    // define properties
    this._defineProperties({
      size:  { type: 'float', default: 10, },
    })

    this.on('size', function( size ) {
      
      // this.core.dispose()
      // // https://github.com/mrdoob/three.js/wiki/Updates#geometries
      // var geometry = new THREE.BoxGeometry( size, size, size )
      // geometry.verticesNeedUpdate = true;
      // geometry.elementsNeedUpdate = true;
      // geometry.morphTargetsNeedUpdate = true;
      // geometry.uvsNeedUpdate = true;
      // geometry.normalsNeedUpdate = true;
      // geometry.colorsNeedUpdate = true;
      // geometry.tangentsNeedUpdate = true;

      // this.core = geometry

    })

    // initialize after we're done defining properties, allowing the subClass to define properties
    if (!skipInitialization) this._initialize(args, fromRemote)

  }

  //
  // Public
  //

  

  //
  // Private
  //

  LGBoxGeometry.prototype._createCore = function(args) {
    return new THREE.BoxGeometry( 1, 1, 1 )
  }


  return LGBoxGeometry

}