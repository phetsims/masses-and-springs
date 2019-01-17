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
  var Enumeration = require( 'PHET_CORE/Enumeration' );

  // REVIEW: The recent decision was to move enumerations out of enum/ folders. Can you put it in model/?
  var ConstantModeChoice = new Enumeration( [ 'SPRING_CONSTANT', 'SPRING_THICKNESS' ] );

  // REVIEW: Other enums return the register, and inline the variable. Maybe that would work better?
  massesAndSprings.register( 'ConstantModeChoice', ConstantModeChoice );

  return ConstantModeChoice;
} );