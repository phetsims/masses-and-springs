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
  var Property = require( 'AXON/Property' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );

  var MassesAndSpringsConstants = {
    //TODO: Insert constants here
    MAX_TEXT_WIDTH: 80,
    DEFAULT_SPRING_LENGTH: 0.5,
    frictionRangeProperty: new Property( new RangeWithValue( 0, 10, 1 ) ),

    // Constants for vectors
    VECTOR_ARROW_LENGTH: 34,
    FORCES_ARROW_LENGTH: 31,
    ARROW_HEAD_WIDTH: 14,
    ARROW_TAIL_WIDTH: 8,
    SMALLER_ARROW_HEAD_WIDTH: 11,
    SMALLER_ARROW_TAIL_WIDTH: 3,
    VELOCITY_ARROW_COLOR: 'rgb( 41, 253, 46 )',
    ACCELERATION_ARROW_COLOR: 'rgb( 255, 253, 56 )',
    GRAVITY_ARROW_COLOR: 'rgb( 236, 63, 71 )',
    SPRING_ARROW_COLOR: 'rgb( 36, 36, 255 )',

    // Constants regarding fonts
    FONT: new PhetFont( 12 ),
    LABEL_FONT: new PhetFont( 10 ),
    TITLE_FONT: new PhetFont( { size: 12, weight: 'bold' } ),

    // Constants regarding panels
    PANEL_VERTICAL_SPACING: 10,
    PANEL_CORNER_RADIUS: 7,
    PANEL_MAX_WIDTH: 170,
    PANEL_MIN_WIDTH: 170,
    FORCES_STRING: 'forces',
    NET_FORCE_STRING: 'netForce'
  };

  massesAndSprings.register( 'MassesAndSpringsConstants', MassesAndSpringsConstants );

  return MassesAndSpringsConstants;
} );