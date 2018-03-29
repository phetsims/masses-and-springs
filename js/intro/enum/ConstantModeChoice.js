// Copyright 2018, University of Colorado Boulder

/**
 * Enumeration for choices for constant parameter for intro screen adjustable length mode.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );

  var ConstantModeChoice = {
    SPRING_CONSTANT: 'SPRING_CONSTANT',
    SPRING_THICKNESS: 'SPRING_THICKNESS',
    NULL: null
  };

  massesAndSprings.register( 'ConstantModeChoice', ConstantModeChoice );

  // @public {Array.<SpringModeChoice>} - All values the enumeration can take.
  ConstantModeChoice.VALUES = [
    ConstantModeChoice.SPRING_CONSTANT,
    ConstantModeChoice.SPRING_THICKNESS,
    ConstantModeChoice.NULL
  ];

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( ConstantModeChoice ); }

  return ConstantModeChoice;
} );