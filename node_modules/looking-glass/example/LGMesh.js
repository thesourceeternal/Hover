THREE = require('three')

module.exports = function( universe ) {

  var LGObject3D = universe.classes.LGObject3D
  var __instances__ = universe.instances

  LGMesh.prototype = Object.create( LGObject3D.prototype )
  LGMesh.prototype.constructor = LGMesh
  LGMesh.type = 'LGMesh'

  function LGMesh( args, skipInitialization, fromRemote ) {

    // call SuperClass, but skip initialization
    LGObject3D.call( this, args, true, fromRemote )

    // define properties
    this._defineProperties({
      geometry:  { type: 'string', default: null, },
      material:  { type: 'string', default: null, },
    })

    this.on('geometry', function( geometryId ) {
      
      // get geometry reference
      var geometryObj, geometryCore
      geometryObj = __instances__[ geometryId ]
      if (geometryObj) geometryCore = geometryObj.core
      
      // if geometry found, set
      if (geometryCore) {
      
        this.core.geometry = geometryCore
      
      } else {

        throw new Error( 'couldn\'t find geometry for id:', geometryId )

      }

    })

    this.on('material', function( materialId ) {

      // get material reference
      var materialObj, materialCore
      materialObj = __instances__[ materialId ]
      if (materialObj) materialCore = materialObj.core
      
      // if material found, set
      if (materialCore) {
      
        this.core.material = materialCore
      
      } else {

        throw new Error( 'couldn\'t find material for id:', materialId )

      }
      
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

  LGMesh.prototype._createCore = function() {
    return new THREE.Mesh()
  }


  return LGMesh

}