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

  var TMass = function( instance, phetioID ) {
    assertInstanceOf( instance, phet.massesAndSprings.Mass );
    TObject.call( this, instance, phetioID );
  };

  phetioInherit( TObject, 'TMass', TMass, {}, {
    toStateObject: function( mass ) {
      if ( mass === null ) {
        return null;
      }
      return {
        mass: mass.mass,
        color: mass.color
      };
    }


  } );

  phetioNamespace.register( 'TMass', TMass );

  return TMass;
} );