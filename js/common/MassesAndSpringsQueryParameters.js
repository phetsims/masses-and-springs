// Copyright 2016, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );

  var MassesAndSpringQueryParameters = QueryStringMachine.getAll( {

    // {boolean} print the spring constant and spring length, to the console.
    printSpringProperties: { type: 'flag' }
  } );

  massesAndSprings.register( 'MassesAndSpringQueryParameters', MassesAndSpringQueryParameters );

  return MassesAndSpringQueryParameters;
} );
