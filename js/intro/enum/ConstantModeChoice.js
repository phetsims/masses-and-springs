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


  var ConstantModeChoice = new Enumeration( [ 'SPRING_CONSTANT', 'SPRING_THICKNESS' ] );

  massesAndSprings.register( 'ConstantModeChoice', ConstantModeChoice );

  return ConstantModeChoice;
} );