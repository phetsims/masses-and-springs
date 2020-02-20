// Copyright 2020, University of Colorado Boulder

/**
 * Enumeration for setting the scene on the first screen.
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );

  return massesAndSprings.register( 'SceneMode', Enumeration.byKeys( [
    'SAME_LENGTH',
    'ADJUSTABLE_LENGTH'
  ] ) );
} );