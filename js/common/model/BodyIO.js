// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for Body.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import IOType from '../../../../tandem/js/types/IOType.js';
import massesAndSprings from '../../massesAndSprings.js';
import Body from './Body.js';

const BodyIO = new IOType( 'BodyIO', {
  valueType: Body,
  documentation: 'Planet which determines the force of gravity.',

  // TODO: https://github.com/phetsims/tandem/issues/215 use ReferenceIO or equivalent
  toStateObject: body => {
    if ( body === null ) {
      return null;
    }
    return {
      body: body
    };
  }
} );

massesAndSprings.register( 'BodyIO', BodyIO );
export default BodyIO;