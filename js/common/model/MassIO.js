// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for Mass.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import IOType from '../../../../tandem/js/types/IOType.js';
import massesAndSprings from '../../massesAndSprings.js';
import Mass from './Mass.js';

const MassIO = new IOType( 'MassIO', {
  documentation: 'Model element for one of the masses',
  valueType: Mass,
  // TODO: https://github.com/phetsims/tandem/issues/211 ReferenceIO
  toStateObject: mass => {
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
export default MassIO;