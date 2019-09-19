// Copyright 2017-2019, University of Colorado Boulder

/**
 * IO type for Body.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Body = require( 'MASSES_AND_SPRINGS/common/model/Body' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  const ObjectIO = require( 'TANDEM/types/ObjectIO' );
  const validate = require( 'AXON/validate' );

  class BodyIO extends ObjectIO {

    /**
     * Encodes a Body instance to a state.
     *
     * @param body
     * @returns {*}
     */
    static toStateObject( body ) {
      validate( body, this.validator );
      if ( body === null ) {
        return null;
      }
      return {
        body: body
      };
    }
  }

  BodyIO.validator = { valueType: Body };
  BodyIO.documentation = 'Planet which determines the force of gravity.';
  BodyIO.typeName = 'BodyIO';
  ObjectIO.validateSubtype( BodyIO );

  return massesAndSprings.register( 'BodyIO', BodyIO );
} );