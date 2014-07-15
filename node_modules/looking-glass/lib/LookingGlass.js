var LookingGlassObject = require('./LookingGlassObject.js')

module.exports = LookingGlass


function LookingGlass( connection ) {
  
  this.connection = connection
  this.classes = {}
  this.instances = {}

  this.registerClass( LookingGlassObject )

}

LookingGlass.prototype.registerClass = function( ClassDefinition ) {
 
  var Class = ClassDefinition( this )
  this.classes[ Class.type ] = Class

  this.connection.on( Class.type, function(id, args) {
    args.id = id
    // instantiate with the args, dont skip intialization, is from remote
    new Class( args, false, true )
  })

}