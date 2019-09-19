// Copyright 2017-2019, University of Colorado Boulder

/**
 * IO type for Spring.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  const ObjectIO = require( 'TANDEM/types/ObjectIO' );
  const Spring = require( 'MASSES_AND_SPRINGS/common/model/Spring' );
  const validate = require( 'AXON/validate' );

  class SpringIO extends ObjectIO {

    /**
     * Encodes a Spring instance to a state.
     *
     * @param spring
     * @returns {*}
     */
    static toStateObject( spring ) {
      validate( spring, this.validator );
      if ( spring === null ) {
        return null;
      }
      return {
        position: spring.positionProperty.get(),
        id: spring.tandem.phetioID
      };
    }
  }

  SpringIO.documentation = 'Hangs from the ceiling and applies a force to any attached BodyIO';
  SpringIO.validator = { valueType: Spring };
  SpringIO.typeName = 'SpringIO';
  ObjectIO.validateSubtype( SpringIO );

  return massesAndSprings.register( 'SpringIO', SpringIO );
} );