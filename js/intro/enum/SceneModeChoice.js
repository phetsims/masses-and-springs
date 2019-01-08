// Copyright 2018, University of Colorado Boulder

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

  var SceneModeChoice = new Enumeration( [ 'SAME_LENGTH', 'ADJUSTABLE_LENGTH' ] );

  massesAndSprings.register( 'SceneModeChoice', SceneModeChoice );


  return SceneModeChoice;
} );