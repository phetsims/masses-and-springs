// Copyright 2020, University of Colorado Boulder

/**
 * Enumeration for the speed of the sim.
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );

  return massesAndSprings.register( 'SimSpeed', Enumeration.byKeys( [
    'NORMAL',
    'SLOW'
  ] ) );
} );