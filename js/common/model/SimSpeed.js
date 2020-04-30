// Copyright 2020, University of Colorado Boulder

/**
 * Enumeration for the speed of the sim.
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import massesAndSprings from '../../massesAndSprings.js';

const SimSpeed = Enumeration.byKeys( [
  'NORMAL',
  'SLOW'
] );
massesAndSprings.register( 'SimSpeed', SimSpeed );
export default SimSpeed;