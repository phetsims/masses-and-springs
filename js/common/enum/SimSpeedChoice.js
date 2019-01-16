// Copyright 2018, University of Colorado Boulder

/**
 * Enumeration for sim speed choices.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var Enumeration = require( 'PHET_CORE/Enumeration' );

  return massesAndSprings.register( 'SimSpeedChoice', new Enumeration( [ 'NORMAL', 'SLOW' ] ) );
} );
