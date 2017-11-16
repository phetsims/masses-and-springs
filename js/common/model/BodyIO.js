// Copyright 2017, University of Colorado Boulder

/**
 * PhET-iO wrapper type for Masses-And-Springs built-in Body type.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );

  /**
   *
   * @param instance
   * @param phetioID
   * @constructor
   */
  function BodyIO( instance, phetioID ) {
    assert && assertInstanceOf( instance, phet.massesAndSprings.Body );
    ObjectIO.call( this, instance, phetioID );
  }

  phetioInherit( ObjectIO, 'BodyIO', BodyIO, {}, {
    toStateObject: function( body ) {
      if ( body === null ) {
        return null;
      }
      return {
        body: body
      };
    }
  } );

  massesAndSprings.register( 'BodyIO', BodyIO );

  return BodyIO;
} );