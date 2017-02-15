// Copyright 2016, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Denzell Barnett
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );


  var MassesAndSpringsConstants = {
    //TODO: Insert constants here
    PANEL_VERTICAL_SPACING: 10,
    FONT: new PhetFont( 12 ),
    LABEL_FONT: new PhetFont( 10 ),
    TITLE_FONT: new PhetFont( { size: 12, weight: 'bold' } ),
    PANEL_CORNER_RADIUS: 7,
    MAX_TEXT_WIDTH: 80
  };

  massesAndSprings.register( 'MassesAndSpringsConstants', MassesAndSpringsConstants );

  return MassesAndSpringsConstants;
} );