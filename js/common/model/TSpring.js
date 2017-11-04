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
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var TObject = require( 'ifphetio!PHET_IO/types/TObject' );

  /**
   *
   * @param instance
   * @param phetioID
   * @constructor
   */
  function TSpring( instance, phetioID ) {
    assert && assertInstanceOf( instance, phet.massesAndSprings.Spring );
    TObject.call( this, instance, phetioID );
  }

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

  massesAndSprings.register( 'TSpring', TSpring );

  return TSpring;
} );