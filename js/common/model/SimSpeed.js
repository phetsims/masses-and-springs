// Copyright 2020-2022, University of Colorado Boulder

/**
 * Enumeration for the speed of the sim.
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import EnumerationDeprecated from '../../../../phet-core/js/EnumerationDeprecated.js';
import massesAndSprings from '../../massesAndSprings.js';

const SimSpeed = EnumerationDeprecated.byKeys( [
  'NORMAL',
  'SLOW'
] );
massesAndSprings.register( 'SimSpeed', SimSpeed );
export default SimSpeed;