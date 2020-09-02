// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for Spring.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import validate from '../../../../axon/js/validate.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import massesAndSprings from '../../massesAndSprings.js';
import Spring from './Spring.js';

class SpringIO extends ObjectIO {

  /**
   * Encodes a Spring instance to a state.
   * @param {Spring} spring
   *
   * @public
   * @override
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

massesAndSprings.register( 'SpringIO', SpringIO );
export default SpringIO;