// Copyright 2017-2018, University of Colorado Boulder

/**
 * IO type for Mass.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Mass = require( 'MASSES_AND_SPRINGS/common/model/Mass' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var ObjectIO = require( 'TANDEM/types/ObjectIO' );
  var phetioInherit = require( 'TANDEM/phetioInherit' );
  var validate = require( 'AXON/validate' );

  /**
   * @param {Mass} mass
   * @param {string} phetioID
   * @constructor
   */
  function MassIO( mass, phetioID ) {
    ObjectIO.call( this, mass, phetioID );
  }

  phetioInherit( ObjectIO, 'MassIO', MassIO, {}, {
    validator: { valueType: Mass },
    /**
     * Encodes a Mass instance to a state.
     *
     * @param mass
     * @returns {*}
     */
    toStateObject: function( mass ) {
      validate( mass, this.validator );
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