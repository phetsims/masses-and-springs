// Copyright 2020, University of Colorado Boulder

/**
 * Enumeration for setting which parameter to keep constant in the spring system .
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Enumeration = require( 'PHET_CORE/Enumeration' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );

  return massesAndSprings.register( 'ConstantMode', Enumeration.byKeys( [
    'SPRING_CONSTANT',
    'SPRING_THICKNESS'
  ] ) );
} );