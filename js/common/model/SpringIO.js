// Copyright 2017, University of Colorado Boulder

/**
 * PhET-iO wrapper type for Masses-And-Springs built-in Spring type.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );

  /**
   *
   * @param instance
   * @param phetioID
   * @constructor
   */
  function SpringIO( instance, phetioID ) {
    assert && assertInstanceOf( instance, phet.massesAndSprings.Spring );
    ObjectIO.call( this, instance, phetioID );
  }

  phetioInherit( ObjectIO, 'SpringIO', SpringIO, {}, {
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

  massesAndSprings.register( 'SpringIO', SpringIO );

  return SpringIO;
} );