// Copyright 2018, University of Colorado Boulder

/**
 * Enumeration for scene mode choices intro Screen.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );

  var SceneModeChoice = {
    SAME_LENGTH: 'SAME_LENGTH',
    ADJUSTABLE_LENGTH: 'ADJUSTABLE_LENGTH'
  };

  massesAndSprings.register( 'SceneModeChoice', SceneModeChoice );

  // @public {Array.<SpringModeChoice>} - All values the enumeration can take.
  SceneModeChoice.VALUES = [
    SceneModeChoice.SAME_LENGTH,
    SceneModeChoice.ADJUSTABLE_LENGTH
  ];

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( SceneModeChoice ); }

  return SceneModeChoice;
} );