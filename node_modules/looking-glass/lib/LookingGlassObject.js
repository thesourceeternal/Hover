var extend = require('extend')
var EventEmitter = require('events').EventEmitter
var generateId = require('hat')
var LGProperty = require('./LookingGlassProperty.js')

module.exports = function( universe ) {

  var __connection__ = universe.connection
  var __instances__ = universe.instances

  LookingGlassObject.type = 'LookingGlassObject'

  function LookingGlassObject( args, skipInitialization, fromRemote ) {

    args = args || {}

    // set id
    if ( args.id ) {
      this.id = args.id
      delete args.id      
    } else {
      this.id = generateId()
    }
    __instances__[ this.id ] = this

    // create the core object (if any)
    if (this._createCore) this.core = this._createCore( args )

    // make this an event emitter
    extend( this, new EventEmitter() )

    // define properties
    this._defineProperties({})

    // initialize after we're done defining properties, allowing the subClass to define properties
    if (!skipInitialization) this._initialize(args, fromRemote)

  }

  //
  // Public
  //

  LookingGlassObject.prototype.get = function( key ) {
   
    var prop = this._state[ key ]
    if (!prop) throw new Error( 'No such property "'+key+'" on '+this.constructor.type )
    return prop.get()

  }

  LookingGlassObject.prototype.set = function( key, value ) {
   
    var prop = this._state[ key ]
    if (!prop) throw new Error( 'No such property "'+key+'" on '+this.constructor.type )
    
    // set locally
    this._set( key, value )

    // set remotely
    if ( prop.reliable ) {
      __connection__.emitReliable( this.id, key, prop.serialize() )
    } else {
      __connection__.emitUnreliable( this.id, key, prop.serialize() )
    }

  }

  //
  // Private
  //

  LookingGlassObject.prototype._initialize = function ( args, fromRemote ) {
    // set initial args
    Object.keys(args).map(function(key){
      this.set(key, args[key])
    }.bind(this))

    // listen for remote changes
    __connection__.on( this.id, this._set.bind(this) )

    // announce instantiation
    if (!fromRemote) __connection__.emitReliable( this.constructor.type, this.id, args )
  }

  LookingGlassObject.prototype._defineProperties = function( properties ) {

    // create the state
    if (!this._state) {
      Object.defineProperty( this, '_state', { value: {} } )
    }

    // define each property
    Object.keys(properties).map(function(key){

      this._state[ key ] = new LGProperty( properties[ key ] )

    }.bind(this))    

  }

  LookingGlassObject.prototype._set = function( key, value ) {
    
    var prop = this._state[ key ]

    // deserialize (and set) value if string
    if (typeof value === 'string') {
      prop.deserialize( value )
    // otherwise just set it
    } else {
      prop.set( value )
    }

    // report that this value was updated
    this.emit( key, prop.get() )

  }


  return LookingGlassObject

}
