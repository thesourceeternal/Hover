THREE = require('three')

module.exports = function( universe ) {

  var LGObject3D = universe.classes.LGObject3D
  var __instances__ = universe.instances

  LGScene.prototype = Object.create( LGObject3D.prototype )
  LGScene.prototype.constructor = LGScene
  LGScene.type = 'LGScene'

  function LGScene( args, skipInitialization, fromRemote ) {

    // call SuperClass, but skip initialization
    LGObject3D.call( this, args, true, fromRemote )

    // initialize after we're done defining properties, allowing the subClass to define properties
    if (!skipInitialization) this._initialize(args, fromRemote)

  }

  //
  // Public
  //

  //
  // Private
  //

  LGScene.prototype._createCore = function() {
    return new THREE.Scene()
  }


  return LGScene

}