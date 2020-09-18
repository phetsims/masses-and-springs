// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for Spring.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import IOType from '../../../../tandem/js/types/IOType.js';
import massesAndSprings from '../../massesAndSprings.js';
import Spring from './Spring.js';

const SpringIO = new IOType( 'SpringIO', {
  valueType: Spring,
  documentation: 'Hangs from the ceiling and applies a force to any attached BodyIO',

  // TODO: https://github.com/phetsims/tandem/issues/211 ReferenceIO
  toStateObject: spring => {
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
export default SpringIO;