// Copyright 2017, University of Colorado Boulder

/**
 * IO type for Body.
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
   * @param {Body} body
   * @param {string} phetioID
   * @constructor
   */
  function BodyIO( body, phetioID ) {
    assert && assertInstanceOf( body, phet.massesAndSprings.Body );
    ObjectIO.call( this, body, phetioID );
  }

  phetioInherit( ObjectIO, 'BodyIO', BodyIO, {}, {
    toStateObject: function( body ) {
      assert && assertInstanceOf( body, phet.massesAndSprings.Body );
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