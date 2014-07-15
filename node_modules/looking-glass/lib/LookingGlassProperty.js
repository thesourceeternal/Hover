module.exports = LGProperty

function LGProperty( args ) {

  this.type = args.type
  this.value = args.default 
  this.reliable = (undefined === args.reliable) ? true : args.reliable

}

LGProperty.prototype.set = function( value ) {

  this.value = value

}

LGProperty.prototype.get = function() {

  return this.value

}

LGProperty.prototype.serialize = function() {

  switch( this.type ) {
    
    case 'string':
      return String( this.value )

    case 'int':
      return Number( this.value )

    default:
      return JSON.stringify( this.value )

  }
  
}

LGProperty.prototype.deserialize = function( data ) {

  switch( this.type ) {
    
    case 'string':
      this.value = String( data )
      break

    case 'int':
      this.value = Number( data )
      break

    default:
      this.value = JSON.parse( data )

  }
  
}