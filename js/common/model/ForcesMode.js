// Copyright 2020, University of Colorado Boulder

/**
 * Enumeration for showing the composite forces or the net force
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import massesAndSprings from '../../massesAndSprings.js';

const ForcesMode = Enumeration.byKeys( [
  'FORCES',
  'NET_FORCES'
] );
massesAndSprings.register( 'ForcesMode', ForcesMode );
export default ForcesMode;