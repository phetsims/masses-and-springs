// Copyright 2017-2018, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );

  var MassesAndSpringsQueryParameters = QueryStringMachine.getAll( {

    // {boolean} print the spring constant and spring length, to the console.
    //REVIEW: Is this going to be kept for the production sim, or should it be removed now?
    printSpringProperties: { type: 'flag' }
  } );

  massesAndSprings.register( 'MassesAndSpringsQueryParameters', MassesAndSpringsQueryParameters );

  return MassesAndSpringsQueryParameters;
} );
