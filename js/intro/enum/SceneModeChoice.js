// Copyright 2018-2019, University of Colorado Boulder

/**
 * Enumeration for scene mode choices intro screen.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var Enumeration = require( 'PHET_CORE/Enumeration' );

  // REVIEW: The recent decision was to move enumerations out of enum/ folders. Can you put it in model/?
  return massesAndSprings.register( 'SceneModeChoice', new Enumeration( [ 'SAME_LENGTH', 'ADJUSTABLE_LENGTH' ] ) );
} );