// Copyright 2017-2018, University of Colorado Boulder

/**
 * IO type for Spring.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  
  // phet-io modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );

  /**
   * @param {Spring} spring
   * @param {string} phetioID
   * @constructor
   */
  function SpringIO( spring, phetioID ) {
    assert && assertInstanceOf( spring, phet.massesAndSprings.Spring );
    ObjectIO.call( this, spring, phetioID );
  }

  phetioInherit( ObjectIO, 'SpringIO', SpringIO, {}, {
    toStateObject: function( spring ) {
      assert && assertInstanceOf( spring, phet.massesAndSprings.Spring );
      if ( spring === null ) {
        return null;
      }
      return {
        position: spring.positionProperty.get(),
        id: spring.tandem.phetioID
      };
    }
  } );

  massesAndSprings.register( 'SpringIO', SpringIO );

  return SpringIO;
} );