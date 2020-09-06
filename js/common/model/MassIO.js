// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for Mass.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import validate from '../../../../axon/js/validate.js';
import ObjectIO from '../../../../tandem/js/types/ObjectIO.js';
import massesAndSprings from '../../massesAndSprings.js';
import Mass from './Mass.js';

class MassIO extends ObjectIO {
  /**
   * Encodes a Mass instance to a state.
   * @param {Mass} mass
   *
   * @public
   * @override
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
ObjectIO.validateIOType( MassIO );

massesAndSprings.register( 'MassIO', MassIO );
export default MassIO;