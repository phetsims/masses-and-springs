// Copyright 2020-2022, University of Colorado Boulder

/**
 * Enumeration for setting the scene on the first screen.
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import EnumerationDeprecated from '../../../../phet-core/js/EnumerationDeprecated.js';
import massesAndSprings from '../../massesAndSprings.js';

const SceneMode = EnumerationDeprecated.byKeys( [
  'SAME_LENGTH',
  'ADJUSTABLE_LENGTH'
] );
massesAndSprings.register( 'SceneMode', SceneMode );
export default SceneMode;