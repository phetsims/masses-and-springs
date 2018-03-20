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

  var SimSpeedChoice = {
    NORMAL: 'NORMAL',
    SLOW: 'SLOW'
  };

  massesAndSprings.register( 'SimSpeedChoice', SimSpeedChoice );

  // @public {Array.<SimSpeedChoice>} - All values the enumeration can take.
  SimSpeedChoice.VALUES = [
    SimSpeedChoice.NORMAL, // e.g. sim steps with dt
    SimSpeedChoice.SLOW // e.g. sim steps with dt/8
  ];

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( SimSpeedChoice ); }

  return SimSpeedChoice;
} );
