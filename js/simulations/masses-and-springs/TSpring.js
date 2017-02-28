// Copyright 2016-2017, University of Colorado Boulder

/**
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'PHET_IO/assertions/assertInstanceOf' );
  var phetioNamespace = require( 'PHET_IO/phetioNamespace' );
  var phetioInherit = require( 'PHET_IO/phetioInherit' );
  var TObject = require( 'PHET_IO/types/TObject' );

  var TSpring = function( instance, phetioID ) {
    assertInstanceOf( instance, phet.massesAndSprings.Spring );
    TObject.call( this, instance, phetioID );
  };

  phetioInherit( TObject, 'TSpring', TSpring, {}, {
    toStateObject: function( spring ) {
      if ( spring === null ) {
        return null;
      }
      return {
        position: spring.positionProperty.get(),
        id: spring.phetioID
      };
    }


  } );

  phetioNamespace.register( 'TSpring', TSpring );

  return TSpring;
} );