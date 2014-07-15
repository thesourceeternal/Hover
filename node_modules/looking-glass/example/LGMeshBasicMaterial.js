THREE = require('three')

module.exports = function( universe ) {

  var LGMaterial = universe.classes.LGMaterial
  var __instances__ = universe.instances

  LGMeshBasicMaterial.prototype = Object.create( LGMaterial.prototype )
  LGMeshBasicMaterial.prototype.constructor = LGMeshBasicMaterial
  LGMeshBasicMaterial.type = 'LGMeshBasicMaterial'

  function LGMeshBasicMaterial( args, skipInitialization, fromRemote ) {

    // call SuperClass, but skip initialization
    LGMaterial.call( this, args, true, fromRemote )

    // define properties
    this._defineProperties({
      color: { type: 'int', default: 0xffffff, },
    })

    this.on('color', function( newColor ) {
      
      this.core.color.set( newColor )

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

  LGMeshBasicMaterial.prototype._createCore = function() {
    return new THREE.MeshBasicMaterial()
  }


  return LGMeshBasicMaterial

}