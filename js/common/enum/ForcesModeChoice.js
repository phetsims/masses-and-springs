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

  var ForcesModeChoice = {
    FORCES: 'FORCES',
    NET_FORCES: 'NET_FORCES'
  };

  massesAndSprings.register( 'ForcesModeChoice', ForcesModeChoice );

  // @public {Array.<ForcesModeChoice>} - All values the enumeration can take.
  ForcesModeChoice.VALUES = [
    ForcesModeChoice.FORCES,
    ForcesModeChoice.NET_FORCES
  ];

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( ForcesModeChoice ); }

  return ForcesModeChoice;
} );