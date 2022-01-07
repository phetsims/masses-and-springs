// Copyright 2020-2022, University of Colorado Boulder

/**
 * Enumeration for setting which parameter to keep constant in the spring system .
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import EnumerationDeprecated from '../../../../phet-core/js/EnumerationDeprecated.js';
import massesAndSprings from '../../massesAndSprings.js';

const ConstantMode = EnumerationDeprecated.byKeys( [
  'SPRING_CONSTANT',
  'SPRING_THICKNESS'
] );
massesAndSprings.register( 'ConstantMode', ConstantMode );
export default ConstantMode;