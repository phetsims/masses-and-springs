// Copyright 2020, University of Colorado Boulder

/**
 * Enumeration for setting the scene on the first screen.
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import massesAndSprings from '../../massesAndSprings.js';

const SceneMode = Enumeration.byKeys( [
  'SAME_LENGTH',
  'ADJUSTABLE_LENGTH'
] );
massesAndSprings.register( 'SceneMode', SceneMode );
export default SceneMode;