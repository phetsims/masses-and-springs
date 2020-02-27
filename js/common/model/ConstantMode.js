// Copyright 2020, University of Colorado Boulder

/**
 * Enumeration for setting which parameter to keep constant in the spring system .
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import massesAndSprings from '../../massesAndSprings.js';

export default massesAndSprings.register( 'ConstantMode', Enumeration.byKeys( [
  'SPRING_CONSTANT',
  'SPRING_THICKNESS'
] ) );