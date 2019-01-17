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

  // REVIEW: The recent decision was to move enumerations out of enum/ folders. Can you put it in model/?
  return massesAndSprings.register( 'ForcesModeChoice', new Enumeration( [ 'FORCES', 'NET_FORCES' ] ) );
} );