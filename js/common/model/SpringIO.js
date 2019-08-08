// Copyright 2017-2019, University of Colorado Boulder

/**
 * IO type for Spring.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var ObjectIO = require( 'TANDEM/types/ObjectIO' );
  var phetioInherit = require( 'TANDEM/phetioInherit' );
  var Spring = require( 'MASSES_AND_SPRINGS/common/model/Spring' );
  var validate = require( 'AXON/validate' );

  /**
   * @param {Spring} spring
   * @param {string} phetioID
   * @constructor
   */
  function SpringIO( spring, phetioID ) {
    ObjectIO.call( this, spring, phetioID );
  }

  phetioInherit( ObjectIO, 'SpringIO', SpringIO, {}, {
    documentation: 'Hangs from the ceiling and applies a force to any attached BodyIO',

    validator: { valueType: Spring },
    /**
     * Encodes a Spring instance to a state.
     *
     * @param spring
     * @returns {*}
     */
    toStateObject: function( spring ) {
      validate( spring, this.validator );
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