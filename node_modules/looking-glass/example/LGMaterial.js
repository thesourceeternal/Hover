THREE = require('three')

module.exports = function( universe ) {

  var LookingGlassObject = universe.classes.LookingGlassObject
  var __instances__ = universe.instances

  LGMaterial.prototype = Object.create( LookingGlassObject.prototype )
  LGMaterial.prototype.constructor = LGMaterial
  LGMaterial.type = 'LGMaterial'

  function LGMaterial( args, skipInitialization, fromRemote ) {

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

  LGMaterial.prototype._createCore = function() {
    return new THREE.Material()
  }


  return LGMaterial

}