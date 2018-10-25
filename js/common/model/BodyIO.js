// Copyright 2017-2018, University of Colorado Boulder

/**
 * IO type for Body.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var ObjectIO = require( 'TANDEM/types/ObjectIO' );
  var phetioInherit = require( 'TANDEM/phetioInherit' );

  // ifphetio
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );

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
    /**
     * Encodes a Body instance to a state.
     *
     * @param body
     * @returns {*}
     */
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