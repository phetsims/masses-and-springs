// Copyright 2020, University of Colorado Boulder

/**
 * Enumeration for showing the composite forces or the net force
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );

  return massesAndSprings.register( 'ForcesMode', Enumeration.byKeys( [
    'FORCES',
    'NET_FORCES'
  ] ) );
} );