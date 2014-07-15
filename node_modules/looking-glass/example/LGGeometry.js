THREE = require('three')

module.exports = function( universe ) {

  var LookingGlassObject = universe.classes.LookingGlassObject
  var __instances__ = universe.instances

  LGGeometry.prototype = Object.create( LookingGlassObject.prototype )
  LGGeometry.prototype.constructor = LGGeometry
  LGGeometry.type = 'LGGeometry'

  function LGGeometry( args, skipInitialization, fromRemote ) {

    // call SuperClass, but skip initialization
    LookingGlassObject.call( this, args, true, fromRemote )

    // initialize after we're done defining properties, allowing the subClass to define properties
    if (!skipInitialization) this._initialize(args, fromRemote)

  }

  //
  // Public
  //

  

  //
  // Private
  //

  LGGeometry.prototype._createCore = function() {
    return new THREE.Geometry()
  }


  return LGGeometry

}