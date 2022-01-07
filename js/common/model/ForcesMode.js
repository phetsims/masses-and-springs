// Copyright 2020-2022, University of Colorado Boulder

/**
 * Enumeration for showing the composite forces or the net force
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import EnumerationDeprecated from '../../../../phet-core/js/EnumerationDeprecated.js';
import massesAndSprings from '../../massesAndSprings.js';

const ForcesMode = EnumerationDeprecated.byKeys( [
  'FORCES',
  'NET_FORCES'
] );
massesAndSprings.register( 'ForcesMode', ForcesMode );
export default ForcesMode;