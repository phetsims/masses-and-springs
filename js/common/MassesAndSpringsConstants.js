// Copyright 2016, University of Colorado Boulder

/**
 * @author Denzell Barnett
 *
 * Constants used throughout this simulation.
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
    TITLE_FONT: new PhetFont( { size: 12, weight: 'bold' } )
  };

  massesAndSprings.register( 'MassesAndSpringsConstants', MassesAndSpringsConstants );

  return MassesAndSpringsConstants;
} );