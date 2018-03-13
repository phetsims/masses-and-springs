// Copyright 2017-2018, University of Colorado Boulder

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
  var Line = require( 'SCENERY/nodes/Line' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );

  var MassesAndSpringsConstants = {

    //TODO: Insert constants here
    MAX_TEXT_WIDTH: 80,
    DEFAULT_SPRING_LENGTH: 0.5,
    RADIO_BUTTON_RADIUS: 6,

    // Ratio for dt when sim is in slow motion REVIEW: Could include "slow" in its name? Not obvious without reading docs here
    SIM_DT_RATIO: 8,

    // Y position of floor in meters. The floor is at the bottom bounds of the screen.
    FLOOR_Y: 0,

    // Y position of ceiling in meters. The ceiling is the top of the SpringHangerNode, just below the top of the dev view bounds
    CEILING_Y: 1.48,

    // {Property.<Range>} range of damping associated with sim
    //RVEIEW: If exposing only Range, don't use a RangeWithValue? (or if used, document as such)
    DAMPING_RANGE_PROPERTY: new Property( new RangeWithValue( 0, 0.7, 0.3 ) ),

    // {Property.<Range>} range of gravitational acceleration associated with each planet
    //RVEIEW: If exposing only Range, don't use a RangeWithValue? (or if used, document as such)
    GRAVITY_RANGE_PROPERTY: new Property( new RangeWithValue( 0, 30, 9.8 ) ),

    // {Property.<Range>} range of gravitational acceleration associated with each planet
    //REVIEW: No property? Additionally, if you expose only a Range, no reason to use RangeWithValue instead.
    SPRING_CONSTANT_RANGE: new RangeWithValue( 3, 12, 6 ),

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

    // Constants for planets' gravity
    EARTH_GRAVITY: 9.81,
    MOON_GRAVITY: 1.62,
    JUPITER_GRAVITY: 24.79,
    PLANET_X: 14.2,

    // Constants regarding fonts
    LABEL_FONT: new PhetFont( 12 ),
    TITLE_FONT: new PhetFont( 14 ),

    // Constants regarding panels
    PANEL_VERTICAL_SPACING: 10,
    PANEL_CORNER_RADIUS: 5,
    PANEL_MAX_WIDTH: 175,
    PANEL_MIN_WIDTH: 190,
    FORCES_STRING: 'forces',
    NET_FORCE_STRING: 'netForce',
    PANEL_FILL: 'rgb(230,230,230)',
    LINE_SEPARATOR: function( length ) {
      return new Line( 0, 0, length, 0, { stroke: 'gray' } );
    },

    RIGHT_SPRING_X: 1.3 // {number} X position of the spring node in screen coordinates
  };

  massesAndSprings.register( 'MassesAndSpringsConstants', MassesAndSpringsConstants );

  return MassesAndSpringsConstants;
} );