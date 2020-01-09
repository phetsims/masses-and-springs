// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO type for Mass.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Mass = require( 'MASSES_AND_SPRINGS/common/model/Mass' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  const ObjectIO = require( 'TANDEM/types/ObjectIO' );
  const validate = require( 'AXON/validate' );

  class MassIO extends ObjectIO {
    /**
     * Encodes a Mass instance to a state.
     *
     * @param mass
     * @returns {*}
     */
    static toStateObject( mass ) {
      validate( mass, this.validator );
      if ( mass === null ) {
        return null;
      }
      return {
        mass: mass.mass,
        color: mass.color
      };
    }
  }

  MassIO.validator = { valueType: Mass };
  MassIO.typeName = 'MassIO';
  MassIO.documentation = 'Model element for one of the masses';
  ObjectIO.validateSubtype( MassIO );

  return massesAndSprings.register( 'MassIO', MassIO );
} );