// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO type for Body.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import validate from '../../../../axon/js/validate.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import massesAndSprings from '../../massesAndSprings.js';
import Body from './Body.js';

class BodyIO extends ObjectIO {

  /**
   * Encodes a Body instance to a state.
   * @param {Body} body
   *
   * @public
   * @override
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

massesAndSprings.register( 'BodyIO', BodyIO );
export default BodyIO;