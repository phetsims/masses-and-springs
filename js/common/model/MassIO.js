// Copyright 2017, University of Colorado Boulder

/**
 * PhET-iO wrapper type for Masses-And-Springs built-in Mass type.
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
  function MassIO( instance, phetioID ) {
    assert && assertInstanceOf( instance, phet.massesAndSprings.Mass );
    ObjectIO.call( this, instance, phetioID );
  }

  phetioInherit( ObjectIO, 'MassIO', MassIO, {}, {
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

  massesAndSprings.register( 'MassIO', MassIO );

  return MassIO;
} );